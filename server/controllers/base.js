// This is the base controller. Used for base route which will serve the index as root
module.exports = {
    index: {
        handler: function(request, reply) {
            // Render the initial view
            reply.view('src/app/index/templates/index');
        },
        app: {
            name: 'index'
        }
    }
}