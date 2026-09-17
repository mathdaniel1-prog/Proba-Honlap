(function () {
  var forms = document.querySelectorAll('[data-quick-mail-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var mailTo = form.getAttribute('data-mail-to');
      var firstName = form.elements.firstName.value.trim();
      var lastName = form.elements.lastName.value.trim();
      var name = [lastName, firstName].filter(Boolean).join(' ');
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var subject = 'Lorem ipsum - ' + name;
      var body = ['Lorem ipsum: ' + name, 'Lorem ipsum: ' + email, '', 'Lorem ipsum:', message].join('\n');

      window.location.href = 'mailto:' + mailTo + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  });
})();

(function () {
  var buttons = document.querySelectorAll('[data-copy-email]');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var email = button.getAttribute('data-copy-email');
      if (!email || !navigator.clipboard) return;
      navigator.clipboard.writeText(email).then(function () {
        button.classList.add('is-copied');
        button.setAttribute('aria-label', 'Lorem ipsum');
      });
    });
  });
})();

(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var thresholdPx = 114;

  function syncHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY >= thresholdPx);
  }

  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });
})();

(function () {
  var overlay = document.querySelector('.printing-image-fade-overlay');
  if (!overlay) return;

  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      overlay.classList.add('is-faded');
    });
  });
})();

(function () {
  var triggers = document.querySelectorAll('[data-reveal-target]');

  triggers.forEach(function (trigger) {
    var targetId = trigger.getAttribute('data-reveal-target');
    var reveal = document.getElementById(targetId);
    if (!reveal) return;

    function toggleReveal() {
      var isOpen = reveal.classList.contains('is-open');

      triggers.forEach(function (otherTrigger) {
        var otherReveal = document.getElementById(otherTrigger.getAttribute('data-reveal-target'));
        if (!otherReveal) return;
        otherReveal.classList.remove('is-open');
        otherReveal.setAttribute('aria-hidden', 'true');
        otherTrigger.classList.remove('is-expanded');
      });

      reveal.classList.toggle('is-open', !isOpen);
      reveal.setAttribute('aria-hidden', String(isOpen));
      trigger.classList.toggle('is-expanded', !isOpen);
    }

    trigger.addEventListener('click', toggleReveal);
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleReveal();
      }
    });
  });
})();

(function () {
  var cards = document.querySelectorAll('.printing-feature-card-wide-rounded--scroll-reveal');
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (card) {
      card.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  cards.forEach(function (card) {
    observer.observe(card);
  });
})();

(function () {
  var images = document.querySelectorAll('.printing-feature-card-image--scroll-fade');
  if (!images.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    images.forEach(function (image) {
      image.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  images.forEach(function (image) {
    observer.observe(image);
  });
})();

(function () {
  var frame = document.querySelector('.printing-process-cards-frame');
  var squares = document.querySelectorAll('.printing-process-square, .printing-marker-pattern--second, .printing-marker-pattern--fourth, .printing-marker-pattern--fifth');
  var arrows = document.querySelector('.printing-process-arrows');
  if (!frame || !squares.length || !arrows) return;

  var leftSquare = frame.querySelector('.printing-process-square--left');
  var targetSquares = [
    frame.querySelector('.printing-process-square--right-top'),
    frame.querySelector('.printing-process-square--right-middle'),
    frame.querySelector('.printing-process-square--right-bottom')
  ];
  var arrowLines = [
    arrows.querySelector('[data-arrow="top"]'),
    arrows.querySelector('[data-arrow="middle"]'),
    arrows.querySelector('[data-arrow="bottom"]')
  ];

  function updateArrows() {
    var frameRect = frame.getBoundingClientRect();
    arrows.setAttribute('viewBox', '0 0 ' + frameRect.width + ' ' + frameRect.height);
    var leftRect = leftSquare.getBoundingClientRect();
    var startX = leftRect.right - frameRect.left;
    var startY = leftRect.top + leftRect.height / 2 - frameRect.top;

    targetSquares.forEach(function (targetSquare, index) {
      var targetRect = targetSquare.getBoundingClientRect();
      arrowLines[index].setAttribute('x1', startX);
      arrowLines[index].setAttribute('y1', startY);
      arrowLines[index].setAttribute('x2', targetRect.left - frameRect.left);
      arrowLines[index].setAttribute('y2', targetRect.top + targetRect.height / 2 - frameRect.top);
    });
  }

  var gridStep = 70;

  squares.forEach(function (square) {
    var dragStartX = 0;
    var dragStartY = 0;
    var dragOriginX = 0;
    var dragOriginY = 0;
    var offsetX = 0;
    var offsetY = 0;
    var isMirrored = square.classList.contains('printing-marker-pattern--fifth');

    function applyPosition() {
      square.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)' + (isMirrored ? ' scaleX(-1)' : '');
      updateArrows();
    }

    square.addEventListener('pointerdown', function (event) {
      event.preventDefault();
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragOriginX = offsetX;
      dragOriginY = offsetY;
      square.classList.add('is-dragging');
      square.setPointerCapture(event.pointerId);
    });

    square.addEventListener('pointermove', function (event) {
      if (!square.hasPointerCapture(event.pointerId)) return;

      offsetX = dragOriginX + event.clientX - dragStartX;
      offsetY = dragOriginY + event.clientY - dragStartY;
      applyPosition();
    });

    function finishDrag(event) {
      if (square.hasPointerCapture(event.pointerId)) {
        square.releasePointerCapture(event.pointerId);
      }
      offsetX = Math.round(offsetX / gridStep) * gridStep;
      offsetY = Math.round(offsetY / gridStep) * gridStep;
      applyPosition();
      square.classList.remove('is-dragging');
    }

    square.addEventListener('pointerup', finishDrag);
    square.addEventListener('pointercancel', finishDrag);

    square.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowUp') {
        offsetY -= gridStep;
      } else if (event.key === 'ArrowDown') {
        offsetY += gridStep;
      } else if (event.key === 'ArrowLeft') {
        offsetX -= gridStep;
      } else if (event.key === 'ArrowRight') {
        offsetX += gridStep;
      } else {
        return;
      }

      event.preventDefault();
      applyPosition();
    });
  });

  updateArrows();
  window.addEventListener('resize', updateArrows);
  window.addEventListener('scroll', updateArrows, { passive: true });
})();
