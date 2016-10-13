var Q = require('q');
var readline = require('readline');
var Bravia = require('./bravia');

var bravia = new Bravia();

bravia.authenticate().then(function(response) {
  if (response.statusCode == 200) {
    console.log('Already registered!');
    console.log(response.headers);
    return;
  }

  if (response.statusCode == 401) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Please enter the 4-digit code shown on your TV: ', function(code) {
      bravia.authenticate(code).then(function(response) {
        if (response.statusCode == 200) {
          console.log('Registered!');
          console.log(response.headers);
        } else {
          console.log('Unexpected '+response.statusCode+' response');
        }
      }, function(error) {
        console.log(error);
      });

      rl.close();
    });
    return;
  }

  console.log('Unexpected '+response.statusCode+' response');
}, function(error) {
  console.log(error);
});
