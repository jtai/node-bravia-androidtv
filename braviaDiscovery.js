var SsdpClient = require('node-ssdp').Client;
var Q = require('q');
var StringFormat = require('string-format');

function BraviaDiscovery(ip){
  this.ssdpClient = new SsdpClient();
  this.st = 'urn:schemas-sony-com:service:IRCC:1';
  this.url = 'http://{ip}/sony';

  this.ip = ip;
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
    this.ssdpClient.on('response', function (headers, statusCode, rinfo){
      if (statusCode == 200) {
        if (self.timer){
          clearTimeout(self.timer);
          self.timer = null;
        }
        self.ssdpClient.stop();

        self.ip = rinfo.address;
        deferred.resolve(rinfo.address);
      }
    });

    this.ssdpClient.search(this.st);

    this.timer = setTimeout(function(){
      deferred.reject("Discovery timeout");
      self.ssdpClient.stop();
    }, 3000);
  }

  return deferred.promise;
};

module.exports = BraviaDiscovery;
