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

var contrib = require ('blessed-contrib'),
    util    = require ('./util');

function Grid (screen, options) {
    options = options || {};
    options.grid = options.grid || {rows: 12, cols: 12};
    options.grid.rows = options.grid.rows || 12;
    options.grid.cols = options.grid.cols || 12;
    options.widgets = options.widgets || [];
    this.options = options;

    var surface = [];
    for (var i = 0; i <= options.grid.rows; i++) {
        var line = [];
        for (var j = 0; j <= options.grid.cols; j++) {
            line.push('.');
        }
        surface.push(line);
    }

    function isEmpty (x, y, w, h) {
        for (var cy = y; cy <= y + h; cy++) {
            for (var cx = x; cx <= x + w; cx++) {
                if (surface[cy][cx] != '.') {
                    return false;
                }
            }
        }
        return true;
    }

    function markReserved (x, y, w, h, c) {
        for (var cy = y; cy < y + h; cy++) {
            for (var cx = x; cx < x + w; cx++) {
                surface[cy][cx] = c || 'x';
            }
        }
    }

    function dumpSurface () {
        for (line in surface) {
            console.error (surface[line]);
        }
    }

    function findSpotForWidget (sx, sy, ww, wh) {
        for (var y = sy; y <= options.grid.rows - wh; y++) {
            for (var x = 0; x <= options.grid.cols - ww; x++) {
                if ((y == sy) && (x < sx)) {
                    continue;
                }

                if (isEmpty (x, y, ww, wh)) {
                    return {x: x, y: y};
                }
            }
        }
    }

    var grid = new contrib.grid ({rows: options.grid.rows,
                                  cols: options.grid.cols,
                                  screen: screen});
    var cc = {x: 0, y: 0};
    for (w in options.widgets) {
        widget = options.widgets[w];

        widget.options = widget.options || {};
        widget.options.source.host = widget.options.source.host ||
            options.defaults.source.host;
        widget.options.source.port = widget.options.source.port ||
            options.defaults.source.port;
        widget.options.source.logger = widget.options.source.logger ||
            options.defaults.logger;

        cc.x = (widget.pos_x == undefined) ? cc.x : widget.pos_x;
        cc.y = (widget.pos_y == undefined) ? cc.y : widget.pos_y;

        n = findSpotForWidget (cc.x, cc.y, widget.width, widget.height);
        if (!n) {
            continue;
        }
        cc = n;
        markReserved (cc.x, cc.y, widget.width, widget.height,
                      String.fromCharCode (97 + parseInt(w)));
        //dumpSurface();

        w = grid.set (cc.y, cc.x, widget.height, widget.width,
                      widget.widget, widget.options);
        w.source.options.transform = widget.options.source.transform;
        w.options.on_message = widget.options.on_message || w.options.on_message;
        w.options.findColor = widget.options.findColor || util.findColor;

        if (cc.x + 1 >= options.grid.cols) {
            cc.x = 0;
            cc.y = cc.y + 1;
        }
    }
}

module.exports = Grid
