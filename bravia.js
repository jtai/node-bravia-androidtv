var Request = require('request');
var Q = require('q');
var StringFormat = require('string-format');
var BraviaDiscovery = require('./braviaDiscovery');
var BraviaAuth = require('./braviaAuth');

function Bravia(ip) {
  this.discovery = new BraviaDiscovery(ip);
  this.auth = new BraviaAuth(this.discovery);
}

Bravia.prototype.discover = function() {
  return this.discovery.getIp();
};

Bravia.prototype.authenticate = function(code) {
  return this.auth.getCookie(code);
};

Bravia.prototype.getPowerStatus = function() {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      getPowerStatus(url, cookie, self.auth)
        .then(deferred.resolve, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getPlayingContentInfo = function() {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      getPlayingContentInfo(url, cookie, self.auth)
        .then(deferred.resolve, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getCommands = function() {
  var deferred = Q.defer();

  if (this.commands) {
    deferred.resolve(this.commands);
  } else {
    var self = this;
    this.discovery.getUrl().then(function(url) {
      self.auth.getCookie().then(function(cookie) {
        getRemoteControllerInfo(url, cookie, self.auth).then(function(response) {
          if (response && response.result !== undefined) {
            self.commands = response.result[1].reduce(function(commands, command) {
              commands[command.name] = command.value;
              return commands;
            }, {});
            deferred.resolve(self.commands);
          } else {
            deferred.reject('Unexpected response: '+JSON.stringify(response));
          }
        }, deferred.reject);
      }, deferred.reject);
    }, deferred.reject);
  }

  return deferred.promise;
};

Bravia.prototype.sendCommand = function(command) {
  var deferred = Q.defer();

  var self = this;
  this.getCommands().then(function(commands) {
    self.discovery.getUrl().then(function(url) {
      self.auth.getCookie().then(function(cookie) {
        var code = commands[command];
        sendCommandCode(url, cookie, code, self.auth)
          .then(deferred.resolve, deferred.reject);
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

function getPowerStatus(url, cookie, auth) {
  var json = {
   'id': 2,
   'method': 'getPowerStatus',
   'version': '1.0',
   'params': []
  };

  return jsonRequest(url + '/system', json, cookie, auth);
}

function getPlayingContentInfo(url, cookie, auth) {
  var json = {
   'id': 2,
   'method': 'getPlayingContentInfo',
   'version': '1.0',
   'params': []
  };

  return jsonRequest(url + '/avContent', json, cookie, auth);
}

function getRemoteControllerInfo(url, cookie, auth) {
  var json = {
   'id': 2,
   'method': 'getRemoteControllerInfo',
   'version': '1.0',
   'params': []
  };

  return jsonRequest(url + '/system', json, cookie, auth);
}

function sendCommandCode(url, cookie, code, auth) {
  var deferred = Q.defer();

  var body = '<?xml version="1.0"?>' +
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
      '<s:Body>' +
        '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
          '<IRCCCode>{code}</IRCCCode>' +
        '</u:X_SendIRCC>' +
      '</s:Body>' +
    '</s:Envelope>';

  Request.post({
    method: 'POST',
    uri: url + '/IRCC',
    body: body.format({code: code}),
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8',
      'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
      'Cookie': cookie
    }
  }, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 200) {
        deferred.resolve();
      } else if (response.statusCode == 403) {
        auth.clearCookie();
        deferred.reject(error);
      } else {
        deferred.reject(error);
      }
    } else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
}

function jsonRequest(url, json, cookie, auth) {
  var deferred = Q.defer();

  Request.post({
    method: 'POST',
    uri: url,
    json: json,
    headers: {
      'Cookie': cookie
    }
  }, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 200) {
        deferred.resolve(body);
      } else if (response.statusCode == 403) {
        auth.clearCookie();
        deferred.reject(error);
      } else {
        deferred.reject(error);
      }
    } else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
}

module.exports = Bravia;
