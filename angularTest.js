angular.module('angularTest', ['ngRoute'])

.value('twitchApi', 'https://api.twitch.tv/kraken')

.config(function($routeProvider) {
  $routeProvider
  .when('/videos', {
      controller:'VideosController'
    })
    .otherwise({
      redirectTo:'/videos'
    });
})

.factory('videoService', function($http, twitchApi){
	var videoService = {
		getVideos : function(userName){
	 		return $http.jsonp(twitchApi + '/channels/' + userName + '/videos?limit=10' + '&callback=JSON_CALLBACK');
	 	}
	};

	return videoService;
})

.controller('VideosController', function($scope, $routeParams, twitchApi, $http, videoService) {

	if($routeParams.userName == undefined)
		$routeParams.userName = 'wingsofdeath';

	function init(){
		videoService.getVideos($routeParams.userName)
			.success(function(data){
				$scope.videos = data.videos;
			});
	}

	init();
})
.directive('searchButton', function(videoService){

	return {
		restrict: 'EA',
		replace: false,
		templateUrl: 'views/updateVideosButton.html',
		link: function(scope, $element) {

			var getVideos = function getVideos(){
				var searchName = scope.searchName;
				videoService.getVideos(searchName)
					.then(
						function(response){
							scope.videos = response.data.videos;
							scope.searchName = searchName;
						});
			}

			$element.on('click', function() {
				scope.$apply(getVideos);
			});

			scope.updateVideos = getVideos;
		}
	}
})
.directive('videos', function(videoService){
	console.log('videos directive');
	return {
		restrict: 'EA',
		replace: false,
		templateUrl: 'views/videos.html',
		link: function(scope) {
		}
	}	
});