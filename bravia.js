var Request = require('request');
var Q = require('q');
var StringFormat = require('string-format');
var BraviaDiscovery = require('./braviaDiscovery');
var BraviaAuth = require('./braviaAuth');

function Bravia(ip, mac, filter) {
  this.discovery = new BraviaDiscovery(ip, mac, filter);
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
      var json = {
       'id': 2,
       'method': 'getPowerStatus',
       'version': '1.0',
       'params': []
      };
      jsonRequest(url + '/system', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0].status);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getPowerSavingMode = function() {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'getPowerSavingMode',
       'version': '1.0',
       'params': []
      };
      jsonRequest(url + '/system', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0].mode);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setPowerSavingMode = function(mode) {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'setPowerSavingMode',
       'version': '1.0',
       'params': [{
         'mode': mode // "off" (for display on) or "pictureOff" (for display off)
       }]
      };
      jsonRequest(url + '/system', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getPlayingContentInfo = function() {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'getPlayingContentInfo',
       'version': '1.0',
       'params': []
      };
      jsonRequest(url + '/avContent', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0]);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getApplicationList = function() {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'getApplicationList',
       'version': '1.0',
       'params': []
      };
      jsonRequest(url + '/appControl', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0]);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setActiveApp = function(appUri) {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'setActiveApp',
       'version': '1.0',
       'params': [{
         'uri': appUri
       }]
      };
      jsonRequest(url + '/appControl', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getVolumeInformation = function() {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'getVolumeInformation',
       'version': '1.0',
       'params': []
      };

      jsonRequest(url + '/audio', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0].find(function(info) {
            return info.target == 'speaker';
          }));
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setAudioMute = function(mute) {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'setAudioMute',
       'version': '1.0',
       'params': [{
         'status': mute
       }]
      };
      jsonRequest(url + '/audio', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setAudioVolume = function(volume) {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    self.auth.getCookie().then(function(cookie) {
      var json = {
       'id': 2,
       'method': 'setAudioVolume',
       'version': '1.0',
       'params': [{
         'target': 'speaker',
         'volume': volume.toString()
       }]
      };
      jsonRequest(url + '/audio', json, cookie, self.auth).then(function(response) {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
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
        var json = {
         'id': 2,
         'method': 'getRemoteControllerInfo',
         'version': '1.0',
         'params': []
        };
        jsonRequest(url + '/system', json, cookie, self.auth).then(function(response) {
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
