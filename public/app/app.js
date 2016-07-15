(function(){
    angular
        .module('app', [
            'app.main',
            'app.dashboard',
            // 'underscore',
            'ngRoute'
        ])
        .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
            $routeProvider
                .when('/login', {
                    templateUrl: 'app/main/main.html',
                    controller: 'main',
                    controllerAs: 'vm'
                })
                .when('/dashboard', {
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'dashboard',
                    controllerAs: 'vm'
                })
                .otherwise({ redirectTo: '/login' });

            $httpProvider.interceptors.push('authInterceptor');
        }]).run(['$rootScope', '$location', 'auth', function($rootScope, $location, auth) {
            var routesThatRequireAuth = ['/home'];

            $rootScope.$on('$routeChangeStart', function(event, next, current) {
                if (_(routesThatRequireAuth).contains($location.path()) && !auth.isAuthed()) {
                    $location.path('/');
                }
            });
        }]);
}());
