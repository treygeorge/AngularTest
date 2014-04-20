angular.module('angularTest', ['ngRoute'])

.value('twitchApi', 'https://api.twitch.tv/kraken')

.config(function($routeProvider) {
    $routeProvider
    .when('/videos', {
        controller:'VideosController',
        templateUrl:'views/videos.html'
    })
    .when('/follows', {
        controller: 'FollowsController',
        templateUrl:'views/follows.html'
    })
    .otherwise({
        redirectTo:'/videos'
    });
})

.factory('videoService', function($http, twitchApi){
	var videoService = {
		getVideos : function(userName) {
	 		return $http.jsonp(twitchApi + '/channels/' + userName + '/videos?limit=10' + '&callback=JSON_CALLBACK');
		},
		getFollows : function(userName) {
			return $http.jsonp(twitchApi + '/users/' + userName + '/follows/channels?limit=10' + '&callback=JSON_CALLBACK');
		}
	};

	return videoService;
})

.controller('VideosController', function($scope, $routeParams, twitchApi, $http, videoService) {

	if($scope.userName == undefined)
		$scope.userName = 'wingsofdeath';

	function init(){
		videoService.getVideos($scope.userName)
			.success(function(data){
				$scope.videos = data.videos;
			});
	}

	init();
})

.controller('FollowsController', function($scope, $routeParams, $http, videoService) {
	if($scope.userName == undefined)
		$scope.userName = 'wingsofdeath';

	function init() {
		videoService.getFollows($scope.userName)
			.success(function(data) {
				$scope.follows = data.follows;
			});
	}

	init();
})

.directive('searchVideosButton', function(videoService){

	return {
		restrict: 'EA',
		replace: false,
		templateUrl: 'directives/updateVideosButton.html',
		link: function(scope, $element) {

			var getVideos = function() {
				var searchName = scope.searchName;
				videoService.getVideos(searchName)
					.then(
						function(response){
							scope.videos = response.data.videos;
							scope.userName = searchName;
						});
			}

			$element.on('click', function() {
				scope.$apply(getVideos);
			});

			scope.updateVideos = getVideos;
		}
	}
})
.directive('searchFollowsButton', function(videoService) {
	return {
		restrict: 'EA',
		replace: false,
		templateUrl: 'directives/updateVideosButton.html',
		link: function(scope, $element) {
			var getFollows = function() {
				var searchName = scope.searchName;
				videoService.getFollows(searchName)
					.then(
						function(response){
							scope.follows = response.data.follows;
                            scope.userName = searchName;
					})
			}

			$element.on('click', function() {
				scope.$apply(getFollows);
			});

			scope.updateFollows = getFollows;
		}
	}
});
