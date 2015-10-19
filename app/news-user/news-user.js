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