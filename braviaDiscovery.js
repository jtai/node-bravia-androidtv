var SsdpClient = require('node-ssdp').Client;
var Q = require('q');
var wol = require('wake_on_lan');
var StringFormat = require('string-format');
var Request = require('request');
var parseString = require('xml2js').parseString;

function BraviaDiscovery(ip, mac, filter){
  this.ssdpClient = new SsdpClient();
  this.st = 'urn:schemas-sony-com:service:IRCC:1';
  this.url = 'http://{ip}/sony';

  this.ip = ip;
  this.mac = mac;
  this.filter = filter;
}

BraviaDiscovery.prototype.getUrl = function(){
  var deferred = Q.defer();

  var self = this;
  this.getIp().then(function (ip){
    deferred.resolve(self.url.format({ip: ip}));
  }, deferred.reject);

  return deferred.promise;
};

BraviaDiscovery.prototype.getIp = function(){
  var deferred = Q.defer();

  if (this.ip){
    deferred.resolve(this.ip);
  }
  else{
    var self = this;
    var discover = function() {
      ssdpDiscover(self.ssdpClient, self.st, self.filter).then(function(ip) {
        self.ip = ip;
        deferred.resolve(ip);
      }, deferred.reject);
    };

    if (this.mac) {
      wakeOnLan(this.mac).delay(1000).fin(discover);
    } else {
      discover();
    }
  }

  return deferred.promise;
};

function wakeOnLan(mac) {
  var deferred = Q.defer();

  wol.wake(mac, function(error) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

function ssdpDiscover(ssdpClient, st, filter){
  var deferred = Q.defer();
  var timer = null;

  ssdpClient.on('response', function (headers, statusCode, rinfo){
    if (statusCode == 200) {
      getDescription(headers.LOCATION, filter, function (){
        if (timer){
          clearTimeout(timer);
          timer = null;
        }
        ssdpClient.stop();
        deferred.resolve(rinfo.address);
      });
    }
  });

  ssdpClient.search(st);

  timer = setTimeout(function(){
    deferred.reject("Discovery timeout");
    ssdpClient.stop();
  }, 4000);

  return deferred.promise;
}

function getDescription(loc, filter, successAction){
  var request = Request.get({
    method: 'GET',
    uri: loc
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      validateDescription(body, filter, successAction);
    }
  });
}

function validateDescription(body, filter, successAction){
  parseString(body, function(err, result){
    if (!err){
      if (filter !== undefined) {
        if (filter(result.root.device[0])) {
          successAction();
        };
      } else {
        successAction();
      }
    }
  });
}

module.exports = BraviaDiscovery;
