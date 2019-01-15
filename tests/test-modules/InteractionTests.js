QUnit.module('Interaction tests', function() {

    QUnit.test('Closing popup with button', function(assert) {
        assert.expect(1);

        const done = assert.async(1);
        const popup = $('#popup-dismissible');

        popup.popup({
            popupOnClosed: function() {
                assert.ok(true, 'On closed callback called');
                done();
            },
            popupPlacement: 'fixed-middle'
        });

        popup[0].showPopup();
        popup.find('.popup-close').trigger('click');
    });

    QUnit.test('Adding "popup-active" class on show popup', function(assert) {
        const popup = $('#popup');
        popup.popup({
            popupPlacement: 'fixed-bottom'
        });
        
        popup[0].showPopup();

        assert.ok(popup.hasClass('popup-visible'), 'Active popup have "popup-visible" class');
    });

    QUnit.test('Showing button on mouse over', function(assert) {
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');
        const popup = $('#popup');
        popup.popup();
        invoker.on('mouseover', function() { popup[0].showPopup(this); });

        invoker.trigger('mouseover');
        
        var a = popup[0].isShown();
        assert.ok(a, 'Popup should be active and return true from isActive function');
    });
    
    QUnit.test('Closing button on mouse leave', function(assert) {
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');
        const popup = $('#popup');
        popup.popup({
            popupAnimation: 'none' //disable animations
        })[0].showPopup(invoker);
        invoker.on('mouseleave', function() { popup[0].closePopup(); });

        invoker.trigger('mouseleave');

        assert.notOk(popup[0].isShown(), 'Popup\'s isActive should return false on inactive popup');
    });

});
