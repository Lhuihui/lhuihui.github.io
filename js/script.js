$(document).ready(function() {

  function scrollTo($element) {
    $('html, body').animate({ scrollTop: $($element).height() }, 1000);
  }

  function squarify(DOMElement) {
    var width = $(DOMElement)[0].getBoundingClientRect().width;
    $(DOMElement).css('height', width + 'px');
  }

  function updateSquares() {
    $('.js-square').each(function() {
      squarify(this);
    });
  }

  $(window).resize(function() {
    updateSquares();
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
