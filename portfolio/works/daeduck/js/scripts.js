$(function(){
	/*--- common ---*/
	// 푸터 패밀리 사이트 메뉴
	$('.btn_site').on('click',function() {
		$('.site').toggle();
		$('.btn_plus').text( $('.btn_plus').text() == '-' ? "+" : "-");
	});

	/*--- 메인 1 ---*/
	//  메인 비주얼 슬라이드 정지
	$('.btn-stop').click(function(){
		$('.btn-stop').hide();
		$('.btn-play').show();
		visual_swiper.autoplay.stop();
		return false;
	});

	// 메인 비주얼 슬라이드 재생
		$('.btn-play').click(function(){
		$('.btn-play').hide();
		$('.btn-stop').show();
		visual_swiper.autoplay.start();
		return false;
	});

	// ellipsis 1
	$('.r_quick01 ul li .q_txt .txt').ellipsis({
		row: 3,
	});


	/*--- 메인 2 ---*/
	// 전체 스크롤
	$('#fullpage').fullpage({
		paddingTop: '90px',
		scrollingSpeed: 1200,
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['대덕정보', '채용정보', '대덕인이야기'],
		showActiveTooltip: true,
		autoScrolling:true,
		scrollHorizontally: true,
	});

	// 채용공고 슬라이드
	var recruit_swiper = new Swiper('.recruit_swiper .swiper-container', {
		slidesPerView: 4,
		spaceBetween: -40,
		speed: 600,
		navigation: {
			nextEl: '.recruit_swiper .swiper-button-next',
			prevEl: '.recruit_swiper .swiper-button-prev',
		},
	});

	// 채용공고 탭메뉴
	$(".re_tab").hide();
	$(".re_tab:first").show();

	$(".re_tab_menu li").click(function () {
		$(".re_tab_menu li").removeClass("on");
		$(this).addClass("on");
		$(".re_tab").hide();
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn();
	});

	// 대덕인이야기 슬라이드
	var story_swiper = new Swiper('.story_swiper .swiper-container', {
		slidesPerView: 3,
		spaceBetween: 40,
		speed: 600,
		pagination: {
		el: '.story_swiper .swiper-pagination',
			type: 'fraction',
		},
		navigation: {
			nextEl: '.story_swiper .swiper-button-next',
			prevEl: '.story_swiper .swiper-button-prev',
		},
	});

	// 대덕인이야기 탭메뉴
	$(".st_tab").hide();
	$(".st_tab:first").show();

	$(".st_tab_menu li").click(function () {
	$(".st_tab_menu li").removeClass("on");

	$(this).addClass("on");
		$(".st_tab").hide();
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn();
	});

	// 뉴스 슬라이드
	var news_swiper = new Swiper('.new_swiper .swiper-container', {
		slidesPerView: 3,
		spaceBetween: 40,
		speed: 600,
		pagination: {
		el: '.new_swiper .swiper-pagination',
			type: 'fraction',
		},
		navigation: {
			nextEl: '.new_swiper .swiper-button-next',
			prevEl: '.new_swiper .swiper-button-prev',
		},
	});

	// ellipsis 1
	$('.news_main .n_desc').ellipsis({
		row: 2,
	});

});