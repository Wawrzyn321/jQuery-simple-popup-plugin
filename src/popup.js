
/*jshint esversion: 6 */

(function($, window, document) {

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
    };

    //global initialize
    function initialize() {

        //on resize, update each active popup position
        $(window).on('resize', function () {
            $('.popup-visible').each(function () {
                const $popup = $(this);
                updatePopupPosition($popup);
            });
        });

        //add global listener for popup invokers
        $(document).on('click', 'popup-link', function(e) {
            console.log(e.target);
        });

        Number.isNaN = Number.isNaN || isNaN;
    }

    //extract placementMode and CSS position from popupPlacement variable
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
                console.warn(`popup: unrecognized placement: "${options.popupPlacement}", defaulting to "absolute-on-item"`);
                return {
                    position: 'absolute',
                    placementMode: 'on-item'
                };
        }
    }

    //add popup data to DOM popup element
    function assignPopupData($popup, options) {
        const placement = getPlacementData(options);

        const availableValues = jQuery.popup.popupValues;

        //check side
        if (availableValues.sides.indexOf(options.popupSide) === -1) {
            console.warn(`popup: unrecognized side: "${options.popupSide}", defaulting to "${jQuery.popupDefaults.popupSide}"`);
            options.popupSide = jQuery.popupDefaults.popupSide;
        }

        //check animation type
        if (availableValues.animations.indexOf(options.popupAnimation) === -1) {
            console.warn(`popup: unrecognized animation type: "${options.popupAnimation}", defaulting to "${jQuery.popupDefaults.popupAnimation}"`);
            options.popupAnimation = jQuery.popupDefaults.popupAnimation;
        }
        
        //check animation speed
        const animationSpeed = parseFloat(options.popupAnimationSpeed);
        if (Number.isNaN(animationSpeed)) {
            if (availableValues.animationSpeeds[options.popupAnimationSpeed] === undefined) {
                console.warn(`popup: unrecognized animation speed: "${options.popupAnimationSpeed}", defaulting to "${jQuery.popupDefaults.popupAnimationSpeed}"`);
                options.popupAnimation = jQuery.popupDefaults.popupAnimationSpeed;
            }
        }

        $popup[0].popupData = $.extend(options, placement);
    }

    //initialize single popup events
    function initializeEvents($popup) {
        $popup.on('click', '.popup-close', function (e) {
            $popup[0].hidePopup();
        });
    }

    //popup enter animation
    //animation starts with already visible popup
    function animateEnter($popup) {
        const animationType = $popup[0].popupData.popupAnimation;
        const animationSpeed = $popup[0].popupData.popupAnimationSpeed;

        if (animationType === 'fade') {
            $popup.hide().fadeIn(animationSpeed); //hide and fade
        }
        else if (animationType === 'slide') {
            //move popup out of the screen and slide it in
            const popupSide = $popup[0].popupData.popupSide;

            if (popupSide === 'left') {
                $popup.css('left', -$popup.width())
                        .animate({left:'0'}, animationSpeed);
            }
            else {
                const currentLeft = $popup.css('left');
                $popup.css('left', currentLeft + $popup.width())
                        .animate({left:currentLeft}, animationSpeed);
            }
        }

        //do nothing if animation type is 'none' as popup is already visible
    }
    
    //popup exit animation
    function animateExit($popup, completeCallback) {
        const animationType = $popup[0].popupData.popupAnimation;
        const animationSpeed = $popup[0].popupData.popupAnimationSpeed;

        if (animationType === 'fade') {
            $popup.fadeOut(animationSpeed, completeCallback);
        }
        else if (animationType === 'slide') {
            const popupSide = $popup[0].popupData.popupSide;

            if (popupSide === 'left') {
                $popup.animate({ left:-$popup.width() }, animationSpeed, completeCallback);
            }
            else {
                const currentLeft = $popup.css('left');
                $popup.animate({ left:currentLeft + $popup.width() }, animationSpeed, completeCallback);
            }
        }
        else {
            //completeCallback takes care with actual deactivating the popup
            completeCallback();
        }
        
    }

    //return a pair of CSS position value (fixed or absolute) and top coordinate
    function getVerticalPosition ($popup) {
        const position = $popup[0].popupData.position;
        const placementMode = $popup[0].popupData.popupPlacement;

        const popupHeight = $popup.outerHeight(true);
        const scrollAmount = $(window).scrollTop();
        const viewportHeight = $(window).height();

        if (position === 'absolute') {
            /*on-item*/

            const $invokingElement = $popup[0].popupData.$lastInvoker;
            if (!$invokingElement) {
                console.warn('getVerticalPosition: $lastInvoker is null!');
                return { position, top: 0 };
            }
            //used for centering
            const invokerBBox = $invokingElement[0].getBoundingClientRect();
            const invokerHeight = invokerBBox.height;
            const invokerWidth = invokerBBox.y;

            const top = scrollAmount + invokerWidth + invokerHeight / 2 - popupHeight / 2;
            return { position, top };
        }
        else {
            if (placementMode == 'bottom') {
                const top = scrollAmount + viewportHeight - popupHeight;
                return { position, top };
            }
            else { /* middle */
                const top = scrollAmount + viewportHeight / 2 - popupHeight / 2;
                return { position, top };
            }
        }
    }

    //get left coordinate according to popupSide
    function getHorizontalPosition($popup) {
        const side = $popup[0].popupData.popupSide;

        if (side == 'left') {
            return 0;
        }
        else {
            const viewportWidth = $(window).width();
            const popupWidth = $popup.outerWidth();
            return viewportWidth - popupWidth;
        }
    }

    //get position, left and top and assign them
    function updatePopupPosition($popup) {
        const { position, top } = getVerticalPosition($popup);
        const left = getHorizontalPosition($popup);

        $popup.css({
            'position': position,
            'top': top,
            'left': left
        });
    }

    function initPopup($popup, options) {
        //merge options and add defaults
        options = $.extend({}, jQuery.popup.popupDefaults, $popup.data(), options);

        //bind popup data to popup
        assignPopupData($popup, options);

        //initialize events for popup
        initializeEvents($popup);


        //public function - show popup
        $popup[0].showPopup = function(invoker) {
            $popup.addClass('popup-visible');
            $.extend($popup[0].popupData, {$lastInvoker: $(invoker)});
            updatePopupPosition($popup);
            animateEnter($popup);
        };

        //public function - hide popup
        $popup[0].hidePopup = function() {
            animateExit($popup, function() {
                //common part after exit animation
                $popup.removeClass('popup-visible');

                //perform custom callback
                const customCallback = $popup[0].popupData.popupOnEnded;
                customCallback();
            });
        };

        if(options.show === 'true') {
            $popup[0].showPopup();
        }
    }

    jQuery.fn.popup = function (options) {
        this.each(function() {
            initPopup($(this), options);
        });
        return this; //return for chaining
    };
    
    //shorthand for $(popup)[0].showPopup
    jQuery.fn.showPopup = function (invoker) {
        this.each(function() {
            if ($(this).is('.popup-popup')) {
                this.showPopup(invoker);
            }
        });
        return this; //return for chaining
    };

    //shorthand for $(popup)[0].hidePopup
    jQuery.fn.hidePopup = function () {
        this.each(function() {
            if ($(this).is('.popup-popup')) {
                this.hidePopup();
            }
        });
        return this; //return for chaining
    };

    $(function(){
        initialize();
    });

})(jQuery, window, document);
