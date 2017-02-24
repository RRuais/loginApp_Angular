(function() {
    angular.module('mainApp', ['ui.router', 'ngCookies', 'ngMessages', 'ngFileUpload'])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('main', {
                    url: '/',
                    templateUrl: 'app/components/home/home.html',
                    controller: 'HomeController',
                })
                .state('success', {
                    url: '/success',
                    templateUrl: 'app/components/home/success.html',
                    controller: 'HomeController'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/components/home/login.html',
                    controller: 'HomeController'
                })
                .state('admin', {
                    url: '/admin',
                    templateUrl: 'app/components/home/admin.html',
                    controller: 'HomeController',
                    isAdmin: true
                })
                .state('messageBoard', {
                    url: '/messageBoard',
                    templateUrl: 'app/components/messageBoard/messageBoard.html',
                    controller: 'MessageController',
                    authenticate: true
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'app/components/home/profile.html',
                    controller: 'HomeController',
                    authenticate: true
                })
                .state('messageComments', {
                    url: '/messsages/:id',
                    templateUrl: 'app/components/messageBoard/messageComments.html',
                    controller: 'MessageController',
                    authenticate: true
                })
            $urlRouterProvider.otherwise('/')
        })

    angular.module("mainApp").run(function($rootScope, $state, AuthFactory) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !AuthFactory.isLoggedIn()) {
                // User isn’t authenticated
                $state.transitionTo("main");
                event.preventDefault();
            }
        });
    });

    angular.module("mainApp").run(function($rootScope, $state, AuthFactory) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.isAdmin && !AuthFactory.checkAdminStatus()) {
                // User isn’t Admin
                $state.transitionTo("main");
                event.preventDefault();
            }
        });
    });
}());
