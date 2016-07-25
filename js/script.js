$(document).ready(function() {

  var HeightCalculator = function() {
    if(window.innerWidth < 640 || document.documentElement.clientWidth < 640){
      if(window.innerWidth < document.documentElement.clientWidth)
        var height_100 = window.innerWidth;
      else
        var height_100 = document.documentElement.clientWidth;
      var height_50 = height_100 / 2;
      var height_25 = height_100 / 4;
    }
    else{
      var height_100 = $('._app--container').css('height');
      var height_50 = height_100 / 2;
      var height_25 = height_100 / 4;
    }

    function updateWidths() {
      if(window.innerWidth < 640 || document.documentElement.clientWidth < 640){
        if(window.innerWidth < document.documentElement.clientWidth)
          var height_100 = window.innerWidth;
        else
          var height_100 = document.documentElement.clientWidth;
        var height_50 = height_100 / 2;
        var height_25 = height_100 / 4;
      }
      else{
        var height_100 = $('._app--container').css('height');
        var height_50 = height_100 / 2;
        var height_25 = height_100 / 4;
      }

    }

    function getHeight(num) {
      switch (num) {
        case 100:
          return height_100;
          break;
        case 50:
          return height_50;
          break;
        case 25:
          return height_25;
          break;
      }
    }

    return {
      getHeight: getHeight,
      updateWidths: updateWidths
    }
  }

  function scrollTo($element) {
    $('html, body').animate({ scrollTop: $($element).height() }, 1000);
  }

  // function squarify(DOMElement) {
  //   var width = $(DOMElement)[0].getBoundingClientRect().width;
  //   $(DOMElement).css('height', width + 'px');
  // }
  //
  // function rectanglify(DOMElement) {
  //   var width = $(DOMElement)[0].getBoundingClientRect().width;
  //   $(DOMElement).css('height', width / 2 + 'px');
  // }
  //
  // function updateSquares() {
  //   $('.js-square').each(function() {
  //     squarify(this);
  //   });
  // }
  //
  // function updateRectangles() {
  //   $('.js-rectangle').each(function() {
  //     rectanglify(this);
  //   });
  // }

  var heights = new HeightCalculator();

  function rectanglify(DOMElement, height) {
    if(window.innerWidth < 640){
      $(DOMElement).css('height', '100%');
      $(DOMElement).css('min-height', 'auto');
    }
    else
      $(DOMElement).css('height', height + 'px');
  }

  function updateRectangles(className) {
    $(className).each(function() {
      var height = 0;
      switch (className) {
        case '.js-tile_25':
          height = heights.getHeight(25);
          break;
        case '.js-tile_50':
          height = heights.getHeight(50);
          break;
        case '.js-tile_100':
          height = heights.getHeight(100);
          break;
      }
      rectanglify(this, height);
    });
  }

  $(window).resize(function() {
    heights.updateWidths();
    updateRectangles('.js-tile_25');
    updateRectangles('.js-tile_50');
    updateRectangles('.js-tile_100');
  });

  $(document).on('click', '.js-menu', function() {
    $(this).toggleClass('js-menu-show');
  });

  $(document).on('click', '.js-resume', function(event) {
    event.stopPropagation();
    scrollTo($('#resume'));
  });

  heights.updateWidths();
  updateRectangles('.js-tile_25');
  updateRectangles('.js-tile_50');
  updateRectangles('.js-tile_100');
});
