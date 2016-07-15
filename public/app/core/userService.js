(function() {
    angular
        .module('app')
        .service('user', UserService);

    UserService.$inject = ['$http', '$rootScope', 'auth', '$location'];

    function UserService($http, $rootScope, auth, $location) {
        var self = this;

        // Register new user with database
        self.register = function(email, password) {
            return $http.post('api/register', {
                email: email,
                password: password
            });
        }

        // Authenticate user and returns a JWT
        self.login = function(email, password) {
            return $http.post('api/authenticate', {
                email: email,
                password: password
            });
        }

        $rootScope.$watch(function() { return auth.isAuthed(); }, function(newValue, oldValue) {
            if (!newValue && oldValue) {
                $location.path('/login');
            }
        }, true);
    }
}());
