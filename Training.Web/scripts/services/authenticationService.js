app.service("authenticationService", ["httpProxy", "ipCookie", "$rootScope", "tools", "$http",
    function (httpProxy, ipCookie, $rootScope, tools, $http) {
        var authenticationService = {};

        authenticationService.login = function (command) {
            return httpProxy.post("login", command);
        };

        authenticationService.verification = function (command) {
            return httpProxy.post("verification", command);
        };

        authenticationService.logout = function (command) {
            return httpProxy.post("logout", command);
        };

        authenticationService.changepassword = function (command) {
            return httpProxy.post("changepassword", command);
        };

        authenticationService.setCredentials = function (currentUser) {
            $rootScope.loginUser = currentUser;
            $rootScope.loginUser.hasLogin = true;
            $http.defaults.headers.common[tools.tokenName()] = currentUser.authenticationToken;
            ipCookie(tools.cookieName(), $rootScope.loginUser);
            return;
        };

        authenticationService.clearCredentials = function () {
            delete $rootScope.loginUser;
            ipCookie.remove(tools.cookieName());
            $http.defaults.headers.common[tools.tokenName()] = undefined;
        };
        
        return authenticationService;
    }]);