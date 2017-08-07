var Bravia = require('./bravia');

var bravia = new Bravia();
var deferred;

if (process.argv[2] == 'playing') {
  deferred = bravia.getPlayingContentInfo();
} else if (process.argv[2] == 'apps') {
  deferred = bravia.getApplicationList();
} else if (process.argv[2] == 'volume') {
  deferred = bravia.getVolumeInformation();
} else if (process.argv[2] == 'display') {
  deferred = bravia.getPowerSavingMode();
} else {
  deferred = bravia.getPowerStatus();
}

deferred.then(function(response) {
  console.log(response);
}, function(error) {
  console.log(error);
});
