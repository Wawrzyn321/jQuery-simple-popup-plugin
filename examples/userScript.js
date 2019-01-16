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

    $(popupId).popup();

    $('.popup-close', popupId).on('click', function() {
        $(linkId).removeClass('grid-item-active');
        $(popupId)[0].closePopup();
    });

    $(linkId).on('click', function () {
        const $popup = $(popupId);
        if ($popup[0].isShown()){
            $popup[0].closePopup();
            $(linkId).removeClass('grid-item-active');
        }
        else {
            $popup[0].showPopup();
            $(linkId).addClass('grid-item-active');
        }
    });
}

initDefinitionPopups();
initPositionPopup('#middle-left', '#middle-left-popup');
initPositionPopup('#middle-right', '#middle-right-popup');
initPositionPopup('#bottom-left', '#bottom-left-popup');
initPositionPopup('#bottom-right', '#bottom-right-popup');
