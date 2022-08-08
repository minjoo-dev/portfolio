$(document).ready(function(){
    $('.icon-menu').on('click', function () {
        $('.sidemenu').addClass('active');
        $('.overlay').fadeIn();
    });

    $('.overlay').on('click', function () {
        $('.sidemenu').removeClass('active');
        $('.overlay').fadeOut();
    });


    // popoup
    $('.btn-popup-open').on('click', function(){
        $('.popup').show();
        $('.popup-dimm').show();
    })

    $('.icon-close-popup, .btn-cancel').on('click', function () {
        $(this).parents('.popup').hide();
        $('.popup-dimm').hide();
    });
})