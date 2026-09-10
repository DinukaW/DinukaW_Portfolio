// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

$(document).ready(function() {
  AOS.init( {
    once: true // play each on-scroll animation only once, then leave it in place
  }); // initialize animate on scroll library

  // Switching qualification tabs changes page height, which leaves AOS trigger
  // points stale for sections below it (e.g. "Let's Connect"). Recalculate them
  // whenever a tab is shown so those animations still fire. Also keep the
  // aria-selected state in sync for screen readers.
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    $(e.target).attr('aria-selected', 'true');
    if (e.relatedTarget) {
      $(e.relatedTarget).attr('aria-selected', 'false');
    }
    AOS.refresh();
  });

  // Keep the footer copyright year current.
  var year = document.getElementById('footer-year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Highlight the nav link for the section currently in view.
  $('body').scrollspy({ target: '#navigation', offset: 80 });
});

// Section offsets shift as fonts load and AOS elements settle - recalculate
// scroll-spy positions once everything has loaded.
$(window).on('load', function() {
  $('body').scrollspy('refresh');
});

// Smooth scroll for links with hashes
$('a.smooth-scroll')
.click(function(event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
    && 
    location.hostname == this.hostname
  ) {
    // Figure out element to scroll to
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function() {
        // Callback after animation
        // Must change focus!
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
          return false;
        } else {
          $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
          $target.focus(); // Set focus again
        };
      });
    }
  }
});
