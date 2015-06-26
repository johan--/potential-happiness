/*
 * A dashboard for Riemann stats
 */

var ph      = require ('../lib/index'),
    util    = require ('../lib/util'),
    bunyan  = require ('bunyan');

function LogToBunyan () {
    var bun = bunyan.createLogger ({
        name: 'potential-happiness/examples/local-log',
        streams: [
            {level: 'info',
             path: 'ph.local-log.log'}
        ]
    });
    this.error = bun.error.bind (bun);
    this.warning = bun.warn.bind (bun);
    this.info = bun.info.bind (bun);
    this.debug = bun.debug.bind (bun);
    this.trace = function (method, requestUrl, body, responseBody, responseStatus) {
        bun.trace ({
            method: method,
            requestUrl: requestUrl,
            body: body,
            responseBody: responseBody,
            responseStatus: responseStatus
        });
    };
    this.close = function () { };
}

module.exports = {
    grid: {rows: 9, cols: 18},
    defaults: {
        source: {host: process.env.RIEMANN_HOST || "127.0.0.1"},
        logger: LogToBunyan
    },
    widgets: [
        {widget: ph.widgets.text,
         options: {label: "# Streams latency 0.999",
                   source: {query: 'service = "riemann streams latency 0.999"',
                            transform: ph.transform.trim_to_fixed (2)}},
         width: 3,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Streams latency 0.99",
                   source: {query: 'service = "riemann streams latency 0.99"',
                            transform: ph.transform.trim_to_fixed (2)}},
         width: 3,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Streams latency 0.95",
                   source: {query: 'service = "riemann streams latency 0.95"',
                            transform: ph.transform.trim_to_fixed (2)}},
         width: 3,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Streams latency 0.5",
                   source: {query: 'service = "riemann streams latency 0.5"',
                            transform: ph.transform.trim_to_fixed (2)}},
         width: 3,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Streams latency 0.0",
                   source: {query: 'service = "riemann streams latency 0.0"',
                            transform: ph.transform.trim_to_fixed (2)}},
         width: 3,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Streams rate",
                   source: {query: 'service = "riemann streams rate"',
                            transform: ph.transform.trim_to_fixed (2)}},
         width: 3,
         height: 1},

        {widget: ph.widgets.line_chart,
         options: {label: "Streams latencies",
                   width: 100,
                   source: {query: 'service =~ "riemann streams latency %"',
                            transform: function (data) {
                                d = new Date (Date.parse (data.time));
                                data.host = data.service.substr (24);
                                data.time = d.toLocaleTimeString ();
                                return data;
                            }}},
         width: 9,
         height: 4},
        {widget: ph.widgets.line_chart,
         options: {label: "Servers in rate",
                   width: 100,
                   legend: {width: 24},
                   source: {query: 'service =~ "riemann server % in rate"',
                            transform: function (data) {
                                d = new Date (Date.parse (data.time));
                                data.host = data.service.substr (15).slice (0, -8);
                                data.time = d.toLocaleTimeString ();
                                return data;
                            }}},
         width: 9,
         height: 4},

        {widget: ph.widgets.log,
         options: {label: "Logs (elastic)",
                   source: {host: "localhost",
                            index: "syslog-ng",
                            method: "elasticsearch",
                            limit: 34},
                   on_message: util.syslog_to_log},
         width: 18,
         height: 4}
    ]
};
