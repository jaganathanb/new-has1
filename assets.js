// assets to be used by the 'hapi-assets' module based on process.env.NODE_ENV
module.exports = {
    development: {
        js: {
            requirejs: {
                lib: 'main/bower_components/requirejs/require.js',
                main: 'main/main.js'
            },
            app:'build/app.js'
        },
        css: ['//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css', 'main/css/test-one.css', 'main/css/test-two.css']
    },
    production: {
        js: {
            requirejs: {
                lib: 'build/bower_components/requirejs/require.js',
                main: 'build/main.js'
            },
            app: 'build/app.js'
        },
        css: ['build/css/styles.css']
    }
}