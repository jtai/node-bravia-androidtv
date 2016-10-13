var Request = require('request');
var Q = require('q');
var StringFormat = require('string-format');
var BraviaDiscovery = require('./braviaDiscovery');

function BraviaAuth(discovery) {
  this.discovery = discovery;
  this.clientId = '{ip}:642a76ca-9102-11e6-ae22-56b6b6499611';
  this.nickname = 'node-bravia-androidtv';
}

BraviaAuth.prototype.authenticate = function(code) {
  var deferred = Q.defer();

  var self = this;
  this.discovery.getUrl().then(function(url) {
    authRequest(url, self.clientId.format({ip: self.discovery.ip}), self.nickname, code)
      .then(deferred.resolve, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

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

module.exports = BraviaAuth;
