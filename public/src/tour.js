/*global angular */
/**
 * uiTour directive
 *
 * @example:
 *   <ul ui-tour="currentStep">
 *     <li target="#someId">
 *       First Tooltip
 *       <a ng-click="currentStep=currentStep+1">Next</a>
 *     </li>
 *     <li target=".items:eq(2)" name="two">
 *       Second Tooltip
 *       <a ng-click="currentStep=currentStep-1">Prev</a>
 *     </li>
 *     <li target=".items:eq(2)">
 *       Third Tooltip
 *       <a ng-click="currentStep='two'">Go directly to 'two'</a>
 *       <a ng-click="currentStep=0">Done</a>
 *     </li>
 *   </ul>
 */
angular.module('ui.tour', [

	'ui.router', 
"ngAnimate",
  'ui.bootstrap',

  'ngCookies'
  ])
// configuring our routes 
// =============================================================================
.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('home', {
            url: '/home',
      	  controller: 'formController',
		        templateUrl: 'form.html'

	
        })

        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('home.search', {
            url: '/search',
            templateUrl: 'form.html',
			controller:'formController'
		    })
			
			//
           .state('home.bar', {
            url: '/bar',
	controller:'formController',
            templateUrl: 'form-container.html'
		
		    })
        // url will be /form/Register
        .state('home.Register', {
            url: '/Register',
			 controller: 'Registerctrl',
            templateUrl: 'form-interests.html'
        })
        // url will be /form/payment
        .state('home.login', {
            url: '/login',
				 controller: 'loginCtrl',
            templateUrl: 'form-payment.html'
        })
            .state('home.stepone', {
            url: '/stepone',
				 controller: 'loginCtrl',
            templateUrl: 'form-payment.html'
        })
		  .state('about', {
            url: '/about',
				 controller: 'loginCtrl',
            templateUrl: 'about.html'
        });
       
    // catch all route
    // send users to the form page 

	   $urlRouterProvider.otherwise('/home/search');
	$locationProvider.hashPrefix('!');
	$locationProvider.html5Mode(true);
})

.directive('uiTour', ['$timeout', '$parse', function($timeout, $parse){
  return {
    link: function($scope, $element, $attributes) {
      var model = $parse($attributes.uiTour);

      // Watch model and change steps
      $scope.$watch($attributes.uiTour, function(newVal, oldVal){
        if (angular.isNumber(newVal)) {
          showStep(newVal)
        } else {
          if (angular.isString(newVal)) {
            var stepNumber = 0,
              children = $element.children()
            angular.forEach(children, function(step, index) {
              if (angular.element(step).attr('name') === newVal)
                stepNumber = index+1;
            });
            model.assign($scope, stepNumber);
          } else {
            model.assign($scope, newVal && 1 || 0);
          }
        }
      });

      // Show step
      function showStep(stepNumber) {
        var elm, at, children = $element.children().removeClass('active');
        elm = children.eq(stepNumber - 1);
        if (stepNumber && elm.length) {
          at = elm.attr('at');
          $timeout(function(){
            var target = angular.element(elm.attr('target'))[0];


            if (elm.attr('overlay') !== undefined) {
              $('.tour-overlay').addClass('active').css({
                marginLeft: target.offsetLeft + target.offsetWidth / 2 - 150,
                marginTop: target.offsetTop + target.offsetHeight / 2 - 150
              }).addClass('in');
            } else {
              $('.tour-overlay').removeClass('in');
              setTimeout(function(){
                $('.tour-overlay').removeClass('active');
              }, 1000);
            }
            offset = {};
            
            offset.top = target.offsetTop;
            offset.left = target.offsetLeft;

            elm.addClass('active');
              
            if (at.indexOf('bottom') > -1) {
              offset.top += target.offsetHeight;
            } else if (at.indexOf('top') > -1) {
              offset.top -= elm[0].offsetHeight;
            } else {
              offset.top += target.offsetHeight / 2 - elm[0].offsetHeight / 2;
            }
            if (at.indexOf('left') > -1) {
              offset.left -= elm[0].offsetWidth;
            } else if (at.indexOf('right') > -1) {
              offset.left += target.offsetWidth;
            } else {
              offset.left += target.offsetWidth / 2 - elm[0].offsetWidth / 2;
            }
            
            elm.css(offset);
          });
        } else {
          $('.tour-overlay').removeClass('in');
          setTimeout(function(){
            $('.tour-overlay').removeClass('active');
          }, 1000);
        }
      }
    }
  };
}])

// our controller for the form
// =============================================================================
.controller('formController', function formController($scope, $filter,$http,limitToFilter) {
		'use strict'
 
		
  $scope.cities = function(cityName) {
    return $http.get(" /gettypeofquestion/"+cityName).then(function(response){
	

      return limitToFilter(response.data, 6);

    });
	
  };
		
		

	
})

