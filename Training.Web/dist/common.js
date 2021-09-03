"use strict";
var app = angular.module("app", ["ngRoute", "ui.bootstrap", "ipCookie"]);
app.provider("versionTools", function () {
    this.lastBuildTimeStamp="20210903084630";
    this.$get = function () {
	    var lastBuildTimeStamp = this.lastBuildTimeStamp;
        return {
            getLastBuildTimeStamp: function () {
                return lastBuildTimeStamp;
            }
        }
    };
});

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
app.factory("httpProxy", ["$http", "$q", "apiTools", "tools", function ($http, $q, apiTools, tools) {
    var baseUrl = apiTools.getApiUrl();
    var getHeaders = function () {
    };
    var handleError = function (status, errorMessage) {
        var error = {};
        if (errorMessage != null && typeof errorMessage == "string" && errorMessage != "") {
            error = { code: status, errorMessage: errorMessage };
        } else {
            error = { code: status, errorMessage: "服务器内部错误，请联系管理员" };
        }
        tools.error(error);
        return error;
    }
    return {
        get: function (action, option) {
            var deferred = $q.defer();
            var defaultOption = {
                method: "Get",
                headers: getHeaders(),
                url: baseUrl + action,
                cache: false
            };
            option = $.extend(defaultOption, option);
            $http(option).success(function (data) {
                deferred.resolve(data);
            }).error(function (errorMessage, status) {
                var error = handleError(status, errorMessage);
                deferred.reject(error);
            });

            return deferred.promise;
        },

        post: function (action, data, option) {
            var deferred = $q.defer();
            var defaultOption = {
                method: "Post",
                headers: getHeaders(),
                crossDomain: true,
                data: data,
                url: baseUrl + action,
                cache: false
            };
            option = $.extend(defaultOption, option);
            $http(option).success(function (successResult) {
                deferred.resolve(successResult);
            }).error(function (errorResult, status) {
                var error = handleError(status, errorResult);
                deferred.reject(error);
            });

            return deferred.promise;
        },

        put: function (action, data, option) {
            var deferred = $q.defer();
            var defaultOption = {
                method: "Put",
                headers: getHeaders(),
                data: data,
                url: baseUrl + action,
                cache: false
            };
            option = $.extend(defaultOption, option);
            $http(option).success(function (successResult) {
                deferred.resolve(successResult);
            }).error(function (errorResult, status) {
                var error = handleError(status, errorResult);
                deferred.reject(error);
            });

            return deferred.promise;
        },

        delete: function (action, option) {
            var deferred = $q.defer();
            var defaultOption = {
                method: "Delete",
                headers: getHeaders(),
                url: baseUrl + action,
                cache: false
            };
            option = $.extend(defaultOption, option);
            $http(option).success(function (successResult) {
                deferred.resolve(successResult);
            }).error(function (errorResult, status) {
                var error = handleError(status, errorResult);
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };
}]);
app.factory("tools", ["$rootScope", "$location", "$timeout", function ($rootScope, $location, $timeout) {

    function showErrorAlert(errorMessage, autoHide) {
        var alert = {
            type: "danger",
            msg: errorMessage
        };

        $rootScope.alerts.push(alert);
        if (autoHide) {
            $timeout(function () {
                $rootScope.$apply(function () {
                    $rootScope.alerts.pop();
                });
            }, 5000, true);
        }
    }

    function isEmpty(value) {
        return typeof value === "undefined";
    }

    return {
        success: function (msg) {
            var alert = {
                type: "success",
                msg: isEmpty(msg) ? "保存成功！" : msg
            };
            $rootScope.alerts.push(alert);
            $timeout(function () {
                $rootScope.$apply(function () {
                    $rootScope.alerts.pop();
                });
            }, 2000, true);
        },
        error: function (error) {
            if (error === "escape key press" || error == undefined) return;

            if (typeof error === "string") {
                showErrorAlert(error, true);
            } else {
                if (error.code === 401) {
                    $location.path("/login");
                    return;
                } else if (error.code === 403) {
                    $location.path("/login");
                    return;
                } else if (error.code === 404) {
                    $location.path("/404");
                } else {
                    showErrorAlert(error.errorMessage, true);
                    return;
                }
            }
        },
        cookieName: function () {
            return "application_globals";
        },
        tokenName: function () {
            return "AuthenticationToken";
        },
    };
}]);
app.directive("datasPagination", function () {
    return {
        scope: {
            paginationinfo: '='
        },
        restrict: "EA",
        replace: true,
        template: '<div>' +
            '<ul class="pagination pull-right" ng-show="paginationinfo.total>0">' +
            '<li ng-if="paginationinfo.currentPage!=1"><a ng-click="prevPage()"">上一页</a></li>' +
            '<li ng-repeat="item in pageList track by $index" ng-class="{\'active\':item==paginationinfo.currentPage}"><a ng-click="changeCurrentPage(item)">{{item}}</a></li>' +
            '<li ng-if="paginationinfo.currentPage!=paginationinfo.numberOfPages"><a ng-click="nextPage()">下一页</a></li>' +
            '</ul>' +
            '<ul class="pagination pull-right pagination-lable" ng-show="paginationinfo.total>0">' +
            '<li>' +
            '每页条数<select ng-model="paginationinfo.pageSize" ng-options="option for option in paginationinfo.perPageOptions" ng-change="changepageSize()"></select>' +
            ' 共{{paginationinfo.total}}条记录，跳转至<input type="text" ng-model="jumpPageNum" ng-keyup="jumpPageKeyUp($event)" style="width:40px;" />' +
            '</li>' +
            '</ul>' +
            '</div>',
        link: function (scope) {

            var paginationinfo = scope.paginationinfo;

            // 默认分页长度
            var defaultPagesLength = 5;

            // 默认分页选项可调整每页显示的条数
            var defaultPerPageOptions = [10, 20, 30, 40, 50];

            // 默认每页的个数
            var defaultPerPage = 15;

            // 获取分页长度
            if (paginationinfo.pagesLength) {
                // 判断一下分页长度
                paginationinfo.pagesLength = parseInt(paginationinfo.pagesLength, 10);

                if (!paginationinfo.pagesLength) {
                    paginationinfo.pagesLength = defaultPagesLength;
                }

                // 分页长度必须为奇数，如果传偶数时，自动处理
                if (paginationinfo.pagesLength % 2 === 0) {
                    paginationinfo.pagesLength += 1;
                }

            } else {
                paginationinfo.pagesLength = defaultPagesLength
            }

            // 分页选项可调整每页显示的条数
            if (!paginationinfo.perPageOptions) {
                paginationinfo.perPageOptions = defaultPerPageOptions;
            }

            // pageList数组
            function getPagination(newValue, oldValue) {
                // paginationinfo.currentPage
                if (paginationinfo.currentPage) {
                    paginationinfo.currentPage = parseInt(scope.paginationinfo.currentPage, 10);
                }

                if (!paginationinfo.currentPage) {
                    paginationinfo.currentPage = 1;
                }

                // paginationinfo.total
                if (paginationinfo.total) {
                    paginationinfo.total = parseInt(paginationinfo.total, 10);
                }

                // paginationinfo.total
                if (!paginationinfo.total) {
                    paginationinfo.total = 0;
                    return;
                }

                // paginationinfo.pageSize 
                if (paginationinfo.pageSize) {
                    paginationinfo.pageSize = parseInt(paginationinfo.pageSize, 10);
                }
                if (!paginationinfo.pageSize) {
                    paginationinfo.pageSize = defaultPerPage;
                }

                // numberOfPages
                paginationinfo.numberOfPages = Math.ceil(paginationinfo.total / paginationinfo.pageSize);

                // 如果分页总数>0，并且当前页大于分页总数
                if (scope.paginationinfo.numberOfPages > 0 && scope.paginationinfo.currentPage > scope.paginationinfo.numberOfPages) {
                    scope.paginationinfo.currentPage = scope.paginationinfo.numberOfPages;
                }

                // 如果pageSize在不在perPageOptions数组中，就把pageSize加入这个数组中
                var perPageOptionsLength = scope.paginationinfo.perPageOptions.length;

                // 定义状态
                var perPageOptionsStatus;
                for (var i = 0; i < perPageOptionsLength; i++) {
                    if (paginationinfo.perPageOptions[i] == paginationinfo.pageSize) {
                        perPageOptionsStatus = true;
                    }
                }
                // 如果pageSize在不在perPageOptions数组中，就把pageSize加入这个数组中
                if (!perPageOptionsStatus) {
                    paginationinfo.perPageOptions.push(paginationinfo.pageSize);
                }

                // 对选项进行sort
                paginationinfo.perPageOptions.sort(function (a, b) {
                    return a - b
                });


                // 页码相关
                scope.pageList = [];
                if (paginationinfo.numberOfPages <= paginationinfo.pagesLength) {
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for (i = 1; i <= paginationinfo.numberOfPages; i++) {
                        scope.pageList.push(i);
                    }
                } else {
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (paginationinfo.pagesLength - 1) / 2;
                    if (paginationinfo.currentPage <= offset) {
                        // 左边没有...
                        for (i = 1; i <= offset + 1; i++) {
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(paginationinfo.numberOfPages);
                    } else if (paginationinfo.currentPage > paginationinfo.numberOfPages - offset) {
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for (i = offset + 1; i >= 1; i--) {
                            scope.pageList.push(paginationinfo.numberOfPages - i);
                        }
                        scope.pageList.push(paginationinfo.numberOfPages);
                    } else {
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for (i = Math.ceil(offset / 2); i >= 1; i--) {
                            scope.pageList.push(paginationinfo.currentPage - i);
                        }
                        scope.pageList.push(paginationinfo.currentPage);
                        for (i = 1; i <= offset / 2; i++) {
                            scope.pageList.push(paginationinfo.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(paginationinfo.numberOfPages);
                    }
                }

                scope.$parent.paginationinfo = paginationinfo;
            }

            // prevPage
            scope.prevPage = function () {
                if (paginationinfo.currentPage > 1) {
                    paginationinfo.currentPage -= 1;
                }
                getPagination();
                if (paginationinfo.onChange) {
                    paginationinfo.onChange();
                }
            };

            // nextPage
            scope.nextPage = function () {
                if (paginationinfo.currentPage < paginationinfo.numberOfPages) {
                    paginationinfo.currentPage += 1;
                }
                getPagination();
                if (paginationinfo.onChange) {
                    paginationinfo.onChange();
                }
            };

            // 变更当前页
            scope.changeCurrentPage = function (item) {

                if (item == '...') {
                    return;
                } else {
                    paginationinfo.currentPage = item;
                    getPagination();
                    // paginationinfo.onChange()函数
                    if (paginationinfo.onChange) {
                        paginationinfo.onChange();
                    }
                }
            };

            // 修改每页展示的条数
            scope.changepageSize = function () {

                // 一发展示条数变更，当前页将重置为1
                paginationinfo.currentPage = 1;

                getPagination();
                // paginationinfo.onChange()函数
                if (paginationinfo.onChange) {
                    paginationinfo.onChange();
                }
            };

            // 跳转页
            scope.jumpToPage = function () {
                var num = scope.jumpPageNum;
                if (num.match(/\d+/)) {
                    num = parseInt(num, 10);

                    if (num && num != paginationinfo.currentPage) {
                        if (num > paginationinfo.numberOfPages) {
                            num = paginationinfo.numberOfPages;
                        }

                        // 跳转
                        paginationinfo.currentPage = num;
                        getPagination();
                        // paginationinfo.onChange()函数
                        if (paginationinfo.onChange) {
                            paginationinfo.onChange();
                        }
                        scope.jumpPageNum = '';
                    }
                }

            };

            scope.jumpPageKeyUp = function (e) {
                var keycode = window.event ? e.keyCode : e.which;

                if (keycode == 13) {
                    scope.jumpToPage();
                }
            }

            scope.$watch('paginationinfo.total', function (value, oldValue) {

                // 在无值或值相等的时候，去执行onChange事件
                if (!value || value == oldValue) {

                    if (paginationinfo.onChange) {
                        paginationinfo.onChange();
                    }
                }
                getPagination();
            })

        }
    };
});
$(document).ready(function () {
    // class
    $(document).on('click', '[data-toggle^="class"]', function (e) {
        e && e.preventDefault();
        console.log('abc');
        var $this = $(e.target), $class, $target, $tmp, $classes, $targets;
        !$this.data('toggle') && ($this = $this.closest('[data-toggle^="class"]'));
        $class = $this.data()['toggle'];
        $target = $this.data('target') || $this.attr('href');
        $class && ($tmp = $class.split(':')[1]) && ($classes = $tmp.split(','));
        $target && ($targets = $target.split(','));
        $classes && $classes.length && $.each($targets, function (index, value) {
            if ($classes[index].indexOf('*') !== -1) {
                var patt = new RegExp('\\s' +
                    $classes[index].
                      replace(/\*/g, '[A-Za-z0-9-_]+').
                      split(' ').
                      join('\\s|\\s') +
                    '\\s', 'g');
                $($this).each(function (i, it) {
                    var cn = ' ' + it.className + ' ';
                    while (patt.test(cn)) {
                        cn = cn.replace(patt, ' ');
                    }
                    it.className = $.trim(cn);
                });
            }
            ($targets[index] != '#') && $($targets[index]).toggleClass($classes[index]) || $this.toggleClass($classes[index]);
        });
        $this.toggleClass('active');
    });

    // collapse nav
    $(document).on('click', 'nav a', function (e) {
        var $this = $(e.target), $active;
        $this.is('a') || ($this = $this.closest('a'));

        $active = $this.parent().siblings(".active");
        $active && $active.toggleClass('active').find('> ul:visible').slideUp(200);

        ($this.parent().hasClass('active') && $this.next().slideUp(200)) || $this.next().slideDown(200);
        $this.parent().toggleClass('active');

        $this.next().is('ul') && e.preventDefault();

        setTimeout(function () { $(document).trigger('updateNav'); }, 300);
    });
});

