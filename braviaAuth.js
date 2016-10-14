var Request = require('request');
var Q = require('q');
var StringFormat = require('string-format');
var BraviaDiscovery = require('./braviaDiscovery');

const os = require('os');

function BraviaAuth(discovery) {
  this.discovery = discovery;
  this.clientId = '{hostname}:642a76ca-9102-11e6-ae22-56b6b6499611';
  this.nickname = 'node-bravia-androidtv ({hostname})';
}

BraviaAuth.prototype.authenticate = function(code) {
  var deferred = Q.defer();

  if (this.cookie) {
    deferred.resolve(this.cookie);
  } else {
    var self = this;
    this.discovery.getUrl().then(function(url) {
      var clientId = self.clientId.format({hostname: hostname()});
      var nickname = self.nickname.format({hostname: os.hostname()});
      authRequest(url, clientId, nickname, code).then(function(response) {
        if (response.statusCode == 200) {
          var cookie = parseCookie(response.headers);
          self.cookie = cookie;
          deferred.resolve(cookie);
        } else if (response.statusCode == 401) {
          deferred.resolve();
        } else {
          deferred.reject('Unexpected '+response.statusCode+' response');
        }
      }, deferred.reject);
    }, deferred.reject);
  }

  return deferred.promise;
};

function hostname() {
  os.hostname()
    .toLowerCase()
    .replace(/\..*$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function authRequest(url, clientId, nickname, code) {
  var deferred = Q.defer();

  var headers = {};
  if (code !== undefined) {
    headers['Authorization'] = 'Basic ' + new Buffer(':' + code).toString('base64');
  }

  Request.post({
    method: 'POST',
    uri: url + '/accessControl',
    json: {
      id: 1,
      method: 'actRegister',
      version: '1.0',
      params: [
        {
          clientid: clientId,
          nickname: nickname,
          level: 'private'
        },
        [
          {
            value: 'yes',
            function: 'WOL'
          }
        ]
      ]
    },
    headers: headers
  }, function (error, response, body) {
    if (!error) {
      deferred.resolve(response);
    } else{
      deferred.reject(error);
    }
  });

  return deferred.promise;
}

function parseCookie(headers) {
  return headers['set-cookie'][0].split(';')[0];
};

module.exports = BraviaAuth;
