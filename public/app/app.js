(function() {
    angular.module('mainApp', ['ui.router', 'ngCookies', 'ngMessages', 'ngFileUpload'])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('main', {
                    url: '/',
                    templateUrl: 'app/components/home/home.html',
                    controller: 'HomeController'
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
                .state('messageBoard', {
                    url: '/messageBoard',
                    templateUrl: 'app/components/messageBoard/messageBoard.html',
                    controller: 'MessageController'
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'app/components/home/profile.html',
                    controller: 'HomeController'
                })
                .state('messageComments', {
                    url: '/messsages/:id',
                    templateUrl: 'app/components/messageBoard/messageComments.html',
                    controller: 'MessageController'
                })

        })
}());
