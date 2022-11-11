


$(".highlight-link").each(function(){
    if ( $(this).isOnScreenHighlight() ) {
          $(this).addClass('shown');
        } else {
          $(this).removeClass('shown');
    }
});

var jumboHeight = $('.jumbotron').outerHeight();

  $(window).scroll(function(){

    $(".highlight").each(function(){
    	    if ( $(this).isOnScreenHighlight() ) {
            $(this).addClass('shown');
    	        } else {
                  $(this).removeClass('shown');
    	    }
    });

    $(".highlight-link").each(function(){
          if ( $(this).isOnScreenHighlight() ) {
                  $(this).css("animation-delay","0s");
                  $(this).addClass('shown');
              } else {
                $(this).removeClass('shown');
          }
    });
  });

  $.fn.isOnScreenHighlight = function(){

    // var fix = parseInt($(".navbar").css("height"));
    var win = $(window);
  
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
  
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
  
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.bottom || viewport.top > bounds.bottom));
  
  };