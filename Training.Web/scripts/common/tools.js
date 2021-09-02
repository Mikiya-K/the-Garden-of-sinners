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