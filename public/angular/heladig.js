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
  

  function hasError(res) {
    error = undefined;
    switch(res.status) {
      case 404:
        error = {status: 404};
        break;
    }
    return error;
  }
  function getEvents(startDate, endDate, callback) {

    var request = $http({
        method: 'get',
        url: '/api/yoga/course/event/'+startDate.toISOString()+'/'+endDate.toISOString(),
        params: {
          action: 'get'
        }
    }).then(function(res) {

      if (hasError(res)) {
        callback({"message": "error"}, res.data);
      } else  {
        callback(undefined, data);
      }

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

        if (hasError(res)) {
          callback({"message": "error"}, "done");
        } else  {
          callback(undefined, "done");
        }
      });
    return;
  };

  function addUserToCourse(user, callback) {

    var url = '/api/yoga/course/'+user.courseid+'/user/'+user.firstname +'/'+user.lastname+'/'+user.email ;

    var request = $http({
        method: 'GET', 
        url: url, 
        params: {
          action: 'get'
        }
    }).then(function(res) {

      if (hasError(res)) {
        callback({"message": "error"}, "done");
      } else {
        callback(undefined, "done"); 
      }
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

    var toDay = new Date();
    var endDate = new Date();

    // Get events from today and 2 weeks forward
    endDate.setDate(toDay.getDate() + 14);

    yogaData.getEvents(toDay, endDate, function(err, events) {
      if (err) {
        alert(err.message);
      } else {
        $scope.data = {events: events};
      }
      });
  };
  
  loadEvents();
  
  $scope.registerEvent = function(user, event) {
    var success = "Vi har tagit emot din anmälning, du kommer få ett mail som bekräftar den";

    this.showform = false;
    

    yogaData.addUserToEvent(event._id, user, function(err, data) {
      
      if (err) {
        alert(err.message);
      } else {
        alert(success);
      }

    });
    
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
    var success = "Tack du kommer få ett mail med en bekräftelse på din registering"; 
    
    yogaData.addUserToCourse(user, function(err, data) {

      if (err) {
        alert(err.message)
      } else {
        alert(success);
      }

    });

  };
  
});

