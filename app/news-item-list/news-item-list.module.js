'use strict';

angular.module('app.newsItemList', ['ngRoute', 'app.newsItem', 'app.newsUser'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-item-list', {
		templateUrl: 'app/news-item-list/news-item-list.html',
		controller: 'NewsItemListController',
		controllerAs: 'newsItemList'
	});
}]);