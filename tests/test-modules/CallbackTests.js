QUnit.module('Callback tests', function() {

    QUnit.test('Calling show callback', function(assert) {
        assert.expect(1);
        const done = assert.async(1);

        const popup = $('#popup');
        popup.popup({
            popupPlacement: 'fixed-middle'
        });
        
        popup[0].showPopup(function() {
            assert.ok(true, 'On show callback called');
            done();
        });
    });
    
    QUnit.test('Calling close callback', function(assert) {
        assert.expect(1);
        const done = assert.async(1);

        const popup = $('#popup');
        popup.popup({
            popupPlacement: 'fixed-middle'
        })[0].showPopup();
        
        popup[0].closePopup(function() {
            assert.ok(true, 'On close callback called');
            done();
        });
    });

});
