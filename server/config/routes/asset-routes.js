/**
 * Dependencies.
 */
var requireDirectory = require('require-directory');

module.exports = function(server) {
    // Bootstrap your controllers so you dont have to load them individually. This loads them all into the controller name space. https://github.com/troygoode/node-require-directory
    var controller = requireDirectory(module, '../../controllers');

    // Array of routes for Hapi
    var routeTable = [{
        method: 'GET',
        path: '/main/{path*}',
        config: controller.assets.main
    }, {
        method: 'GET',
        path: '/build/{path*}',
        config: controller.assets.build
    }];

    return routeTable;
}
