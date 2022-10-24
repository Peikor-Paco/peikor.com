$(document).ready(function() {
  $(".js-nav_button").click(function() {
    $("body").toggleClass("nav-open modal-open");
  });

const el = document.querySelectorAll("img");
const observer = lozad(el); // passing a `NodeList` (e.g. `document.querySelectorAll()`) is also valid
observer.observe();
});

