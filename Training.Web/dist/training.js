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
app.service("marketingService", ["httpProxy",
    function (httpProxy) {
        var services = {};
        
        services.getByPage = function (params) {
            return httpProxy.get("marketing/pagination?" + jQuery.param(params));
        };
        services.add = function (command) {
            return httpProxy.post("marketing", command);
        };
        services.edit = function (id, command) {
            return httpProxy.put("marketing/" + id, command);
        };
        services.delete = function (id) {
            return httpProxy.delete("marketing/" + id);
        };

        return services;
    }]);
app.service("userService", ["httpProxy",
    function (httpProxy) {
        var services = {};
        
        services.getByPage = function (params) {
            return httpProxy.get("users/pagination?" + jQuery.param(params));
        };
        services.add = function (command) {
            return httpProxy.post("users", command);
        };
        services.edit = function (id, command) {
            return httpProxy.put("users/" + id, command);
        };
        services.delete = function (id) {
            return httpProxy.delete("users/" + id);
        };

        return services;
    }]);
app.controller("alertController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.alerts = [];
    $scope.alerts = $rootScope.alerts;
    $scope.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };
}]);

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


app.controller("dashboardController", ["$scope", "$http", "$window", "tools", "$modal", "$rootScope", 
    function ($scope, $http, $window, tools, $modal, $rootScope) {

    }]);

app.controller("marketingController", ["$scope", "marketingService", "tools", "$modal",
    function ($scope, marketingService, tools, $modal) {

        $scope.searchInfo = {};
        $scope.isLoading = false;
        $scope.isUsing = false;
        $scope.initialize = true;
        $scope.marketing = [];

        $scope.selectedRow = null;
        $scope.setSelectedRow = function (row) {
            $scope.selectedRow = row;
        };

        $scope.pagination = {
            currentPage: 1,
            pageSize: 10,
            onChange: function () {
                if ($scope.initialize) {
                    $scope.initialize = false;
                    return;
                }
                getByPage();
            }
        };

        getByPage();

        $scope.search = function () {
            $scope.pagination.currentPage = 1;
            getByPage();
        }

        function getByPage() {
            $scope.isLoading = true;
            marketingService.getByPage({
                name: $scope.searchInfo.name,
                type: $scope.searchInfo.type,
                status: $scope.searchInfo.status,
                manager: $scope.searchInfo.manager,

                currentPage: $scope.pagination.currentPage,
                pageSize: $scope.pagination.pageSize
            }).then(function (data) {
                $scope.isLoading = false;
                $scope.marketing = data.list;
                $scope.pagination.currentPage = data.pagination.currentPage;
                $scope.pagination.pageSize = data.pagination.pageSize;
                $scope.pagination.total = data.pagination.total;
            }, function () {
                $scope.isLoading = false;
            });
        }

        $scope.add = function () {
            $scope.isUsing = true;
            $scope.newmarketing = {};
            var addItem = $modal.open({
                templateUrl: "addModal",
                controller: addCtrl,
                backdrop: "static",
                resolve: {
                    newmarketing: function () { return $scope.newmarketing; },
                    isAdd: function () { return true; }
                }
            });
            addItem.result.then(function () {
                $scope.isUsing = false;
                tools.success("保存成功");
                getByPage();
            }, function () {
                $scope.isUsing = false;
            });
        }

        $scope.edit = function (row) {
            $scope.isUsing = true;
            $scope.newmarketing = row;
            var editItem = $modal.open({
                templateUrl: "addModal",
                controller: addCtrl,
                backdrop: "static",
                resolve: {
                    newmarketing: function () { return $scope.newmarketing; },
                    isAdd: function () { return false; }
                }
            });
            editItem.result.then(function () {
                $scope.isUsing = false;
                tools.success("保存成功");
                getByPage();
            }, function () {
                $scope.isUsing = false;
            });
        }

        function addCtrl($scope, $modalInstance, newmarketing, marketingService, isAdd) {
            $scope.newmarketing = angular.copy(newmarketing);
            $scope.isUsing = false;
            $scope.isAdd = isAdd;

            $scope.ok = function () {
                $scope.isUsing = true;
                if (isAdd) {
                    marketingService.add($scope.newmarketing).then(function () {
                        $modalInstance.close();
                    }, function () {
                        $scope.isUsing = false;
                    });
                } else {
                    marketingService.edit(newmarketing.id, $scope.newmarketing).then(function () {
                        $modalInstance.close();
                    }, function () {
                        $scope.isUsing = false;
                    });
                }
            };
        }

        $scope.delete = function (row) {
            $scope.isUsing = true;
            var deleteItem = $modal.open({
                templateUrl: "deleteModal",
                controller: deleteCtrl,
                backdrop: "static",
                resolve: {
                    id: function () { return row.id; },
                }
            });
            deleteItem.result.then(function () {
                $scope.isUsing = false;
                tools.success('删除成功');
                getPreviousPage();
                getByPage();
            }, function () {
                $scope.isUsing = false;
            });
        }

        function deleteCtrl($scope, $modalInstance, marketingService, id) {
            $scope.isUsing = false;
            $scope.ok = function () {
                $scope.isUsing = true;
                marketingService.delete(id).then(function () {
                    $modalInstance.close();
                }, function () {
                    $scope.isUsing = false;
                });
            };
        }

        function getPreviousPage() {
            if (($scope.pagination.currentPage - 1) * $scope.pagination.pageSize == $scope.pagination.total - 1) {
                $scope.pagination.currentPage = $scope.pagination.currentPage - 1;
            };
        }
    }]);

