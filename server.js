/**
* Dependencies.
*/

process.env.NODE_ENV = 'development';

var Hapi = require('hapi'),
    config = require('./server/config/settings');

// Create a server with a host, port, and options
var server = Hapi.createServer(config.host, config.port, config.hapi.options);

// Export the server to be required elsewhere.
module.exports = server;

// Bootstrap Hapi Server Plugins, passes the server object to the plugins
require('./server/config/plugins')(server);

// Require the routes and pass the server object.
var routes = require('./server/config/routes')(server);
// Add the server routes
server.route(routes);

//Start the server
server.start(function() {
	require('./server/services/chatService')(server.listener);
    //Log to the console the host and port info
    console.log('Server started at: ' + server.info.uri);
});
