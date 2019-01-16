function initDefinitionPopups() {

    $('#first-popup').popup();

    $('.popup-definition').on('mouseenter', showDefinitionPopup).on('mouseleave', closeDefinitionPopup);

    function showDefinitionPopup() {
        const $this = $(this);

        //find assigned popup
        const popupId = $this.data('popupTarget');

        //fill the word definition
        $(popupId).find('.content').text($this.data('definition'));

        //show popup
        $(popupId).popup( { $anchor: $this})[0].showPopup();
    }

    function closeDefinitionPopup() {
        const popupId = $(this).data('popupTarget');

        $(popupId)[0].closePopup();
    }
}

function initPositionPopup(linkId, popupId) {

    const $popup = $(popupId);
    const $link = $(linkId);

    //init popup
    $popup.popup();

    //bind to close button on popup
    $('.popup-close', popupId).on('click', function() {
        $link.removeClass('grid-item-active');
        $popup[0].closePopup();
    });

    //bind to links on display
    $link.on('click', function () {
        if ($popup[0].isShown()){
            $popup[0].closePopup();
            $link.removeClass('grid-item-active');
        }
        else {
            $popup[0].showPopup();
            $link.addClass('grid-item-active');
        }
    });
}

initDefinitionPopups();
initPositionPopup('#middle-left', '#middle-left-popup');
initPositionPopup('#middle-right', '#middle-right-popup');
initPositionPopup('#bottom-left', '#bottom-left-popup');
initPositionPopup('#bottom-right', '#bottom-right-popup');
