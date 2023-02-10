$(document).ready(function(){
    // 메뉴 스크롤 이동
    $('.arrow').click(function(){
        const offset = $('.sec-about').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
    });
    $('.gnb-about').click(function(){
        const offset = $('.sec-about').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
        $('.menu-open').hide();
        $('.btn-menu').toggleClass("on");
    });
    $('.gnb-career').click(function(){
        const offset = $('.sec-career').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
        $('.menu-open').hide();
        $('.btn-menu').toggleClass("on");
    });
    $('.gnb-works').click(function(){
        const offset = $('.sec-works').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
        $('.menu-open').hide();
        $('.btn-menu').toggleClass("on");
    });

    // 모바일 메뉴 클릭
    $(".btn-menu").on("click", function(){
		$(".menu-open").fadeToggle(300).toggleClass("active");
		$(".menu-item").addClass("move");
		$(this).toggleClass("on");
	});
});

