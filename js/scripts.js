$(document).ready(function(){
    // 화살표 스크롤 이동
    $('.arrow').click(function(){
        const offset = $('.sec-about').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
    });

    // 화살표 스크롤 이동
    $('.gnb-about').click(function(){
        const offset = $('.sec-about').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
        $('.menu-open').hide();
    });

    // 화살표 스크롤 이동
    $('.gnb-career').click(function(){
        const offset = $('.sec-career').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
        $('.menu-open').hide();
    });

    // 화살표 스크롤 이동
    $('.gnb-works').click(function(){
        const offset = $('.sec-works').offset(); 
        $('html, body').animate({scrollTop : offset.top}, 800);
        $('.menu-open').hide();
    });

    $(".btn-menu").on("click", function(){
		$(".menu-open").fadeToggle(300);
		$(".menu-open").toggleClass("active");
		$(".menu-item").addClass("move");
		$(this).toggleClass("on");
	});

    // 모달 팝업창
    const close = () => {
        document.querySelector(".modal").classList.add("hide");
    }
    const open = () => {
        document.querySelector(".modal").classList.remove("hide");
    }
    document.querySelector(".modal-open").addEventListener("click", open);
    document.querySelector(".modal-close").addEventListener("click", close);
    document.querySelector(".dimm").addEventListener("click", close);
});


