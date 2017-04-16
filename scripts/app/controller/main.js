app
    .controller('MainController', function ($scope, $http, RestService) {

        $scope.authenticated = false;
        $scope.username = '';
        $scope.password = '';
        $scope.voteList = ['None', 'Reject', 'Approve', 'VIPReject', 'VIPApprove'];

        $scope.login = function (username, password) {
            $scope.authToken = '';
            $scope.roles = [];

            RestService.login(username, password).then(T, F);

            function T(response) {
                $scope.authToken = response.headers('x-auth-token');
                if ($scope.authToken) {
                    $scope.roles = response.data;
                    $scope.authenticated = true;
                    $scope.error = undefined;

                    $scope.reload(0);
                }
            }

            function F(error, status) {
                $scope.authToken = '';
                $scope.authenticated = false;
                $scope.error = {error: error, status: status};
            }
        };

        $scope.reload = function (page) {
            RestService.current($scope.authToken, page, 10)
                .success(function (data) {
                    $scope.copy = angular.copy(data);
                    $scope.data = data;
                    $scope.data.pageNo = $scope.data.page + 1;
                    $scope.data.searchPageNo = $scope.data.pageNo;
                });
        };

        $scope.save = function (index, identifier, vote) {
            RestService.vote($scope.authToken, identifier, vote)
                .success(function (data) {
                    //$scope.data.data[index].vote = data.vote;
                    $scope.reload($scope.data.pageNo);
                });
        };

        $scope.requestMore = function () {
            if (confirm('آیا می‌خواهید تعداد بیشتری رابطه به شما تخصیص داده شود؟'))
                RestService.requestMore($scope.authToken, 50)
                    .success(function (data) {
                        //$scope.data.data[index].vote = data.vote;
                        $scope.reload(0);
                    });
        };

        $scope.revert = function (index) {
            $scope.data.data[index] = $scope.copy.data[index];
        }

    });