app.controller("userController", ["$scope", "userService", "tools", "$modal",
    function ($scope, userService, tools, $modal) {

        $scope.searchInfo = {};
        $scope.isLoading = false;
        $scope.isUsing = false;
        $scope.initialize = true;
        $scope.users = [];

        $scope.selectedRow = null;
        $scope.setSelectedRow = function (row) {
            $scope.selectedRow = row;
        };

        $scope.pagination = {
            currentPage: 1,
            pageSize: 10,
            onChange: function () {
                if ($scope.initialize) {
                    $scope.initialize = false;
                    return;
                }
                getByPage();
            }
        };

        getByPage();

        $scope.search = function () {
            $scope.pagination.currentPage = 1;
            getByPage();
        }

        function getByPage() {
            $scope.isLoading = true;
            userService.getByPage({
                name: $scope.searchInfo.name,
                loginName: $scope.searchInfo.loginName,
                currentPage: $scope.pagination.currentPage,
                pageSize: $scope.pagination.pageSize
            }).then(function (data) {
                $scope.isLoading = false;
                $scope.users = data.list;
                $scope.pagination.currentPage = data.pagination.currentPage;
                $scope.pagination.pageSize = data.pagination.pageSize;
                $scope.pagination.total = data.pagination.total;
            }, function () {
                $scope.isLoading = false;
            });
        }

        $scope.add = function () {
            $scope.isUsing = true;
            $scope.user = {};
            var addItem = $modal.open({
                templateUrl: "addModal",
                controller: addCtrl,
                backdrop: "static",
                resolve: {
                    user: function () { return $scope.user; },
                    isAdd: function () { return true; }
                }
            });
            addItem.result.then(function () {
                $scope.isUsing = false;
                tools.success("保存成功");
                getByPage();
            }, function () {
                $scope.isUsing = false;
            });
        }

        $scope.edit = function (row) {
            $scope.isUsing = true;
            $scope.user = row;
            var editItem = $modal.open({
                templateUrl: "addModal",
                controller: addCtrl,
                backdrop: "static",
                resolve: {
                    user: function () { return $scope.user; },
                    isAdd: function () { return false; }
                }
            });
            editItem.result.then(function () {
                $scope.isUsing = false;
                tools.success("保存成功");
                getByPage();
            }, function () {
                $scope.isUsing = false;
            });
        }

        function addCtrl($scope, $modalInstance, user, userService, isAdd) {
            $scope.user = angular.copy(user);
            $scope.isUsing = false;
            $scope.isAdd = isAdd;

            $scope.ok = function () {
                $scope.isUsing = true;
                if (isAdd) {
                    userService.add($scope.user).then(function () {
                        $modalInstance.close();
                    }, function () {
                        $scope.isUsing = false;
                    });
                } else {
                    userService.edit(user.id, $scope.user).then(function () {
                        $modalInstance.close();
                    }, function () {
                        $scope.isUsing = false;
                    });
                }
            };
        }

        $scope.delete = function (row) {
            $scope.isUsing = true;
            var deleteItem = $modal.open({
                templateUrl: "deleteModal",
                controller: deleteCtrl,
                backdrop: "static",
                resolve: {
                    id: function () { return row.id; },
                }
            });
            deleteItem.result.then(function () {
                $scope.isUsing = false;
                tools.success('删除成功');
                getPreviousPage();
                getByPage();
            }, function () {
                $scope.isUsing = false;
            });
        }

        function deleteCtrl($scope, $modalInstance, userService, id) {
            $scope.isUsing = false;
            $scope.ok = function () {
                $scope.isUsing = true;
                userService.delete(id).then(function () {
                    $modalInstance.close();
                }, function () {
                    $scope.isUsing = false;
                });
            };
        }

        function getPreviousPage() {
            if (($scope.pagination.currentPage - 1) * $scope.pagination.pageSize == $scope.pagination.total - 1) {
                $scope.pagination.currentPage = $scope.pagination.currentPage - 1;
            };
        }
    }]);
