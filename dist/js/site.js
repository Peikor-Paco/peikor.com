$(document).ready(function() {
  $(".js-nav_button").click(function() {
    $("body").toggleClass("nav-open modal-open");
  });

  var observer = lozad(".lozad");
  observer.observe();
});