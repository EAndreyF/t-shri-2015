window.onload = function() {
  var el = document.querySelector('.avia-fixed');
  if (!window.getComputedStyle(el).position.match('sticky')) {
    var offsetTop = el.offsetParent.offsetTop;
    window.addEventListener('scroll', function () {
      if (document.body.scrollTop > offsetTop) {
        el.classList.add('avia-fixed_unsupported');
      } else {
        el.classList.remove('avia-fixed_unsupported');
      }
    });
  }
};