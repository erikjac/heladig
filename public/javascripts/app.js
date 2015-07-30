(function() {
  
  /*
   * Opens the yogo event form
   * args = {id: string}
   */
  var openRegisterForm = function(args) {
    var id = args.id;
    var box = $('.yoga-event[data-id="' + id + '"]');
    var button = box.find('[type=button]');
    box.toggleClass("open"); 
    if (box.hasClass("open")) {
      button.html("Skicka anmälan");
    } else  {
      button.html("Anmäl Dig");
    }

  }

  /*
   * Grap all divs with type button and add eventlisteners to them
   */
  var activateButtons = function() {
    var buttons = $('div[type="button"]');
    buttons.each(function() {

      var button = $(this);
      var task = button.data("task");

      switch(task) {

        case "toggle-class":
          var targets = button.data("target").split(",");
          var tClass = button.data("class");
          for (var i = 0; i < targets.length; i++) {
            (function(target) {
              console.log(target);
              button.on("click", function() {
                $(target).toggleClass(tClass);
              });
  
            })(targets[i]);
          }
          break;
        case "custom":
          var args,
              func;
          try {
            args = button.data("args");
          } catch (e) {
            console.log(e);
            break;
          }

          func = button.data("function");
          if (func === "undefined") {
            break;
          }

          button.on("click", function() {
            eval(func);
          });
          break;

      }
    });
  };

  activateButtons();
}())
