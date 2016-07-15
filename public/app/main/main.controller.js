(function(){
    angular
        .module('app.main')
        .controller('main', Main);

    Main.$inject = ['user', 'auth', '$location', '$scope'];

    function Main(user, auth, $location, $scope){
        var vm = this;

        function handleRequest(res) {
            var token = res.data ? res.data.token : null;
            if(token) { console.log('JWT:', token); }
            vm.message = res.data.message;
        }

        vm.register = function(email, password){
            user.register(email, password)
                .then(handleRequest, handleRequest);
        }

        vm.login = function(email, password) {
            user.login(email, password)
                .then(function(res) {
                    if (res.data.success) {
                        $location.path('/dashboard');
                    }
                }, handleRequest);
        }

        vm.isAuthed = function() {
            return auth.isAuthed ? auth.isAuthed() : false
        }
    }
}());
