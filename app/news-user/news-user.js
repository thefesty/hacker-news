'use strict';

angular.module('app.newsUser', ['ngRoute'])

.service('NewsUserService', ['$http', function($http) {
	return function(newUserId) {
		return $http.get('https://hacker-news.firebaseio.com/v0/user/' + newUserId + '.json').then(function (response) {
			console.log('Retrieved user', response.data);
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