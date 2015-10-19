'use strict';

angular.module('app', [
	'ngRoute',
	'app.newsItemList'
]);

'use strict';

angular.module('app.newsItem', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-item', {
		templateUrl: 'app/news-item/news-item.html',
		controller: 'NewsItemController'
	});
}]);
'use strict';

angular.module('app.newsItemList', ['ngRoute', 'app.newsItem', 'app.newsUser'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-item-list', {
		templateUrl: 'app/news-item-list/news-item-list.html',
		controller: 'NewsItemListController'
	});
}]);
'use strict';

angular.module('app.newsUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/news-user', {
		templateUrl: 'app/news-user/news-user.html',
		controller: 'NewsUserController'
	});
}]);
'use strict';

angular.module('app')

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/news-item-list'});
}]);
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
'use strict';

angular.module('app.newsUser')

// .controller('NewsUserController', ['NewsItemListService', function(NewsItemListService) {
// 	NewsItemListService(10).then(function(newsItemList) {
// 		console.log(newsItemList);
// 	});
// }])

.service('NewsUserService', ['$http', function($http) {
	return function(newUserId) {
		return $http({
			method: 'GET',
			url: 'https://hacker-news.firebaseio.com/v0/user/' + newUserId + '.json'
		}).then(function (response) {
			return response.data;
		})
	};
}])

.service('NewsUsersService', ['$q', 'NewsUserService', function($q, NewsUserService) {
	return function(newsUserIds) {
		var promises = [];
		newsUserIds.forEach(function(newUserId) {
			promises.push(NewsUserService(newUserId));
		});
		return $q.all(promises).then(function (responses) {
			return responses;
		})
	};
}])
;