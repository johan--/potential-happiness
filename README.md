potential-happiness
===================

A dashboard for the terminal, for use with [riemann][riemann] and/or
[elasticsearch][elasticsearch].

 [riemann]: http://riemann.io/
 [elasticsearch]: https://www.elastic.co/products/elasticsearch

Demo
----

**Riemann server statistics & local logs**
<img src="./docs/screenshots/screenshot-1.png" alt="Screenshot" width="800">

([source code][demo:1:source])

**System health & network monitoring**
<img src="./docs/screenshots/screenshot-2.png" alt="Screenshot" width="800">

([source code][demo:2:source])

 [demo:1:source]: https://raw.githubusercontent.com/algernon/potential-happiness/master/examples/local-log.js
 [demo:2:source]: https://raw.githubusercontent.com/algernon/potential-happiness/master/examples/madhouse-project.org.js

Installation
------------

```shell
git clone https://github.com/algernon/potential-happiness.git
cd potential-happiness
npm install
src/dashboard.js examples/local-log.js
```

For the `examples/local-log.js` example to work, one will need
[Riemann][riemann] and [ElasticSearch][elasticsearch] installed and
running. The former also needs to be configured to accept WebSocket
connections.

### Dependencies

For those not using `npm`, the JavaScript dependencies are
[blessed][blessed] and [blessed-contrib][blessed-contrib] (for the
UI), [ws][ws] (for the Riemann WebSocket source),
[elasticsearch][elastic-js] (for the ElasticSearch module), and
[bunyan][bunyan] for logging.

  [blessed]: https://github.com/chjj/blessed
  [blessed-contrib]: https://github.com/yaronn/blessed-contrib
  [ws]: https://github.com/websockets/ws
  [elastic-js]: https://github.com/elastic/elasticsearch-js
  [bunyan]: https://github.com/trentm/node-bunyan

License
-------

Copyright (C) 2015-2017 Gergely Nagy <algernon@madhouse-project.org>,
released under the terms of the
[GNU General Public License][gpl], version 3+.

 [gpl]: http://www.gnu.org/licenses/gpl.html