.controller('Registerctrl', function Registerctrl($scope,  $timeout,fileUpload) {
		'use strict'
    
    // we will store all of our form data in this object
  $scope.upload = function() {
    

        var uploadUrl = "/signup";
		var uploadUrltocloud = "https://api.cloudinary.com/v1_1/chameleon-techie/upload";
		
           var  name = $scope.name;
        var fields = [{"name": "email", "data": $scope.email}]; 
              var fields2 = [{"name": "fullname", "data": $scope.fullname}];    
				    var fields4 = [{"name": "password", "data": $scope.Password}]; 
					 
							 	 var fields8 = [{"name": "public_id", "data": $scope.name}]; 
        fileUpload.uploadFileAndFieldsToUrl(name, fields, fields2,fields4,fields8,uploadUrltocloud,uploadUrl);
		
    }
	
	


                 
		

	
})



.controller('swipecontroller', function swipecontroller ($scope) {

  $scope.list = [];

  for (var i = 1; i <= 10; i++) {
    $scope.list.push(i);
  }

  $scope.NavTo = function(i) {
    $scope.count = i;
  };

})
.service('fileUpload', function fileUpload ($http) {
   this.uploadFileAndFieldsToUrl = function(filee,name, fields, fields2,fields4,fields8,uploadUrltocloud,uploadUrl){
        var fd = new FormData();

         for(var i = 0; i < fields.length; i++){
            fd.append(fields[i].name, fields[i].data)
		
        }
		 for(var i1 = 0; i1 < fields2.length; i1++){
            fd.append(fields2[i1].name, fields2[i1].data)
		
        }
		
		 for(var i1 = 0; i1 < fields4.length; i1++){
            fd.append(fields4[i1].name, fields4[i1].data)
		
        } 

		 for(var i1 = 0; i1 < fields8.length; i1++){
            fd.append(fields8[i1].name, fields8[i1].data)
		
        }
		
		  
		  
 fd.append('path', filee);
			  fd.append('file', filee);
			   fd.append('upload_preset', 'sample_14dd082975d7aaf1247b277fc48c2e3092ad4456');
        $http.post("/signup", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
			window.location.href = 'http://schoolpun.com/form/profile';
        })
        .error(function(){
        });
		
	
	
    }
}).service('loginupload', function loginupload($http) {
   this.uploadloginFieldsToUrl = function(fields, fields4,uploadUrltocloud,uploadUrl){
        var fdf = new FormData();

         for(var i = 0; i < fields.length; i++){
            fdf.append(fields[i].name, fields[i].data)
		
        }

		 for(var i1 = 0; i1 < fields4.length; i1++){
            fdf.append(fields4[i1].name, fields4[i1].data)
		
        } 

	
        
		
		  
		  

        $http.post('/login', fdf, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
				var product_id = fields;
		
		window.location.href = 'http://schoolpun.com/';
		
  


        })
        .error(function(){
        });
		
    }
}).controller('loginCtrl', function loginCtrl ($scope,loginupload) {
    $scope.uploadlogin = function () {
    

	
        var uploadUrl = "/login";
		var uploadUrltocloud = "https://api.cloudinary.com/v1_1/chameleon-techie/upload";
		
        var fields = [{"name": "email", "data": $scope.email}]; 
      
				    var fields4 = [{"name": "password", "data": $scope.password}]; 
					 
					 
     loginupload.uploadloginFieldsToUrl(fields,fields4,uploadUrltocloud,uploadUrl);
		
    }
	
});
	
	<!-- -->
	
	/*
we adding the drop menu code here
it use anular animate
	*/
  var MainController = function($scope) {
  
    $scope.categories = [
     {category_type:"parent", category_name:"apples", category_show:true},
      {category_type:"child", category_name:"bramble", category_show:false},
      {category_type:"child", category_name:"granny smiths", category_show:false},
      {category_type:"child", category_name:"pink lady", category_show:false}];
        $scope.updateResults = function(clicked_category) {
      
      if(clicked_category.category_type == "parent")
      {
        $scope.categories[1].category_show = !$scope.categories[1].category_show;
        $scope.categories[2].category_show = !$scope.categories[2].category_show;
        $scope.categories[3].category_show = !$scope.categories[3].category_show;
      }
    };
	  $scope.selected = undefined;
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

 
  };

function tabsSwipeCtrlFn() {
    var responsive = this;
    responsive.ngIncludeTemplates = [{ index: 0, name: 'first', url: 'firstSwipe.html' }, { index: 1, name: 'second', url: 'secondSwipe.html' }, { index: 2, name: 'third', url: 'thirdSwipe.html' }, { index: 3, name: 'fourth', url: 'fourthSwipe.html' }];
    responsive.selectPage = selectPage;

    /**
    * Initialize with the first page opened
    */
    responsive.ngIncludeSelected = responsive.ngIncludeTemplates[0];

    /**
    * @name selectPage
    * @desc The function that includes the page of the indexSelected
    * @param indexSelected the index of the page to be included
    */
    function selectPage(indexSelected) {
        if (responsive.ngIncludeTemplates[indexSelected].index > responsive.ngIncludeSelected.index) {
            responsive.moveToLeft = false;
        } else {
            responsive.moveToLeft = true;
        }
        responsive.ngIncludeSelected = responsive.ngIncludeTemplates[indexSelected];
    }
}
  