app.controller("alertController", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.alerts = [];
    $scope.alerts = $rootScope.alerts;
    $scope.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };
}]);
