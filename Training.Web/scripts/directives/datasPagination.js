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