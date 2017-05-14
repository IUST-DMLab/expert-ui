app
    .controller('MainController', function ($scope, $http, RestService, $cookieStore, $mdSidenav, $filter) {

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

        $scope.data = {subjects: {}, triples: {}};
        $scope.search = {};
        $scope.modules = ['wiki', 'web_table_extractor', 'wiki_table_extractor', 'text'];
        $scope.PREFIX = 'http://194.225.227.161/mapping/html/triple.html?subject=';

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
                    $scope.isVipUser = (response.data.indexOf("ROLE_VIPEXPERT") !== -1);
                    $scope.error = undefined;

                    $scope.reload();
                }
            }

            function ERROR(error, status) {
                $scope.authToken = '';
                $scope.authenticated = false;
                $scope.error = {error: error, status: status};
            }
        };

        $scope.reload = function () {
            if ($scope.authenticated)
                RestService.getSubjects($scope.authToken)
                    .then(function (response) {
                        if (!response.data.data.length) {
                            $scope.requestMore();
                            return;
                        }

                        for (let item of response.data.data) {
                            RestService.getLabel(item.id)
                                .then(function (d) {
                                    var titleRow = d.data.data.filter(function (q) {
                                        return q.predicate.endsWith('label');
                                    })[0];

                                    item.caption = titleRow ? titleRow.object.value :  ($filter('mapPrefix')(item.id) || item.id);
                                });
                        }

                        $scope.data.subjects.list = response.data.data;
                        $scope.loadTriples($scope.data.subjects.list[0]);
                    });
        };

        $scope.loadTriples = function (subject) {
            $scope.data.subjects.selected = subject;
            RestService.getTriples($scope.authToken, $scope.data.subjects.selected.id)
                .then(function (response) {
                    if (!response.data.data.length) {
                        $scope.reload();
                        return;
                    }

                    $scope.data.triples.list = response.data.data;

                    var titleRow = $scope.data.triples.list.filter(function (item) {
                        return item.triple.predicate.endsWith('label');
                    })[0];

                    $scope.data.pageTitle = titleRow ? titleRow.triple.object.value : '--- تعیین نشده ---';
                });
        };

        $scope.submit = function (item, vip) {
            var vote = item.vote || 'None';
            if ($scope.isVipUser && vip && item.vote !== 'None')
                vote = 'VIP' + item.vote;

            RestService.vote($scope.authToken, item.identifier, vote)
                .then(function (data) {
                    $scope.loadTriples($scope.data.subjects.selected);
                });
        };

        $scope.submitAll = function (vip) {
            let i = 0;
            let items = {};
            for (let item of $scope.data.triples.list) {
                i++;
                let vote = item.vote || 'None';
                if ($scope.isVipUser && vip && item.vote !== 'None')
                    vote = 'VIP' + item.vote;
                items[item.identifier] = vote;
            }

            RestService.batchVote($scope.authToken, items)
                .then(function (data) {
                    $scope.reload();
                });
        };

        $scope.requestMore = function () {

            var m = $scope.search.module;
            var t = $scope.search.text;

            if (m || t)
                RestService.requestMore($scope.authToken, m, t)
                    .then(function (data) {
                        $scope.reload();
                    });
        };

        $scope.checkAll = function (vote) {
            if ($scope.data.triples.list && $scope.data.triples.list.length) {
                for (let item of $scope.data.triples.list) {
                    item.vote = vote;
                }
            }
        };

        $scope.toggle = function () {
            $mdSidenav('sidebar').toggle();
        };

        $scope.reload();
    });
