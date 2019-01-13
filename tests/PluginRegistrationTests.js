QUnit.module('Plugin registration tests', function() {

    QUnit.test('Contains correct defaults', function(assert) {
        const defaults =  {
            popupSide: 'right',
            popupOnEnded: $.noop,
            popupPlacement: 'absolute-on-item',
            popupAnimation: 'slide',
            popupAnimationSpeed: '_default'
        };

        assert.deepEqual($.popup.popupDefaults, defaults, 
            "Defaults specified should be the same as in plugin code");
    });

    QUnit.test('Contains correct available values', function(assert) {
        const availableValues = {
            sides: ['right', 'left'],
            placements: ['absolute-on-item', 'fixed-bottom', 'fixed-middle'],
            animations: ['slide', 'fade', 'none'],
            animationSpeeds: jQuery.fx.speeds
        };

        assert.deepEqual($.popup.popupValues, availableValues, 
            "Available values specified should be the same as in plugin code");
    });

    QUnit.test('Can change default values', function(assert) {
        
        //save default defaults:
        const defaults = jQuery.extend(true, {}, $.popup.popupDefaults);

        const defaultsToChange = {
            popupSide: 'left',
            popupAnimation: 'fade'
        };

        $.extend($.popup.popupDefaults, defaultsToChange);

        const targetCustomDefaults =  {
            popupSide: 'left',
            popupOnEnded: $.noop,
            popupPlacement: 'absolute-on-item',
            popupAnimation: 'fade',
            popupAnimationSpeed: '_default'
        };

        const newDefaults = $.popup.popupDefaults;

        //bring back previous defaults
        $.popup.popupDefaults = defaults;

        assert.deepEqual(newDefaults, targetCustomDefaults, 
            "Default variables can be changed");
    });

});