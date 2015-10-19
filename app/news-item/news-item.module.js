'use strict';

angular.module('app.newsItem', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-item', {
		templateUrl: 'app/news-item/news-item.html',
		controller: 'NewsItemController'
	});
}]);