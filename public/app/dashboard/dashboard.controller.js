(function() {
    angular
        .module('app.dashboard')
        .controller('dashboard', Dashboard);

    Dashboard.$inject = ['auth'];

    function Dashboard(auth) {
        var vm = this;

        vm.logout = function() {
            auth.logout();
        }
    }
}());
