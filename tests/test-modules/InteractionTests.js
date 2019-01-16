QUnit.module('Interaction tests', function() {

    QUnit.test('Closing popup with button', function(assert) {
        assert.expect(1);

        const done = assert.async(1);
        const $popup = $('#popup-dismissible');

        $popup.popup({
            popupPlacement: 'fixed-middle'
        });

        $popup[0].showPopup(function() {
            assert.ok(true, 'On closed callback called');
            done();
        });
        $popup.find('.popup-close').trigger('click');
    });

    QUnit.test('Adding "popup-visible" class on show popup', function(assert) {
        const $popup = $('#popup');
        $popup.popup({
            popupPlacement: 'fixed-bottom'
        });
        
        $popup[0].showPopup();

        assert.ok($popup.hasClass('popup-visible'), 'Active popup have "popup-visible" class');
    });

    QUnit.test('Showing button on mouse over', function(assert) {
        const $anchor = $('<p>A</p>').appendTo('#qunit-fixture');
        const $popup = $('#popup');
        $popup.popup( {$anchor: $anchor} );
        $anchor.on('mouseover', function() { $popup[0].showPopup(); });

        $anchor.trigger('mouseover');
        
        assert.ok($popup[0].isShown(), 'Popup should be active and return true from isActive function');
    });
    
    QUnit.test('Closing button on mouse leave', function(assert) {
        const $anchor = $('<p>A</p>').appendTo('#qunit-fixture');
        const $popup = $('#popup');
        $popup.popup({
            popupAnimation: 'none', //disable animations
            $anchor: $anchor
        })[0].showPopup();
        $anchor.on('mouseleave', function() { $popup[0].closePopup(); });

        $anchor.trigger('mouseleave');

        assert.notOk($popup[0].isShown(), 'Popup\'s isActive should return false on inactive popup');
    });

});
