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