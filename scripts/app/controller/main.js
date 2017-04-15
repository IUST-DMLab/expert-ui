app
    .controller('MainController', function ($scope, $http, RestService) {

        $scope.authenticated = false;
        $scope.username = '';
        $scope.password = '';

        $scope.login = function (username, password) {
            //var username = $scope.username;
            //var password = $scope.password;
            //console.log($scope);
            //console.log('user, pass : ', username, password);

            $scope.authToken = '';
            $scope.roles = [];

            $http.get('http://194.225.227.161:8092/services/rs/v1/experts/login', {
                headers: {'Authorization': 'Basic ' + btoa(username + ':' + password)}
            }).then(function (response) {
                $scope.authToken = response.headers('x-auth-token');
                if ($scope.authToken) {
                    $scope.roles = response.data;
                    $scope.authenticated = true;

                    $scope.reload(0);
                }
            });


            //RestService.login(username, password)
            //    .success(function (data) {
            //        console.log(data);
            //        $scope.data = data;
            //    });

        };

        $scope.reload = function (page) {

            RestService.current($scope.authToken, page, 10)
                .success(function (data) {
                    $scope.data = data;
                    $scope.data.pageNo = $scope.data.page + 1;
                    $scope.data.searchPageNo = $scope.data.pageNo;
                });
        }


    });


function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

