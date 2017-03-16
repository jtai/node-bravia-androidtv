var SsdpClient = require('node-ssdp').Client;
var Q = require('q');
var StringFormat = require('string-format');
var Request = require('request');
var parseString = require('xml2js').parseString;

function BraviaDiscovery(ip, filter){
  this.ssdpClient = new SsdpClient();
  this.st = 'urn:schemas-sony-com:service:IRCC:1';
  this.url = 'http://{ip}/sony';

  this.ip = ip;
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
    this.ssdpClient.on('response', function (headers, statusCode, rinfo){
      if (statusCode == 200) {
        getDescription(headers.LOCATION, self.filter, function (){
          if (self.timer){
            clearTimeout(self.timer);
            self.timer = null;
          }
          self.ssdpClient.stop();

          self.ip = rinfo.address;
          deferred.resolve(rinfo.address);
        });
      }
    });

    this.ssdpClient.search(this.st);

    this.timer = setTimeout(function(){
      deferred.reject("Discovery timeout");
      self.ssdpClient.stop();
    }, 4000);
  }

  return deferred.promise;
};

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
