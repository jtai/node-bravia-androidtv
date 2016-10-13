node-bravia-androidtv
=====================

Node.js module for controlling Sony BRAVIA Android TV (tested with KDL65W850C)

The code is inspired by [alanreid/bravia](https://github.com/alanreid/bravia)
and borrows structure from [ttu/node-yamaha-avr](https://github.com/ttu/node-yamaha-avr).

Note that this model does not support Wake-On-LAN for power on, it uses a HTTP
request instead. You must turn on "Remote Start" on the TV.

All HTTP requests are authenticated. The first time you will need to register
this client by running

> node auth.js

From then on the authentication cookie handling is done for you.
