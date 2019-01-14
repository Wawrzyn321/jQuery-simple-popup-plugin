$('.popup-definition').on('mouseenter', function() {
    const popupId = $(this).data('popupTarget');
    $(popupId)[0].showPopup($(this));
}).on('mouseleave', function() {
    const popupId = $(this).data('popupTarget');
    $(popupId)[0].hidePopup();
});

$('.popup-popup').popup( {popupAnimation: 'fade', popupSide: 'right'} );

//const placement = getPlacementData(options);
