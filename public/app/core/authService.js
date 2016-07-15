(function() {
    angular
        .module('app')
        .service('auth', AuthService);

    AuthService.$inject = ['$window'];

    function AuthService($window) {
        var self = this;

        // Methods to deal with JWT
        self.parseJwt = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }

        // Saves the JWT token to the localStorage
        self.saveToken = function(token) {
            $window.localStorage['jwtToken'] = token;
        }

        // Retrievs the token that is saved in localStorage
        self.getToken = function() {
            return $window.localStorage['jwtToken'];
        }

        // Returns a bool if the user is authorized
        self.isAuthed = function() {
            var token = self.getToken();

            if (token) {
                var params = self.parseJwt(token);

                return Math.floor(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        }

        // Removes JWT from localStorage effectively logging out
        self.logout = function() {
            $window.localStorage.removeItem('jwtToken');
        }
    }
}());
