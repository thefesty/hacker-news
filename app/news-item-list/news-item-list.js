'use strict';

angular.module('app.newsItemList')

.controller('NewsItemListController', ['NewsItemListService', function(NewsItemListService) {
	NewsItemListService(10).then(function(newsItemList) {
		console.log(newsItemList);
	});
}])

.service('NewsItemListService', ['$q', 'NewsItemIdListService', 'NewsItemsService', 'NewsUsersService', function($q, NewsItemIdListService, NewsItemsService, NewsUsersService) {
	function getRandomItems(items, numberOfItems) {
		return items.slice(0, numberOfItems);
	}

	function getNewsUserIds(newsItems) {
		return newsItems.map(function(newsItem) {
			return newsItem.by;
		});
	}

	function getNewsUser(newsUsers, newsUserId) {
		return newsUsers.filter(function(newsUser) {
			return newsUser.id === newsUserId;
		})[0];
	}

	function mapNewsItemAndNewsUser(newsItem, newsUser) {
		return {
			id: newsItem.id,
			title: newsItem.title,
			created: newsItem.time,
			score: newsItem.score,
			createdBy: {
				username: newsUser.id,
				karma: newsUser.karma
			}
		}
	}

	function mapNewsItemsAndNewsUsers(newsItems, newsUsers) {
		return newsItems.map(function(newsItem) {
			return mapNewsItemAndNewsUser(newsItem, getNewsUser(newsUsers, newsItem.by))
		});
	}

	return function(numberOfItemsToReturn) {
		return NewsItemIdListService.then(function(ids) {
			var randomNewsItemIds = getRandomItems(ids, numberOfItemsToReturn);
			return NewsItemsService(randomNewsItemIds).then(function(newsItems) {
				var newsUserIds = getNewsUserIds(newsItems);
				return NewsUsersService(newsUserIds).then(function(newsUsers) {
					return mapNewsItemsAndNewsUsers(newsItems, newsUsers);
				})
			});
		})
	}
}])

.service('NewsItemIdListService', ['$http', function($http) {
	return $http({
		method: 'GET',
		url: 'https://hacker-news.firebaseio.com/v0/topstories.json'
	}).then(function (response) {
		return response.data;
	});
}]);