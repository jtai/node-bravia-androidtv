var Q = require('q');
var readline = require('readline');
var Bravia = require('./bravia');

var bravia = new Bravia();

bravia.authenticate().then(function(cookie) {
  if (cookie) {
    console.log(cookie);
  } else {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Please enter the 4-digit code shown on your TV: ', function(code) {
      bravia.authenticate(code).then(function(cookie) {
        if (cookie) {
          console.log(cookie);
        } else {
          console.log('Registration failed');
        }
      }, function(error) {
        console.log(error);
      });

      rl.close();
    });
  }
}, function(error) {
  console.log(error);
});
