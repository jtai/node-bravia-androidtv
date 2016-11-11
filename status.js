var Bravia = require('./bravia');

var bravia = new Bravia();

bravia.getStatus().then(function(status) {
  console.log(status);
}, function(error) {
  console.log(error);
});
