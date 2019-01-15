QUnit.module('Resolving popup placement tests', function () {

    QUnit.test('Resolving popupSide: left', function (assert) {

        const popup = $('#popup');
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');
        popup.popup({
            popupSide: 'left',
            popupAnimation: 'none'
        })[0].showPopup(invoker);

        const side = popup[0].popupData.popupSide;
        assert.equal(side, 'left', 'PopupSide should be set to left');

        const left = popup.css('left');
        assert.equal(left, '0px', 'left should be 0');

        //check only on phantomjs, because browsers tend to return pixel value instead of 'auto'
        if (window._phantom) {
            const right = popup.css('right');
            assert.equal(right, 'auto', 'right should be auto');
        }
    });

    QUnit.test('Resolving popupSide: right', function (assert) {

        const popup = $('#popup');
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');

        popup.popup({
            popupSide: 'right',
            popupAnimation: 'none'
        })[0].showPopup(invoker);

        //check only on phantomjs, because browsers tend to return pixel value instead of 'auto'
        if (window._phantom) {
            const left = popup.css('left');
            assert.equal(left, 'auto', 'left should be auto');
        }
        const right = popup.css('right');
        assert.equal(right, '0px', 'right should be 0');
    });

    QUnit.test('Resolving popupPlacement: absolute-on-item', function (assert) {

        const popup = $('#popup');
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');

        popup.popup({
            popupPlacement: 'absolute-on-item',
            popupAnimation: 'none' //skip animation
        })[0].showPopup(invoker);

        const position = popup.css('position');
        assert.equal(position, 'absolute', 'On placement "absolute-on-item", position should be absolute');
    });

    QUnit.test('Resolving popupPlacement: fixed-bottom', function (assert) {

        const popup = $('#popup');
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');

        popup.popup({
            popupPlacement: 'fixed-bottom',
            popupAnimation: 'none' //skip animation
        })[0].showPopup(invoker);

        const position = popup.css('position');
        assert.equal(position, 'fixed', 'On placement "fixed-bottom", position should be absolute');
    });

    QUnit.test('Resolving popupPlacement: fixed-middle', function (assert) {

        const popup = $('#popup');
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');

        popup.popup({
            popupPlacement: 'fixed-middle',
            popupAnimation: 'none' //skip animation
        })[0].showPopup(invoker);

        const position = popup.css('position');
        assert.equal(position, 'fixed', 'On placement "fixed-middle", position should be absolute');
    });

    QUnit.test('Resolving popupPlacement: default', function (assert) {

        const popup = $('#popup');
        const invoker = $('<p>A</p>').appendTo('#qunit-fixture');

        popup.popup({
            popupAnimation: 'none' //skip animation
        })[0].showPopup(invoker);

        const position = popup.css('position');
        assert.equal(position, 'absolute', 'With no placement given, position should be absolute-on-item');
    });

    QUnit.test('Throwing on no invoker', function (assert) {

        const popup = $('#popup');
        popup.popup();

        const act = function() { popup[0].showPopup(); };

        assert.throws(act, Error('getVerticalPosition: $lastInvoker is not set!'), 'getVerticalPosition should throw when invoker is not specified')
    });
});
