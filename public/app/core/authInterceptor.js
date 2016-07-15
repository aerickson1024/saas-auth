(function(){
    angular
        .module('app')
        .factory('authInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['auth', '$window'];

    function AuthInterceptor(auth, $window){
        return {
            request: function(config){
                var token = auth.getToken();

                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },
            response: function(res){
                if (res.data.token) {
                    auth.saveToken(res.data.token);
                }

                return res;
            },
            responseError: function(res){
                return res;
            }
        }
    }
}());
