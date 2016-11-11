node-bravia-androidtv
=====================

Node.js module for controlling Sony BRAVIA Android TV (tested with KDL65W850C)

The code is inspired by [alanreid/bravia](https://github.com/alanreid/bravia)
and borrows structure from [ttu/node-yamaha-avr](https://github.com/ttu/node-yamaha-avr).

Note that this model does not support Wake-On-LAN for power on, you send it a
`WakeUP` command over HTTP instead. Thanks to Michael Tout on this
[openremote.org thread](http://www.openremote.org/display/forums/Sony+TV+HTTP+control?focusedCommentId=23601972#comment-23601972)
for the hint. You must turn on "Remote Start" on the TV for this to work.

Authentication
--------------

All HTTP requests are authenticated. The first time you will need to register
this client by running

> node auth.js

From then on the authentication cookie handling is done for you.

Commands
--------

List supported commands (and their codes) by running

> node command.js

To send a command (e.g., `PowerOff`), run

> node command.js PowerOff

Status
------

Query the current power and input status of the TV by running

> node status.js

If the TV is off, you will get a result like

```js
{ error: [ 40005, 'Display Is Turned off' ], id: 3 }
```

Otherwise you will get a result like

```js
{ result:
   [ { uri: 'extInput:hdmi?port=4',
       source: 'extInput:hdmi',
       title: 'HDMI 4/ARC' } ],
  id: 3 }
```
