$(document).ready(function() {

  function scrollTo($element) {
    $('html, body').animate({ scrollTop: $($element).height() }, 1000);
  }

  function squarify(DOMElement) {
    var width = $(DOMElement)[0].getBoundingClientRect().width;
    $(DOMElement).css('height', width + 'px');
  }

  function rectanglify(DOMElement) {
    var width = $(DOMElement)[0].getBoundingClientRect().width;
    $(DOMElement).css('height', width / 2 + 'px');
  }

  function updateSquares() {
    $('.js-square').each(function() {
      squarify(this);
    });
  }

  function updateRectangles() {
    $('.js-rectangle').each(function() {
      rectanglify(this);
    });
  }

  $(window).resize(function() {
    updateSquares();
    updateRectangles();
  });

  $(document).on('click', '.js-menu', function() {
    $(this).toggleClass('js-menu-show');
  });

  $(document).on('click', '.js-resume', function(event) {
    event.stopPropagation();
    scrollTo($('#resume'));
  })

  updateSquares();
});
