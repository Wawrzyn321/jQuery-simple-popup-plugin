$('.popup-definition').on('mouseenter', function() {
    const popupId = $(this).data('popupTarget');
    $(popupId).showPopup(this);
}).on('mouseleave', function() {
    const popupId = $(this).data('popupTarget');
    $(popupId).hidePopup();
});

$('.popup-popup').popup( {popupAnimation: 'fade'} );

//const placement = getPlacementData(options);
