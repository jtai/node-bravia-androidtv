var Bravia = require('./bravia');

var bravia = new Bravia();

if (process.argv[2] !== undefined) {
  bravia.sendCommand(process.argv[2]).then(function() {
    console.log('ok');
  }, function(error) {
    console.log(error);
  });
} else {
  bravia.getCommands().then(function(commands) {
    console.log(commands);
  }, function(error) {
    console.log(error);
  });
}
