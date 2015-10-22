'use strict';

angular.module('app.newsItemList', ['ngRoute', 'app.newsItem', 'app.newsUser'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-item-list', {
		templateUrl: 'app/news-item-list/news-item-list.html',
		controller: 'NewsItemListController',
		controllerAs: 'newsItemList'
	});
}])

.controller('NewsItemListController', ['NewsItemListService', function(NewsItemListService) {
	var $this = this;

	$this.newsItemList = [];
	$this.possibleConfig = {
		numberOfItemsToReturn: [10, 50, 100],
		allowedTypes: ['job', 'poll', 'story']
	}
	$this.currentConfig = {
		numberOfItemsToReturn: 10,
		allowedTypes: ['story']
	}

	$this.isCountSelected = function(count) {
		return $this.currentConfig.numberOfItemsToReturn === count;
	}

	$this.selectCount = function(count) {
		if ($this.numberOfItemsToReturn !== count) {
			$this.currentConfig.numberOfItemsToReturn = count;
			$this.loadNewsItems();
		}
	}

	$this.capitalize = function(word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	$this.isTypeSelected = function(type) {
		return $this.currentConfig.allowedTypes.filter(function(allowedType) {
			return allowedType === type;
		}).length > 0;
	}

	$this.toggleType = function(type) {
		if ($this.isTypeSelected(type)) {
			$this.removeType(type)
		} else {
			$this.addType(type);
		}
		$this.loadNewsItems();
	}

	$this.addType = function(type) {
		$this.currentConfig.allowedTypes.push(type);
	}

	$this.removeType = function(type) {
		$this.currentConfig.allowedTypes.splice($this.currentConfig.allowedTypes.indexOf(type), 1);
	}

	$this.loadNewsItems = function() {
		$this.loading = true;
		$this.loadingError = false;
		console.log('load', $this.currentConfig);
		try {
			NewsItemListService($this.currentConfig).then(function(newsItemList) {
				$this.newsItemList = newsItemList;
				$this.loading = false;
			})
		} catch (e) {
			$this.newsItemList = [];
			$this.loading = false;
			$this.loadingError = true;
		};
	}

	$this.loadNewsItems();
}])

.service('NewsItemListService', ['$q', 'TopNewsItemIdsService', 'NewsItemsService', 'NewsUsersService', function($q, TopNewsItemIdsService, NewsItemsService, NewsUsersService) {
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
		newsUser = newsUser || getUnknownNewsUser();
		return {
			id: newsItem.id,
			type: newsItem.type,
			title: newsItem.title,
			created: newsItem.time,
			url: newsItem.url,
			score: newsItem.score,
			createdBy: {
				username: newsUser.id,
				karma: newsUser.karma
			}
		}
	}

	function getUnknownNewsUser() {
		return {
			id: 'Unknown',
			karma: 0
		}
	}

	function mapNewsItemsAndNewsUsers(newsItems, newsUsers, config) {
		return newsItems.map(function(newsItem) {
			return mapNewsItemAndNewsUser(newsItem, getNewsUser(newsUsers, newsItem.by))
		});
	}

	return function(config) {
		return TopNewsItemIdsService().then(function(newsItemIds) {
			return newsItemIds;
		}).then(function(newsItemIds) {
			return NewsItemsService(newsItemIds, config).then(function(newsItems) {
				var newsUserIds = getNewsUserIds(newsItems);
				return { newsItems: newsItems, newsUserIds: newsUserIds}
			})
		}).then(function(newsData) {
			return NewsUsersService(newsData.newsUserIds).then(function(newsUsers) {
				return mapNewsItemsAndNewsUsers(newsData.newsItems, newsUsers);
			})
		});
	}
}]);