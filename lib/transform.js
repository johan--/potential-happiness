/* potential-happiness -- Dashboard for the TTY
 * Copyright (C) 2015, 2017  Gergely Nagy <algernon@madhouse-project.org>
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

function trim_to_fixed (n) {
    return function (data) {
        if (data.metric && data.metric.toFixed) {
            data.metric = data.metric.toFixed (n);
        }
        return data;
    }
}

function service_as_host () {
    return function (data) {
        host = data.host;
        service = data.service;
        data.host = service;
        data.service = host;

        return data;
    }
}

function remove_host_prefix (f, n) {
    return function (data) {
        data = f(data);
        data.host = data.host.substring(n);
        return data;
    }
}

exports.trim_to_fixed = trim_to_fixed;
exports.service_as_host = service_as_host;
exports.remove_host_prefix = remove_host_prefix;
