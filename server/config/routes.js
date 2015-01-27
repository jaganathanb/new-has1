module.exports = function(server) {
    // Bootstrap your controllers so you dont have to load them individually. This loads them all into the controller name space. https://github.com/troygoode/node-require-directory
    var viewRoutes = require('./routes/view-routes');
    var assetRoutes = require('./routes/asset-routes');


    return viewRoutes().concat(assetRoutes());
}