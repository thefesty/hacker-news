'use strict';

angular.module('app.newsUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-user', {
		templateUrl: 'app/news-user/news-user.html',
		controller: 'NewsUserController'
	});
}]);