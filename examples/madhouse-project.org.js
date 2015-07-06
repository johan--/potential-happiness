/*
 * This is the configuration used by the author.
 */

var ph     = require ('../lib/index'),
    util   = require ('../lib/util'),
    bunyan = require ('bunyan');

function LogToBunyan () {
    var bun = bunyan.createLogger ({
        name: 'potential-happiness/madhouse-project.org',
        streams: [
            {level: 'info',
             path: 'logs/madhouse-project.org.log'}
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
    grid: {rows: 10, cols: 14},
    defaults: {
        source: {host: "10.243.42.34"},
        logger: LogToBunyan
    },
    widgets: [
        {widget: ph.widgets.line_chart,
         options: {label: "Network RX (kbps)",
                   source: {query: 'service =~ "interface-%/if_octets/rx" and not service =~ "%docker%" and metric > 0'}},
         width: 7,
         height: 5},
        {widget: ph.widgets.line_chart,
         options: {label: "Network TX (kbps)",
                   source: {query: 'service =~ "interface-%/if_octets/tx" and not service =~ "%docker%" and metric > 0'}},
         width: 7,
         height: 5},

        {widget: ph.widgets.bar_chart,
         options: {label: "CPU used %",
                   maxHeight: 100,
                   source: {query: 'service = "cpu-average/cpu-used" and not tagged "summary"',
                            transform: ph.transform.trim_to_fixed (1)}},
         width: 3,
         height: 3},
        {widget: ph.widgets.bar_chart,
         options: {label: "Load/5",
                   maxHeight: 4,
                   source: {query: 'service = "load/load/midterm" and not tagged "summary"'}},
         width: 3,
         height: 3},
        {widget: ph.widgets.bar_chart,
         options: {label: "Memory use %",
                   maxHeight: 100,
                   source: {query: 'service = "memory/percent-used" and not tagged "summary"',
                            transform: ph.transform.trim_to_fixed (1)}},
         width: 3,
         height: 3},
        {widget: ph.widgets.bar_chart,
         options: {label: "Disk / free %",
                   maxHeight: 100,
                   source: {query: 'service = "df-root/percent_bytes-free"',
                            transform: ph.transform.trim_to_fixed (1)}},
         width: 3,
         height: 3},
        {widget: ph.widgets.text,
         options: {label: "# Load/5",
                   source: {query: 'tagged "summary" and service = "load/load/midterm"',
                            transform: ph.transform.trim_to_fixed (2)}},
         pos_x: 13,
         width: 1,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Mem (gb)",
                   source: {query: 'tagged "summary" and service = "memory/memory-used"',
                            transform: ph.transform.trim_to_fixed (2)}},
         pos_x: 13,
         width: 1,
         height: 1},
        {widget: ph.widgets.text,
         options: {label: "# Net kbps",
                   source: {query: 'service = "total network traffic"',
                            transform: ph.transform.trim_to_fixed (2)}},
         pos_x: 13,
         width: 1,
         height: 1},

        {widget: ph.widgets.sparkline,
         options: {label: "SSH invalid logins",
                   source: {query: 'service =~ "tail-auth/counter-sshd-invalid_user"'}},
         width: 3,
         height: 2},

        {widget: ph.widgets.log,
         options: {label: "Logs",
                   source: {index: "syslog-ng",
                            method: "elasticsearch",
                            limit: 14,
                            query: {
                                sort: {"@timestamp": "desc"},
                                query: {
                                    "filtered": {
                                        "filter": {
                                            "and": [
                                                {
                                                    "range": {
                                                        "@timestamp": {"lte": "now"}
                                                    }
                                                }
                                            ]
                                        },
                                        "query": {
                                            "bool": {
                                                "must_not": [
                                                    {
                                                        "term": {
                                                            "message.PROGRAM": "edge"
                                                        }
                                                    },
                                                    {
                                                        "term": {
                                                            "message.PROGRAM": "wpa_supplicant"
                                                        }
                                                    },
                                                    {
                                                        "term": {
                                                            "message.PROGRAM": "networkmanager"
                                                        }
                                                    },
                                                    {
                                                        "term": {
                                                            "message.PROGRAM": "modemmanager"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                           },
                   on_message: util.syslog_to_log},
         width: 11,
         height: 2}
    ]
};
