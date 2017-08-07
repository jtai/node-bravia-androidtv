node-bravia-androidtv
=====================

Node.js module for controlling Sony BRAVIA Android TV (tested with KDL65W850C)

The code is inspired by [alanreid/bravia](https://github.com/alanreid/bravia)
and borrows structure from [ttu/node-yamaha-avr](https://github.com/ttu/node-yamaha-avr).
Support for additional status commands inspired by [aparraga/braviarc](https://github.com/aparraga/braviarc)
and [breunigs/bravia-auth-and-remote](https://github.com/breunigs/bravia-auth-and-remote/blob/master/commands).

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

Status
------

Query the current power of the TV by running

> node status.js

The result should be `active` or `standby`.

Query the playing content info by running

> node status.js playing

The result should be something like

```js
{ uri: 'extInput:hdmi?port=4',
  source: 'extInput:hdmi',
  title: 'HDMI 4/ARC' }
```

Query the current volume info by running

> node status.js volume

The result should be something like

```js
{ target: 'speaker',
  volume: 5,
  mute: false,
  maxVolume: 100,
  minVolume: 0 }
```

Commands
--------

List supported commands (and their codes) by running

> node command.js

To send a command (e.g., `PowerOff`), run

> node command.js PowerOff
