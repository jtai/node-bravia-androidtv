var Q = require('q');
var readline = require('readline');
var Bravia = require('./bravia');

var bravia = new Bravia();

bravia.auth()
  .then(function(response) {
    var deferred = Q.defer();

    if (response.statusCode == 401) {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Please enter the 4-digit code shown on your TV: ', function(code) {
        deferred.resolve(code);
      });
    } else {
      console.log(response.headers);
      deferred.reject('Unexpected '+response.statusCode+' response starting auth');
    }

    return deferred.promise;
  })
  .then(function(code) {
    return bravia.auth(code);
  })
  .then(function(response) {
    if (response.statusCode == 200) {
      console.log(response.headers);
    }
  })
  .catch(function(error) {
    console.log(error);
  });
