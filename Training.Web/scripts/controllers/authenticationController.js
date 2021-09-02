app.controller("authenticationController", ["$scope", "$rootScope", "$location", "authenticationService", "tools", "ipCookie",
    function ($scope, $rootScope, $location, authenticationService, tools, ipCookie) {
        if ($rootScope.loginUser && !$rootScope.loginUser.isLogin) {
            if (ipCookie(tools.cookieName()) === undefined) {
                $location.path("/login");
            } else {
                var command = {
                    authenticationToken: ipCookie(tools.cookieName()).authenticationToken
                }
                authenticationService.verification(command).then(function (reusult) {
                    if (reusult) {
                        authenticationService.setCredentials(reusult);
                    } else {
                        $location.path("/login");
                    }
                }, function () {
                    $location.path("/login");
                });
            }
        }

        function login() {
            if (!$scope.loginName || !$scope.password) {
                tools.error("请输入账号和密码");
                return;
            }

            var command = {
                loginName: $scope.loginName,
                password: $scope.password
            };

            $scope.isShowSpinner = true;
            authenticationService.login(command).then(function (reusult) {
                authenticationService.setCredentials(reusult);
                $scope.isShowSpinner = false;
                $location.path("/");
            }, function () {
                $scope.isShowSpinner = false;
            });
        };

        $scope.login = function () {
            login();
        };

        $scope.enter = function (e) {
            if (e.keyCode === 13) {
                login();
            }
        };

        $scope.logout = function () {
            logout();
        }

        function logout() {
            var command = {
                authenticationToken: ipCookie(tools.cookieName()).authenticationToken
            }

            authenticationService.logout(command).then(function () {
                authenticationService.clearCredentials();
                $rootScope.loginUser = {};
                $rootScope.loginUser.isLogin = false;
                $location.path("/login");
            }, function () {
                authenticationService.clearCredentials();
                $rootScope.loginUser = {};
                $rootScope.loginUser.isLogin = false;
                $location.path("/login");
            });
        };

        $scope.changePassword = function () {
            var command = {
                authenticationToken: $rootScope.loginUser.authenticationToken,
                oldPassword: $scope.oldPassword,
                newPassword: $scope.newPassword,
                confirmPassword: $scope.confirmPassword
            }
            $scope.isUsing = true;
            authenticationService.changepassword(command).then(function () {
                tools.success("修改成功，请重新登录");
                logout();
            }, function () {
                $scope.isUsing = false;
            });
        }

        $scope.changeCancel = function () {
            $scope.oldPassword = null;
            $scope.newPassword = null;
            $scope.confirmPassword = null;
        }
    }]);

