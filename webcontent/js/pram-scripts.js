// pram-scripts.js

//	Dumb definition in order to avoid angular UI bootstrap dependencies script errors
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function        ($scope, $timeout, $transition, $q) {
}]);

//create the module and name it pram
//also included ngRoute for all our routing needs

var pram = angular.module('pram', ['ngRoute', 'ui.bootstrap'])

	.directive('slider', function ($parse) {
		return {
			restrict: 'E',
			replace: true,
			template: '<input type="text" />',
			link: function ($scope, element, attrs) {
				var model = $parse(attrs.model);
				var slider = $(element[0]).slider();
				slider.on('slide', function(ev) {
					model.assign($scope, ev.value);
					$scope.$apply();
				});
			}
		};
	})

	.factory('mySharedService', function($rootScope) {
	    var sharedService = {};
	    
	    sharedService.appId = '';
	
	    sharedService.prepForBroadcast = function(appId) {
	        this.appId = appId;
	        this.broadcastItem();
	    };
	    
	    //	Scope to tasks controller
	    sharedService.prepForBroadcastTasks = function(project) {
	    	this.project = project;
	        this.broadcastTasks();
	    };
	
	    sharedService.broadcastItem = function() {
	        $rootScope.$broadcast('changeAsPerApp');
	    };
	    sharedService.broadcastTasks = function() {
	        $rootScope.$broadcast('broadcastToTasks');
	    };
	
	    return sharedService;
	})
	
	.factory('projects', function($http, $rootScope, $routeParams) {
		var current, factory = {
           query: function () {
        	   $http.get('service/project/' + $routeParams.appId).then(function(result) {
	   				//resolve the promise as the data
        		   $rootScope.projects = result.data;
	   		    	current = result.data;
	   		    });  
            },
            getList: function () {                
               return current;
            }
		};       
		return factory; 
	})

	.config(function($routeProvider) {
		$routeProvider
	
		// route for the projects page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'mainController'
		})

		// route for the projects page
		.when('/projects/:appId', {
			templateUrl : 'pages/projects.html',
			controller  : 'projectsController'
		})

		// route for the team page
		.when('/team/:appId', {
			templateUrl : 'pages/team.html',
			controller  : 'teamController'
		})

		// route for the report page
		.when('/report/:appId', {
			templateUrl : 'pages/report.html',
			controller  : 'reportController'
		})
		
		// route for the mytasks page
		.when('/mytasks', {
			templateUrl : 'pages/mytasks.html',
			controller  : 'mytasksController'
		})
	
		// route for the tracker page
		.when('/tracker/:appId', {
			templateUrl : 'pages/tracker.html',
			controller  : 'trackerController'
		});
	})
	
	.controller('appController', function($scope, $http, mySharedService) {
		$scope.changeApp = function(appId, appName) {
			$scope.appId = appId;
			$scope.selectedApp = appName;
			mySharedService.prepForBroadcast(appId);
		};
		// Gets application list and populates them
		$http.get('service/application')
		.then(function(result) {
			//resolve the promise as the data
			$scope.applications = result.data;
			$scope.selectedApp = $scope.applications[0].appName;
			$scope.appId = $scope.applications[0].appId;
		});
	})
	
	.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	})
	
	.controller('projectsController', function($scope, $http, $routeParams, mySharedService, projects) {
		$scope.$on('changeAsPerApp', function() {
			window.location = '#/projects/' + mySharedService.appId;
	    });
		$scope.today = function() {
			$scope.startdate = new Date();
	        $scope.enddate = new Date();
		};
		$scope.today();

		$scope.getProjectIndex = function(projectId) {
			var index = '';
			for(var i = 0; i < $scope.projects.length; i++) {
				if($scope.projects[i].projectId === projectId) {
					index = i;
					break;
				}
			}
			return index;
		};
		$scope.submit = function() {
			$http({
				method: 'POST', 
				url: 'service/project/create',
				data: {
					appId: $routeParams.appId,
					projectName: $scope.projectName,
					projectDesciption: $scope.projectDesc,
					startDate: $scope.startdate,
					endDate: $scope.enddate,
					status: 1
				}
			}).success(function(data, status, headers, config) {
		      // this callback will be called asynchronously
		      // when the response is available
				$scope.projects.push(data);
				$('#cancelProject').trigger('click');
		    }).error(function(data, status, headers, config) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
		};
		//	Updates the project
		$scope.editProject = function(projectId) {
			var projectIndex = $scope.getProjectIndex(projectId);
			$http({
				method: 'PUT', 
				url: 'service/project/update',
				data: $scope.projects[projectIndex]
			}).success(function(data, status, headers, config) {
		      // this callback will be called asynchronously
		      // when the response is available
				$scope.projects[projectIndex] = data;
		    }).error(function(data, status, headers, config) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
		};
		
		//	sets id of project that is to be deleted
		$scope.deleteModal = function(projectId) {
			$scope.projectToDeleteId = projectId;
		};
		
		//	deletes the project
		$scope.deleteProject = function() {
			$http({
				method: 'DELETE', 
				url: 'service/project/remove/' + $scope.projectToDeleteId
			}).success(function(data, status, headers, config) {
		      // this callback will be called asynchronously
		      // when the response is available
				$scope.projects.splice($scope.getProjectIndex($scope.projectToDeleteId), 1);
				//$scope.projects = $scope.projects.splice($scope.projectToDeleteId, 1);
				$('#cancelDelete').trigger('click');
		    }).error(function(data, status, headers, config) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
		};
		$scope.fetchProjects = function() {
			//	Fetches projects and populates
			projects.query();
		};
		$scope.fetchProjects();
		
		$scope.viewTasks = function(project) {
			$scope.projectName = project.projectName;
			mySharedService.prepForBroadcastTasks(project);
			
		};
	})
	
	.controller('tasksController', function($scope, $http, mySharedService) {
		$scope.$on('broadcastToTasks', function() {
			$scope.fetchTasks();
	    });
		$scope.fetchTasks = function() {
			$http({
				url: 'service/task/' + mySharedService.project.projectId
			}).success(function(data, status, headers, config) {
		      // this callback will be called asynchronously
		      // when the response is available
				console.log(data);
		    }).error(function(data, status, headers, config) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
		};
	})
	
	.controller('teamController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
		initTree();
	})
	
	.controller('reportController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	})
	
	.controller('trackerController', function($scope, mySharedService, projects) {
		$scope.$on('changeAsPerApp', function() {
			window.location = '#/tracker/' + mySharedService.appId;
	    });
		
		$scope.fetchProjects = function() {
			//	Fetches projects and populates
			projects.query();
		};
		$scope.fetchProjects();
	})
	
	.controller('mytasksController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
});

	
$().ready(function() {
	var rightNavList = $('.rightnav ul li');
	rightNavList.bind('click', function(e) {
		rightNavList.removeAttr('class');
		$(e.currentTarget).addClass('active');
		//window.location = $(e.currentTarget).data('route'); 
	});
	$("#applicationSelection ul li").click(function(e) {
		$('.selectedApp').text($(e.target).text());
	});
	
	//$('input.datefield').datepicker();
	

	$('.main').on('click', '#projects ul li.viewTasks', function(e) {
		e.stopPropagation();
		$('#viewTasks').modal();
	});
	
	$('#projects ul li.deleteProject').click(function(e) {
		e.stopPropagation();
		$('#deleteProject').modal();
	});
	
	//$('#projects tbody tr').tooltip();
	
	$('#tasklist').on('click', '.btn[data-slide=#createTask]', function() {
		$('#createTask').slideDown();
		$('#tasklist .disable').width($('#tasklist').width()).height($('#tasklist').height());
		$('#updateTask').addClass('disabled');
	});
	
	$('#skilllist').on('click', '.btn[data-slide=#addSkillset]', function() {
		$('#addSkillset').slideDown();
		$('#skilllist .disable').width($('#skilllist').width()).height($('#skilllist').height());
	});
	
	$('#cancelTask').click(function() {
		$('#createTask').slideUp();
		$('#tasklist .disable').removeAttr('style');
		$('#updateTask').removeClass('disabled');
	});
	
	$('#cancelSkill').click(function() {
		$('#addSkillset').slideUp();
		$('#skilllist .disable').removeAttr('style');
	});
	
	$('#mytasks .statusSlider').slider().on('slide', function(e){
		if(e.value === 100) {
			$(e.currentTarget).parents('tr').find('.oncomplete').show().focus();
		} else {
			$(e.currentTarget).parents('tr').find('.oncomplete').hide();
		}
	});
	$('.statusSlider').slider().on('slide', function(e){
		$(e.currentTarget).parent().parent().next().html(e.value + '%');
	});
	
	$('.assignTask').click(function(e) {
		var top = $(e.currentTarget).position().top;
		$('#tasklist').animate({width: "50%"}, 500, function() { 
			$('#allocate').animate({
				opacity: "show",
				top: (top-65) + 'px'
			}, "slow" );
		});
	});
	
	$('.cancelAllocation').click(function(e) {
		$('#allocate').animate({ opacity: "hide" }, 500, function() { 
			$('#tasklist').animate({width: "100%"}, "slow" );
		});
	});
	
	$('#mytasklist tr, #tasklist tr').click(function(e) {
		$(this).find('a').removeClass('glyphicon-floppy-save');
		$(this).find('.noneditable').show();
		$(this).find('.editable').hide();
	});
	
	$('.editTask').click(function(e) {
		e.stopPropagation();
		$(this).find('a').addClass('glyphicon-floppy-save');
		$(this).parents('tr').find('.noneditable').hide();
		$(this).parents('tr').find('.editable').show();
	});
	
	
	
	$('#selectResource').change(function() {
		$('#dateSelection').slideDown();
	});
	$('#dateRange').daterangepicker().on('apply.daterangepicker', function(ev, picker) {
		$('#allocationPercentage').show();
		$('#checkAvailability').show().jqChart({
			title: { text: 'Vijay\'s Allocation' },
			animation: { duration: 1 },
			shadows: {
				enabled: true
			},
			legend: {
				visible: false
			},
			series: [
				{
					type: 'gantt',
					fillStyles: ['#CA6B4B', '#005CDB', '#F3D288', '#506381', '#F1B9A8'],
					data: [
						['PBO', new Date(2014, 5, 1), new Date(2014, 5, 25)],
						['Mainframe', new Date(2014, 5, 10), new Date(2014, 5, 29)],
						['Web service', new Date(2014, 5, 5), new Date(2014, 5, 20)],
						['Wireless', new Date(2014, 5, 20), new Date(2014, 5, 22)]
					]
				}
			]
		});
	});
});
function initTree() {
	$('.easy-tree').EasyTree({
		selectable: true,
		deletable: false,
		editable: false,
		addable: false,
		i18n: {
			
		}
	});
	$('.easy-tree li > span a').click(function(e) {
		$('#viewResource').slideDown();
	});
}
