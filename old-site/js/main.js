$(window).on("scroll touchmove", function () {
  $('#header').toggleClass('secondary', $(document).scrollTop() > 0);
});
