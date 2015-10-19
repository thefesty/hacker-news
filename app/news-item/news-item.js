'use strict';

angular.module('app.newsItem')

// .controller('NewsItemController', ['NewsItemListService', function(NewsItemListService) {
// 	NewsItemListService(10).then(function(newsItemList) {
// 		console.log(newsItemList);
// 	});
// }])

.service('NewsItemService', ['$http', function($http) {
	return function(newsItemId) {
		return $http({
			method: 'GET',
			url: 'https://hacker-news.firebaseio.com/v0/item/' + newsItemId + '.json'
		}).then(function (response) {
			return response.data;
		})
	};
}])

.service('NewsItemsService', ['$q', 'NewsItemService', function($q, NewsItemService) {
	return function(newsItemIds) {
		var promises = [];
		newsItemIds.forEach(function(newsItemId) {
			promises.push(NewsItemService(newsItemId));
		});
		return $q.all(promises).then(function (responses) {
			return responses;
		})
	};
}]);