QUnit.module('Chainability tests', function() {

    QUnit.test('Chainability', function(assert) {
        
        $('#qunit-fixture').append('<p data-popup-target="#popup">A</p>');
        $('#qunit-fixture').append('<p data-popup-target="#popup">B</p>');

        const $links = $('p', '#qunit-fixture');
        $links.popup().css({color: 'rgb(255, 0, 0)'});

        //check if color change works at all
        assert.equal($links.eq(0).css('color'), 'rgb(255, 0, 0)', 'Color should be changed');
        //check if color change works on both elements
        assert.equal($links.eq(1).css('color'), 'rgb(255, 0, 0)', 'Color of both objects should be changed');
    });

});
