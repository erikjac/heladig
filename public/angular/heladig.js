var app = angular.module('heladig', []);

/* LAYOUT CONTROLLERS */

app.controller('headerSmallCtrl', function($scope) {
  $scope.toggleOpen = function() {
    ux.openCloseMenu();
  };
});

/* YOGA PAGE CONTROLLERS */
app.service('yogaData', function($http) {
  var days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
  var month = [ "Januari", "Fabruari", 
                "Mars", "April", 
                "Maj", "Juni",
                "Juli", "Augusti",
                "September", "Oktober", 
                "November", "December"];
  
  var courseData = [];

  function formatTime(date) {
    return date.getUTCHours() + ":" + date.getUTCMinutes();
  }

  function formatEventDate(date) {
    return days[date.getDay()] + " " + date.getDate() + " " + month[date.getMonth()];
  }
  
  function formatCourseDate(date) {
    return date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear();
  }
  
  function handleSuccess(res) {
    return (res.data);
  };

  function handleError(res) {
    return (res.data)
  };

  function getEvents(startDate, endDate, callback) {

    var request = $http({
        method: 'get',
        url: '/api/yoga/course/event/'+startDate.toISOString()+'/'+endDate.toISOString(),
        params: {
          action: 'get'
        }
    }).then(function(res) {
      var data = res.data;

      for (var i = 0; i < data.length; i++) {
        data[i].date      = formatEventDate(new Date(data[i].date));
        data[i].startTime = formatTime(new Date(data[i].startTime));
        data[i].endTime   = formatTime(new Date(data[i].endTime));
      }

      callback(data);
      return;
    });
  };

  function getCourses(callback) {

    if (courseData.length === 0) {

      var request = $http({
          method: 'get',
          url: '/api/yoga/course',
          params: {
            action: 'get'
          }
      }).then(function(res) {
        var data = res.data;

        for (var i = 0; i < data.length; i++) {
          data[i].startDate = formatCourseDate(new Date(data[i].startDate));
        }
        
        courseData = data;
        callback(data);
        return;
      });
    } else {
      callback(data);
      return;
    }

  };
  
  function addUserToEvent(eventid, user, callback) {
    
    var request = $http({
        method: 'POST',
        url: '/api/yoga/course/event/'+eventid+'/user',
        headers: {
          'Content-Type': 'application/json' 
        },
        data: user 
      }).then(function(res) {
        console.log(res);  
      });
    callback("done");
    return;
  };

  function addUserToCourse(user, callback) {

    var url = '/api/yoga/course/'+user.courseid+'/user';

    var request = $http({
        method: 'POST', 
        url: url, 
        headers: {
          'Content-Type': 'application/json'
        },
        data: user
    }).then(function(res) {
      console.log(res);
    });

    return;
  };

  return {
    getEvents:  getEvents,
    getCourses: getCourses,
    addUserToEvent: addUserToEvent,
    addUserToCourse: addUserToCourse
  };

});

app.directive('onFinishRender', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});

app.controller('eventListCtrl', function($scope, yogaData) {
  
  // After all events is loaded set up the ux
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    ux.handleEvents();
  });

  function loadEvents() {

    yogaData.getEvents(new Date(), new Date('2015-12-30'), function(events) {
        $scope.data = {events: events};
      });
  };
  
  loadEvents();
  
  $scope.registerEvent = function(user, event) {
    console.log(user);
    console.log(event._id);
    yogaData.addUserToEvent(event._id, user, function(data) {
      $scope.hideform = false;
    });
    console.log($scope.showform);
  }

});

app.controller('courseListCtrl', function($scope, yogaData) {

  function loadCourses() {

    yogaData.getCourses(function( courses ) {
      $scope.data = {courses: courses};
    });

  };

  loadCourses();

  $scope.registerCourse = function(user) {
     
    yogaData.addUserToCourse(user, function(data) {
      console.log(data);
    });

  };
  
});

