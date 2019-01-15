$('.popup-definition').on('mouseenter', function() {
    const popupId = $(this).data('popupTarget');
    $(popupId)[0].showPopup($(this));
}).on('mouseleave', function() {
    const popupId = $(this).data('popupTarget');
    $(popupId)[0].closePopup();
});

$('#first-popup').popup();

$('#second-popup').popup({
    popupSide: 'left',
    popupPlacement: 'fixed-bottom'
});

$('#popup-button').on('click', function() {
    $('#second-popup')[0].showPopup(this);
});
