// This is the assets controller. Goal is to serve css, js, images, or bower packages.
module.exports = {
    build: {
        handler: {
            directory: {
                path: './build'
            }
        },
        app: {
            name: 'build'
        }
    },
    main: {
        handler: {
            directory: {
                path: './public/src'
            }
        },
        app: {
            name: 'main'
        }
    }
}