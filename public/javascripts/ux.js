var ux = (function($) {
  
  
  $(document, window).on("click", function(evt) {
    if ($(".nav-block").hasClass("open")) {
        console.log("Stäng den jävla menyn");
      }
  });

  var openCloseMenu = function() {
    $("#header-small .navbar-open, .nav-block").toggleClass("open");
  };
  
  var handleEvents = function() {
      var events  = $(".yoga-event"); 
      var width   = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      var eventsToHide;
      
      if (width < 768) {
        eventsToHide = events.length - 1;
      } else if (width < 992) {
        eventsToHide = events.length - 2;
      } else {
        eventsToHide = events.length - 3;
      }
  };
  
  return {
    handleEvents: handleEvents,
    openCloseMenu: openCloseMenu
  };
  

})(jQuery);
