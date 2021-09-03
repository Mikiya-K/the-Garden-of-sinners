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
