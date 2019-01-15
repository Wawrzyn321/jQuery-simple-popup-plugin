QUnit.module('Callback tests', function() {

    QUnit.test('Calling OnHidden callbacks', function(assert) {
        assert.expect(1);

        const done = assert.async(1);
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');
        const popup = $('#popup');

        popup.popup({
            popupOnClosed: function() {
                assert.ok(true, 'On closed callback called');
                done();
            }
        });

        popup[0].showPopup(invoker);
        popup[0].closePopup();
    });
});
