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
}

module.exports = Bravia;
