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

        $('#popup').showPopup(invoker);

        assert.equal(invoker[0], $('#popup')[0].popupData.$lastInvoker[0],
            'PopupData should contain correct last invoker');
    });

    QUnit.test('Overriding lastInvoker', function (assert) {

        $('#popup').popup();

        const firstInvoker = $('<p data-popup-target="#popup">A</p>')
                            .appendTo('#qunit-fixture');
        $('#popup').showPopup(firstInvoker);
        const secondInvoker = $('<p data-popup-target="#popup">B</p>')
                            .appendTo('#qunit-fixture');
        $('#popup').showPopup(secondInvoker);

        assert.equal(secondInvoker[0], $('#popup')[0].popupData.$lastInvoker[0],
            'lastInvoker in popupData should be overriden');
    });

    QUnit.todo('Assigning default values', function (assert) {
        const defaults = {
            popupSide: 'right',
            popupOnEnded: $.noop,
            popupPlacement: 'absolute-on-item',
            popupAnimation: 'slide',
            popupAnimationSpeed: '_default'
        };

        $('#qunit-fixture').append('<p data-popup-target="#popup">A</p>');
        $('p', '#qunit-fixture').popup();

        const popupData = $('#popup')[0].popupData;

        assert.equal(popupData.popupSide, defaults.popupSide, 'Popup side:');
        assert.equal(popupData.popupOnEnded, defaults.popupOnEnded, 'On ended callback:');
        assert.equal(popupData.popupPlacement, defaults.popupPlacement, 'Popup placement:');
        assert.equal(popupData.popupAnimation, defaults.popupAnimation, 'Popup animation type:');
        assert.equal(popupData.popupAnimationSpeed, defaults.popupAnimationSpeed, 'Popup animation speed:');
    });

});

//const placement = getPlacementData(options);
