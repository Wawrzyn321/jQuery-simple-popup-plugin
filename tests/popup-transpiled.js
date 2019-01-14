"use strict";

/*jshint esversion: 6 */
(function ($, window, document) {
  "use strict";

  jQuery.popup = {
    //available values
    popupValues: {
      sides: ['right', 'left'],
      placements: ['absolute-on-item', 'fixed-bottom', 'fixed-middle'],
      animations: ['slide', 'fade', 'none'],
      animationSpeeds: jQuery.fx.speeds
    },
    //default values
    popupDefaults: {
      popupSide: 'right',
      popupOnEnded: $.noop,
      popupPlacement: 'absolute-on-item',
      popupAnimation: 'slide',
      popupAnimationSpeed: '_default'
    }
  }; //global initialize

  function initialize() {
    //on resize, update each active popup position
    $(window).on('resize', function () {
      $('.popup-visible').each(function () {
        var $popup = $(this);
        updatePopupPosition($popup);
      });
    }); //add global listener for popup invokers

    $(document).on('click', 'popup-link', function (e) {
      console.log(e.target);
    });
    Number.isNaN = Number.isNaN || isNaN;
  } //extract placementMode and CSS position from popupPlacement variable


  function getPlacementData(options) {
    switch (options.popupPlacement) {
      case 'absolute-on-item':
        return {
          position: 'absolute',
          placementMode: 'on-item'
        };

      case 'fixed-bottom':
        return {
          position: 'fixed',
          placementMode: 'bottom'
        };

      case 'fixed-middle':
        return {
          position: 'fixed',
          placementMode: 'middle'
        };

      default:
        console.warn("popup: unrecognized placement: \"".concat(options.popupPlacement, "\", defaulting to \"absolute-on-item\""));
        return {
          position: 'absolute',
          placementMode: 'on-item'
        };
    }
  } //add popup data to DOM popup element


  function assignPopupData($popup, options) {
    var placement = getPlacementData(options);
    var availableValues = jQuery.popup.popupValues; //check side

    if (availableValues.sides.indexOf(options.popupSide) === -1) {
      console.warn("popup: unrecognized side: \"".concat(options.popupSide, "\", defaulting to \"").concat(jQuery.popupDefaults.popupSide, "\""));
      options.popupSide = jQuery.popupDefaults.popupSide;
    } //check animation type


    if (availableValues.animations.indexOf(options.popupAnimation) === -1) {
      console.warn("popup: unrecognized animation type: \"".concat(options.popupAnimation, "\", defaulting to \"").concat(jQuery.popupDefaults.popupAnimation, "\""));
      options.popupAnimation = jQuery.popupDefaults.popupAnimation;
    } //check animation speed


    var animationSpeed = parseFloat(options.popupAnimationSpeed);

    if (Number.isNaN(animationSpeed)) {
      if (availableValues.animationSpeeds[options.popupAnimationSpeed] === undefined) {
        console.warn("popup: unrecognized animation speed: \"".concat(options.popupAnimationSpeed, "\", defaulting to \"").concat(jQuery.popupDefaults.popupAnimationSpeed, "\""));
        options.popupAnimation = jQuery.popupDefaults.popupAnimationSpeed;
      }
    }

    $popup[0].popupData = $.extend(options, placement);
  } //initialize single popup events


  function initializeEvents($popup) {
    $popup.on('click', '.popup-close', function (e) {
      $popup[0].hidePopup();
    });
  } //popup enter animation
  //animation starts with already visible popup


  function animateEnter($popup) {
    var animationType = $popup[0].popupData.popupAnimation;
    var animationSpeed = $popup[0].popupData.popupAnimationSpeed;

    if (animationType === 'fade') {
      $popup.hide().fadeIn(animationSpeed); //hide and fade
    } else if (animationType === 'slide') {
      //move popup out of the screen and slide it in
      var popupSide = $popup[0].popupData.popupSide;

      if (popupSide === 'left') {
        $popup.css('left', -$popup.width()).animate({
          left: '0'
        }, animationSpeed);
      } else {
        var currentLeft = $popup.css('left');
        $popup.css('left', currentLeft + $popup.width()).animate({
          left: currentLeft
        }, animationSpeed);
      }
    } //do nothing if animation type is 'none' as popup is already visible

  } //popup exit animation


  function animateExit($popup, completeCallback) {
    var animationType = $popup[0].popupData.popupAnimation;
    var animationSpeed = $popup[0].popupData.popupAnimationSpeed;

    if (animationType === 'fade') {
      $popup.fadeOut(animationSpeed, completeCallback);
    } else if (animationType === 'slide') {
      var popupSide = $popup[0].popupData.popupSide;

      if (popupSide === 'left') {
        $popup.animate({
          left: -$popup.width()
        }, animationSpeed, completeCallback);
      } else {
        var currentLeft = $popup.css('left');
        $popup.animate({
          left: currentLeft + $popup.width()
        }, animationSpeed, completeCallback);
      }
    } else {
      //completeCallback takes care with actual deactivating the popup
      completeCallback();
    }
  } //return a pair of CSS position value (fixed or absolute) and top coordinate


  function getVerticalPosition($popup) {
    var position = $popup[0].popupData.position;
    var placementMode = $popup[0].popupData.popupPlacement;
    var popupHeight = $popup.outerHeight(true);
    var scrollAmount = $(window).scrollTop();
    var viewportHeight = $(window).height();

    if (position === 'absolute') {
      /*on-item*/
      var $invokingElement = $popup[0].popupData.$lastInvoker; //check if invoker has been set

      if (!$invokingElement || $invokingElement[0] === undefined) {
        console.warn('getVerticalPosition: $lastInvoker is not set!');
        return {
          position: position,
          top: 0
        };
      } //used for centering


      var invokerBBox = $invokingElement[0].getBoundingClientRect();
      var invokerHeight = invokerBBox.height;
      var invokerY = invokerBBox.y;
      var top = scrollAmount + invokerY + invokerHeight / 2 - popupHeight / 2;
      return {
        position: position,
        top: top
      };
    } else {
      if (placementMode == 'bottom') {
        var _top = scrollAmount + viewportHeight - popupHeight;

        return {
          position: position,
          top: _top
        };
      } else {
        /* middle */
        var _top2 = scrollAmount + viewportHeight / 2 - popupHeight / 2;

        return {
          position: position,
          top: _top2
        };
      }
    }
  } //get left coordinate according to popupSide


  function getHorizontalPosition($popup) {
    var side = $popup[0].popupData.popupSide;

    if (side == 'left') {
      return {
        left: 0,
        right: 'auto'
      };
    } else {
      return {
        left: 'auto',
        right: 0
      };
    }
  } //get position, left and top and assign them


  function updatePopupPosition($popup) {
    var _getVerticalPosition = getVerticalPosition($popup),
        position = _getVerticalPosition.position,
        top = _getVerticalPosition.top;

    var _getHorizontalPositio = getHorizontalPosition($popup),
        left = _getHorizontalPositio.left,
        right = _getHorizontalPositio.right;

    $popup.css({
      'position': position,
      'top': top,
      'left': left,
      'right': right
    });
  }

  function initPopup($popup, options) {
    //merge options and add defaults
    options = $.extend({}, jQuery.popup.popupDefaults, $popup.data(), options); //bind popup data to popup

    assignPopupData($popup, options); //initialize events for popup

    initializeEvents($popup); //public function - show popup

    $popup[0].showPopup = function (invoker) {
      $popup.addClass('popup-visible');
      $popup[0].popupData.$lastInvoker = invoker.jquery ? invoker : $(invoker);
      updatePopupPosition($popup);
      animateEnter($popup);
    }; //public function - hide popup


    $popup[0].hidePopup = function () {
      animateExit($popup, function () {
        //common part after exit animation
        $popup.removeClass('popup-visible'); //perform custom callback

        var customCallback = $popup[0].popupData.popupOnEnded;
        customCallback();
      });
    };

    if (options.show === 'true') {
      $popup[0].showPopup();
    }
  }

  jQuery.fn.popup = function (options) {
    this.each(function () {
      initPopup($(this), options);
    });
    return this; //return for chaining
  };

  $(function () {
    initialize();
  });
})(jQuery, window, document);