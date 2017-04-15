var app = angular.module('expert', ['ngRoute', 'ui.bootstrap', 'bw.paging']);

//app.config(function($routeProvider) {
//    $routeProvider
//        .when('/', {
//            templateUrl : 'html/list.html',
//            controller  : 'ListController'
//        });
//});
var OUC = {
    isEmpty: function (obj) {
        return obj == undefined || obj == null;
    }
};