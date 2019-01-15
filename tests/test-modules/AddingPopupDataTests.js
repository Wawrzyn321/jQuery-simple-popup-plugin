QUnit.module('Adding popup data tests', function () {

    QUnit.test('Adding popupData property', function (assert) {

        $('#popup').popup();

        assert.ok($('#popup')[0].popupData, 'PopupData should be added to popup');
    });

    QUnit.test('No invoker before invoking', function (assert) {

        $('#popup').popup();

        assert.equal(undefined, $('#popup')[0].popupData.lastInvoker,
            'PopupData should contain correct last invoker');
    });

    QUnit.test('Assigning lastInvoker', function (assert) {

        $('#popup').popup();
        const invoker = $('<p data-popup-target="#popup">A</p>')
                        .appendTo('#qunit-fixture');

        $('#popup')[0].showPopup(invoker);

        assert.equal(invoker[0], $('#popup')[0].popupData.$lastInvoker[0],
            'PopupData should contain correct last invoker');
    });

    QUnit.test('Overriding lastInvoker', function (assert) {

        $('#popup').popup();

        const firstInvoker = $('<p data-popup-target="#popup">A</p>')
                            .appendTo('#qunit-fixture');
        $('#popup')[0].showPopup(firstInvoker);
        const secondInvoker = $('<p data-popup-target="#popup">B</p>')
                            .appendTo('#qunit-fixture');
        $('#popup')[0].showPopup(secondInvoker);

        assert.equal(secondInvoker[0], $('#popup')[0].popupData.$lastInvoker[0],
            'lastInvoker in popupData should be overriden');
    });

    QUnit.test('Assigning default values', function (assert) {
        const defaults = {
            popupSide: 'right',
            popupPlacement: 'absolute-on-item',
            popupAnimation: 'slide',
            popupAnimationSpeed: '_default'
        };

        $('#popup').popup();

        const popupData = $('#popup')[0].popupData;
        assert.equal(popupData.popupSide, defaults.popupSide, 'Popup side:');
        assert.equal(popupData.popupPlacement, defaults.popupPlacement, 'Popup placement:');
        assert.equal(popupData.popupAnimation, defaults.popupAnimation, 'Popup animation type:');
        assert.equal(popupData.popupAnimationSpeed, defaults.popupAnimationSpeed, 'Popup animation speed:');
    });

    QUnit.test('Throwing error on invalid popup placement', function (assert) {
        
        //suppress console.warn during tests
        const temp = console.warn;
        console.warn = $.noop;

        const act = function() {
            $('#popup').popup({
                popupPlacement: 'BAD',
            });
        };

        //bring back console
        console.warn = temp;

        assert.throws(act, Error('popup: unrecognized placement: BAD'), 'Should throw on invalid popup placement');
    });

    QUnit.test('Throwing error on invalid popup side', function (assert) {
        
        //suppress console.warn during tests
        const temp = console.warn;
        console.warn = $.noop;

        const act = function() {
            $('#popup').popup({
                popupSide: 'BAD',
            });
        };

        //bring back console
        console.warn = temp;

        assert.throws(act, Error('popup: unrecognized popup side: BAD'), 'Should throw on invalid popup side');
    });

    QUnit.test('Throwing error on invalid popup animation type', function (assert) {
        
        //suppress console.warn during tests
        const temp = console.warn;
        console.warn = $.noop;

        const act = function() {
            $('#popup').popup({
                popupAnimation: 'BAD'
            });
        };

        //bring back console
        console.warn = temp;

        assert.throws(act, Error('popup: unrecognized popup animation type: BAD'), 'Should throw on invalid animation type');
    });

    QUnit.test('Throwing error on invalid popup animation speed', function (assert) {
        
        //suppress console.warn during tests
        const temp = console.warn;
        console.warn = $.noop;

        const act = function() {
            $('#popup').popup({
                popupAnimationSpeed: 'BAD'
            });
        };

        //bring back console
        console.warn = temp;

        assert.throws(act, Error('popup: unrecognized popup animation speed: BAD'), 'Should throw on invalid animation speed');
    });
});
