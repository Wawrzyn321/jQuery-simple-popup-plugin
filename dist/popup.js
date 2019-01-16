/*jshint esversion: 6 */
/**
 * jQuery simple popup plugin 1.0.0
 * by Wawrzyn
 */

(function($, window, document) {

    "use strict";

    jQuery.popup = {

        //available values
        popupValues: {
            sides: ['right', 'left'],
            placements: ['absolute-on-item', 'fixed-bottom', 'fixed-middle'],
            animations: ['slide', 'fade', 'none'],
            //add defaults in case $.fx is not defined
            animationSpeeds: jQuery.fx ? jQuery.fx.speeds :
            {
                '_default': 400, 
                'fast': 200,
                'slow': 600 
            }
        },

        //default values
        popupDefaults: {
            popupSide: 'right',
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

        Number.isNaN = Number.isNaN || isNaN;
    }

    //extract placementMode and CSS position from popupPlacement variable
    function getPlacementData(options) {

        const availableValues = jQuery.popup.popupValues;

        if (availableValues.placements.indexOf(options.popupPlacement) === -1) {
            throw new Error('popup: unrecognized placement: ' + options.popupPlacement);
        }

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
        }
    }

    //add popup data to DOM popup element
    function assignPopupData($popup, options) {
        const placement = getPlacementData(options);

        const availableValues = jQuery.popup.popupValues;

        //check side
        if (availableValues.sides.indexOf(options.popupSide) === -1) {
            throw new Error('popup: unrecognized popup side: '+ options.popupSide);
        }

        //check animation type
        if (availableValues.animations.indexOf(options.popupAnimation) === -1) {
            throw new Error('popup: unrecognized popup animation type: '+ options.popupAnimation);
        }
        
        //check animation speed
        const animationSpeed = parseFloat(options.popupAnimationSpeed);
        if (Number.isNaN(animationSpeed)) {
            if (availableValues.animationSpeeds[options.popupAnimationSpeed] === undefined) {
                throw new Error('popup: unrecognized popup animation speed: '+ options.popupAnimationSpeed);
            }
        }

        $popup[0].popupData = $.extend(placement, options);
    }

    //popup enter animation
    //animation starts with already visible popup
    function animateEnter($popup, callback) {
        const animationType = $popup[0].popupData.popupAnimation;
        const animationSpeed = $popup[0].popupData.popupAnimationSpeed;

        if (animationType === 'fade') {
            $popup.close().fadeIn(animationSpeed, callback); //hide and fade
        }
        else if (animationType === 'slide') {
            //move popup out of the screen and slide it in
            const popupSide = $popup[0].popupData.popupSide;

            if (popupSide === 'left') {
                $popup.css('left', -$popup.width())
                        .animate({left: '0'}, animationSpeed, callback);
            }
            else {
                $popup.css('right', -$popup.width())
                        .animate({right: '0'}, animationSpeed, callback);
            }
        }
        //do nothing if animation type is 'none' as popup is already visible
        else {
            if(callback) {
                callback();
            }
        }
    }
    
    //popup exit animation
    function animateExit($popup, animationCompletedCallback) {
        const animationType = $popup[0].popupData.popupAnimation;
        const animationSpeed = $popup[0].popupData.popupAnimationSpeed;

        if (animationType === 'fade') {
            $popup.fadeOut(animationSpeed, animationCompletedCallback);
        }
        else if (animationType === 'slide') {
            const popupSide = $popup[0].popupData.popupSide;

            if (popupSide === 'left') {
                $popup.animate({ left:-$popup.width() }, animationSpeed, animationCompletedCallback);
            }
            else {
                $popup.animate({ right:-$popup.width() }, animationSpeed, animationCompletedCallback);
            }
        }
        else {
            animationCompletedCallback();
        }
    }

    //return a pair of CSS position value (fixed or absolute) and top coordinate
    function getVerticalPosition ($popup) {
        const position = $popup[0].popupData.position;
        const placementMode = $popup[0].popupData.placementMode;

        const popupHeight = $popup.outerHeight(true);
        const scrollAmount = $(window).scrollTop();
        const viewportHeight = $(window).height();

        if (position === 'absolute') {
            /*on-item*/

            const $anchor = $popup[0].popupData.$anchor;

            //check if anchor has been set
            if (!$anchor || $anchor[0] === undefined) {
                throw new Error('getVerticalPosition: $anchor is not set!');
            }

            //variables used for centering
            const anchorBBox = $anchor[0].getBoundingClientRect();
            const anchorHeight = anchorBBox.height;
            const anchorY = anchorBBox.y;

            const top = scrollAmount + anchorY + anchorHeight / 2 - popupHeight / 2;
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

        if (side === 'left') {
            return {left: 0, right: 'auto'};
        }
        else {
            return {left: 'auto', right: 0};
        }
    }

    //get position, left and top and assign them
    function updatePopupPosition($popup) {
        const { position, top } = getVerticalPosition($popup);
        const { left, right} = getHorizontalPosition($popup);

        $popup.css({
            'position': position,
            'top': top,
            'left': left,
            'right': right
        });
    }

    function initPopup($popup, options) {
        //merge options and add defaults
        options = $.extend({}, jQuery.popup.popupDefaults, $popup.data(), options);

        //bind popup data to popup
        assignPopupData($popup, options);

        //public function - show popup
        $popup[0].showPopup = function(callback) {
            if ($popup[0].isShown()){
                return;
            }

            $popup.addClass('popup-visible');
            updatePopupPosition($popup);
            animateEnter($popup, callback);
        };

        //public function - close popup
        $popup[0].closePopup = function(callback) {
            if ($popup[0].isShown() === false){
                return;
            }

            animateExit($popup, function() {
                //actually remove active class after animations finished
                $popup.removeClass('popup-visible');

                //perform custom callback
                if (callback) {
                    callback();
                }
            });
        };
        
        //public function - check if popup is active
        $popup[0].isShown = function() {
            return $popup.hasClass('popup-visible');
        };
    }

    jQuery.fn.popup = function (options) {
        this.each(function() {
            initPopup($(this), options);
        });
        return this; //return for chaining
    };
    
    $(function(){
        initialize();
    });

})(jQuery, window, document);
