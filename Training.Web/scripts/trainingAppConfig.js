
app.config(["$routeProvider", "$httpProvider", "versionToolsProvider",
    function ($routeProvider, versionToolsProvider) {
        setRoute($routeProvider, versionToolsProvider);
    }]);

app.run(["$rootScope", "ipCookie", "tools", "$http", "$location", function ($rootScope, ipCookie, tools, $http, $location) {
    $rootScope.loginUser = ipCookie(tools.cookieName()) || {};
    if ($rootScope.loginUser && $rootScope.loginUser.authenticationToken) {
        $http.defaults.headers.common[tools.tokenName()] = $rootScope.loginUser.authenticationToken;
    }
    $rootScope.isLogin = true;
    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.isLogin = true;
        if ($location.path().indexOf("/login") === -1) {
            $rootScope.isLogin = false;
        }
    });
}]);

function setRoute($routeProvider, versionToolsProvider) {
    $routeProvider.when("/login", {
        cache: false,
        templateUrl: "../views/login.html?version=" + versionToolsProvider.lastBuildTimeStamp,
        controller: "authenticationController"
    }).when("/dashboard", {
        templateUrl: "../views/dashboard.html?version=" + versionToolsProvider.lastBuildTimeStamp,
        controller: "dashboardController"
    }).when("/", {
        cache: false,
        redirectTo: "/dashboard"
    }).when("/changePassword", {
        cache: false,
        templateUrl: "./views/changePassword.html?version=" + versionToolsProvider.lastBuildTimeStamp,
        controller: "authenticationController"
    }).when("/user", {
        templateUrl: "../views/user.html?version=" + versionToolsProvider.lastBuildTimeStamp,
        controller: "userController"
    }).when("/marketing",{
        templateUrl: "../views/marketing.html?version=" + versionToolsProvider.lastBuildTimeStamp,
        controller: "marketingController"
    });
}