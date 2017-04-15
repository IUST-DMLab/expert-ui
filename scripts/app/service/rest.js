app.service('RestService', ['$http', function ($http) {
    var baseURl = 'http://194.225.227.161:8092';
    var self = this;
    this.ingoing = 0;

    self.init = function (rootAddress) {
        baseURl = rootAddress;
    };

    function handelError(error) {
        self.ingoing--;
        console.log(error);
    }

    function handelSuccess(/*data, status, headers, config*/) {
        self.ingoing--;
    }

    function http(req) {
        if (OUC.isEmpty(req.params)) req.params = {};
        req.params.random = new Date().getTime();
        self.ingoing++;

        $('#loading').remove();
        $('body').append('<div id="loading" class="loading"><span>loading...</span></div>');

        $('#loading').fadeIn();
        return $http(req).error(function () {
            handelError();
            $('#loading').fadeOut();
        }).success(function () {
            handelSuccess();
            $('#loading').fadeOut();
        });
    }

    function post(url, data) {
        self.ingoing++;
        return $http.post(url, data).error(handelError).success(handelSuccess);
    }

    /**/

    //this.login = function (username, password) {
    //    var req = {
    //        method: 'GET',
    //        url: baseURl + '/services/rs/v1/experts/login',
    //        headers: {'Authorization': 'Basic ' + btoa(username + ':' + password)}
    //    };
    //
    //    return http(req);
    //};

    this.current = function (authToken, pageIndex, pageSize) {
        var req = {
            method: 'GET',
            url: baseURl + '/services/rs/v1/experts/triples/current',
            headers: {
                "x-auth-token": authToken
            },
            params: {
                page: pageIndex,
                pageSize: pageSize
            }
        };
        return http(req);
    };

}]);
