define(function() {
    return [{
        when: '/',
        templateUrl: 'main/app/home/templates/home.html',
        requires: ['main/app/home/controllers/HomeController.js']
    }, {
        when: '/:namespace/:name?',
        templateUrl: function(path) {
            return 'main/app/home/partials/' + path.namespace + '.html';
        },
        loadControllerFromPath: true,
        requires: ['main/common/directives/tabs.js',
            'main/common/directives/pane.js'
        ]
    }];
});
