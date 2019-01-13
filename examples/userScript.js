$('.popup-definition').popup({popupAnimation: 'fade'})
                .on('mouseenter', function() {$($(this).data('popupTarget'))[0].showPopup();})
                .on('mouseleave', function() {$($(this).data('popupTarget'))[0].hidePopup();});
                