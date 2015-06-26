/* potential-happiness -- Dashboard for the TTY
 * Copyright (C) 2015  Gergely Nagy <algernon@madhouse-project.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var elasticsearch = require('elasticsearch');

function ElasticSource(options) {
    options = options || {};

    options.host = options.host || "localhost";
    options.port = options.port || 9200;
    options.index = options.index || "log";
    options.type = options.type || "message";
    options.limit = options.limit || 10;
    options.poll_interval = options.poll_interval || 5;
    options.query = options.query ||
        {
            sort: [{"@timestamp": "desc"}],
            query: {
                range: {
                    "@timestamp": {lte: "now"}
                }
            }
        };

    this.options = options;

    this.query = {
        index: options.index,
        type: options.type,
        size: options.limit,
        body: options.query
    };
}

ElasticSource.prototype.subscribe = function (parent) {
    var self = this;

    if (self.options.logger)
        this.es = new elasticsearch.Client ({
            host: this.options.host + ":" + this.options.port,
            log: self.options.logger
        });
    else
        this.es = new elasticsearch.Client ({
            host: this.options.host + ":" + this.options.port
        });

    setInterval (function (self) {
        self.es.search(self.query,
                       function (err, resp, status) {
                           if (err) {
                               self.es.transport.log.warning (err);
                               return;
                           }
                           parent.options.on_message (parent, resp.hits.hits);
                       });
    }, this.options.poll_interval * 1000, this);
}

ElasticSource.prototype.__proto__ = Object;
ElasticSource.prototype.type = "elasticsearch-source";

module.exports = ElasticSource;
