'use strict';

angular.module('app.newsItem', ['ngRoute'])

.service('TopNewsItemIdsService', ['$q', '$http', function($q, $http) {
	return function () {
		return $http.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(response) {
			return response.data;
		});
	}	
}])

.service('NewsItemsService', ['$q', '$http', function($q, $http) {

	function allowedItemType(newsItem, allowedItemTypes) {
		return allowedItemTypes.filter(function(type) {
			return newsItem && newsItem.type && newsItem.type === type;
		}).length > 0;
	}

	function isNumberOfItemsToReturnReached(newsItems, config) {
		return newsItems.length >= config.numberOfItemsToReturn;
	}

	function getNewsItems(newsItemIds, config, newsItems) {
		var newsItemId = newsItemIds.pop();
		newsItems = newsItems || [];

		return $http.get('https://hacker-news.firebaseio.com/v0/item/' + newsItemId + '.json').then(function(response) {
			console.log(response.data);
			if (allowedItemType(response.data, config.allowedTypes))
				newsItems.push(response.data);

			if (!isNumberOfItemsToReturnReached(newsItems, config) && newsItemIds.length) {
				return getNewsItems(newsItemIds, config, newsItems);
			} else {
				console.log('newsItems', newsItems);
				return newsItems;
			}
		});
	}

	return function(newsItemIds, config) {
		return getNewsItems(newsItemIds, config);
	};
}]);