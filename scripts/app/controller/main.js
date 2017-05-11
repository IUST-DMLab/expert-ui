app
    .controller('MainController', function ($scope, $http, RestService, $cookieStore, $mdSidenav) {

        //var at = $cookieStore.get('authToken');
        var at = undefined;
        $scope.roles = $cookieStore.get('roles');
        if (at) {
            $scope.authenticated = true;
            $scope.authToken = at;
        }
        else {
            $scope.authenticated = false;
        }

        $scope.username = '';
        $scope.password = '';
        //$scope.voteList = ['None', 'Reject', 'Approve', 'VIPReject', 'VIPApprove'];
        $scope.data = {subjects: {}, triples: {}};

        $scope.login = function (username, password) {
            $scope.authToken = '';
            $scope.roles = [];

            RestService.login(username, password).then(SUCCESS, ERROR);

            function SUCCESS(response) {
                $scope.authToken = response.headers('x-auth-token');
                if ($scope.authToken) {
                    $cookieStore.put('authToken', $scope.authToken);
                    $cookieStore.put('roles', response.data);
                    $scope.roles = response.data;
                    $scope.authenticated = true;
                    $scope.isVipUser = (response.data[0] === "ROLE_VIPEXPERT");
                    $scope.error = undefined;

                    $scope.reload(0);
                }
            }

            function ERROR(error, status) {
                $scope.authToken = '';
                $scope.authenticated = false;
                $scope.error = {error: error, status: status};
            }
        };

        $scope.reload = function (page) {
            RestService.getSubjects($scope.authToken)
                .then(function (response) {
                    //$scope.copy = angular.copy(data);
                    $scope.data.subjects.list = response.data.data;
                    if ($scope.data.subjects.list && $scope.data.subjects.list.length) {
                        $scope.loadTriples($scope.data.subjects.list[0]);
                    }
                    else {

                    }
                    //$scope.data.pageNo = $scope.data.page + 1;
                    //$scope.data.searchPageNo = $scope.data.pageNo;
                });
        };

        $scope.loadTriples = function (subject) {
            $scope.data.subjects.selected = subject;
            RestService.getTriples($scope.authToken, $scope.data.subjects.selected.id)
                .then(function (response) {
                    $scope.data.triples.list = response.data.data;

                    var titleRow = $scope.data.triples.list.filter(function (item) {
                        return item.triple.predicate.endsWith('label');
                    })[0];

                    $scope.data.pageTitle = titleRow ? titleRow.triple.object.value : '--- تعیین نشده ---';
                });
        };

        $scope.submit = function (identifier, vote) {
            RestService.vote($scope.authToken, identifier, vote)
                .then(function (data) {
                    $scope.reload($scope.data.pageNo);
                });
        };

        $scope.submitAll = function (items) {
            RestService.batchVote($scope.authToken, identifier, vote)
                .then(function (data) {
                    $scope.reload($scope.data.pageNo);
                });
        };

        $scope.requestMore = function () {
            if (confirm('آیا می‌خواهید تعداد بیشتری رابطه به شما تخصیص داده شود؟'))
                RestService.requestMore($scope.authToken, 50)
                    .then(function (data) {
                        //$scope.data.data[index].vote = data.vote;
                        $scope.reload(0);
                    });
        };

        //$scope.revert = function (index) {
        //    $scope.data.data[index] = $scope.copy.data[index];
        //};

        $scope.checkAll = function (vote) {
            if ($scope.data.triples.list && $scope.data.triples.list.length) {
                for (let item of $scope.data.triples.list) {
                    item.vote = vote;
                }
            }
        };

        $scope.applyAll = function (vip) {
            var vote = vip ? 'VIP' : '';

        };

        $scope.toggle = function () {
            $mdSidenav('sidebar').toggle();
        };

        $scope.reload();
    });
