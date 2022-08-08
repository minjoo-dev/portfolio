
$(document).ready(function(){
	$.calendar.init();
	setSelectBox()
	getSelectBoxDay();

	$('#year').on("change",function(){
		const changeYear = $(this).val();
		const changeMonth = $('#month').val();
		var $date = {};
			$date.year   = changeYear;
			$date.month  = changeMonth;
			$date.day    = "";
		$.calendar.init($date);
	});

	$('#month').on("change",function(){
		const changeMonth = $(this).val();
		const changeYear = $('#year').val();
		var $date = {};
			$date.year   = changeYear;
			$date.month  = changeMonth;
			$date.day    = "";
		$.calendar.init($date);
	});

	$('.js-open').on('click',function(){
		const target = $(this);
		const openPopup = $(this).data('popid');
		const clickDate = target.find('.data-date').data('date');
		$("#" + openPopup).css('display','flex');
		$.calendar.MHListCall(clickDate);
	});

	$('.js-close').on('click',function(){
		$(this).parents('.layer-popup-wrap').hide();
	})


	$('#endDate, #startDate').datepicker({
		dateFormat: 'yy-mm-dd',
		prevText: '이전 달',
        nextText: '다음 달',
		showOn: "button",
		buttonImage: "./images/sm-calendar.png",
		buttonImageOnly: true,
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		showMonthAfterYear: true,
        yearSuffix: '년',
	});

	$('#startDate').datepicker('setDate', new Date());
	$('#endDate').datepicker('setDate', new Date());

	$('#startDate').on('change',function(){
		$('#endDate').datepicker("option", "minDate", $("#startDate").val());		
	})


	$('.js-MH-append').on('click',function(){
		$('#MH-append-work-pop').css('display','flex');
	});
});


(function ($) {
	$.calendar = {
		arrEngMonth :  new Array('January','Febuary','March','April','May','June', 'July','August','September','October','November','December') ,
		arrWeekKor  :  new Array('일','월','화','수','목','금','토')																					,
		arrWeekEng  :  new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat')																		,
		arrWeekDip  :  new Array('sun','','','','','','sat'),
		init : function(obj){
    		if( !(obj) ){
    			$.date.nowDate();	//현재 날짜를 가져와서
    			$date.day = "01";	//해당 일자는 1일로 세팅해준다.
    		}else{
    			$date.year 	= obj.year;
    			$date.month = obj.month;
    			$date.day 	= "01";	//해당 일자는 1일로 세팅해준다.
    		}
			$.calendar.displayCalendar();

			$(".cal-prevBtn").unbind("click").on("click", $.calendar.prevMonth);
    		$(".cal-nextBtn").unbind("click").on("click", $.calendar.nextMonth);
    	},
		displayCalendar : function(){
			var monthEng = $.calendar.arrEngMonth[ parseInt($date.month, 10) - 1 ]; //해당 월을 영문으로 변경
			$("#Now-year-day").html( $date.year + '. ' + $date.month+'. ' );
			$.calendar.setCalendar();
		},
		setCalendar : function(){
			var dateObject 	= $.calendar.returnDateFormat("object");
			var dateStr	 	= $.calendar.returnDateFormat("string");
			var lastDay		= $.calendar.getLastDay();
			var obj			= { "year" : $date.year, "month" : $date.month, "day" : fnLPAD(lastDay, "0", 2 )};
			var lastDayObj  = $.calendar.returnDateFormat("object", obj);
			var lastDayStr  = $.calendar.returnDateFormat("string", obj);
			var startWeek	= dateObject.getDay();
			var endWeek		= lastDayObj.getDay();
			var StartDay	= $.date.dateAdd(dateStr, "d", -( parseInt(startWeek,10) ));
			var EndDay		= $.date.dateAdd(lastDayStr, "d",  parseInt(6 - endWeek,10) );
			var DayMaxCnt	= $.date.dateDiff(StartDay, EndDay);

			
			var html = "";
			$("#calendarDayBox").empty();
			for ( var i = 0; i <= DayMaxCnt; i++ ){
				var nowDateObj = {};
				$.date.nowDate(nowDateObj);
				
				var nowDateStr		=  $.calendar.returnDateFormat("string", nowDateObj); 
				var isForDate 		= $.date.dateAdd(StartDay, "d", i );
				var isForDateArr	= isForDate.split("-");
				var isForDateCvt	= {"year" : isForDateArr[0] , "month" : isForDateArr[1] , "day" : isForDateArr[2] };
				var isForDateObj	= $.calendar.returnDateFormat("object", isForDateCvt);
				var isForDateWeek	= isForDateObj.getDay();	

				if ( i == 0) { html += '<li>'; }
				var blackCss = "";
				if ( isForDateArr[1] != $date.month ){	blackCss ="blank"; }
				
				if ( nowDateStr == isForDate){
					html += '<div data-popid="MH-list-pop" class="cal-col js-open '+blackCss+' today '+ $.calendar.arrWeekDip[isForDateWeek] +'" ><p class="cal-numtt today "><a href="#" class="data-date" data-date="'+isForDate+'">'+isForDateArr[2]+'</a></p>';
					if(isForDateWeek == 0 || isForDateWeek == 6 ) {
						html += '</div>'
					}else{
						html += '<div class="MH-thumb-work">' +$.calendar.MHviewList()+'</div></div>'
					}
				}else{
					html += '<div data-popid="MH-list-pop" class="cal-col js-open '+blackCss+' '+$.calendar.arrWeekDip[isForDateWeek]+'" ><p class="cal-numtt"><a href="#" class="data-date" data-date="'+isForDate+'">'+isForDateArr[2]+'</a></p>';
					if(isForDateWeek == 0 || isForDateWeek == 6 ) {
						html += '</div>'
					}else{
						html += '<div class="MH-thumb-work">' +$.calendar.MHviewList()+'</div></div>'
					}
				}
				if ( (i+1) % 7 == 0) {
					if ( i == DayMaxCnt){
						html += '</li>';
					}else{
						html += '</li><li>';
					}
				}
			}

			$("#calendarDayBox").append(html);   
		},
		returnDateFormat : function(iType, $object) {
			if (iType=="string"){
				if ( !!($object) ){
					return $object.year + "-" + $object.month + "-" + $object.day;
				}else{
					return $date.year + "-" + $date.month + "-" + $date.day;
				}
				
			} else if(iType="object"){ 
				if ( !!($object) ){
					return  new Date( parseInt($object.year,10), parseInt($object.month,10) - 1, parseInt($object.day,10), 0, 0, 0);
				}else{
					return  new Date( parseInt($date.year,10), parseInt($date.month,10) - 1, parseInt($date.day,10), 0, 0, 0);
				}
			}
		},
		getLastDay : function(){
			var lastDay = ( new Date( $date.year,  $date.month, 0) ).getDate();    		
			return lastDay;
		},
		prevMonth : function(e){
    		var nowDate 	= $date.year + "-" + $date.month + "-" + "01";
    		var prevDate	= $.date.dateAdd(nowDate, "m", -1);
    		
    		var $pervDiffDate = {};
    		$.date.nowDate( $pervDiffDate );
    		var prefDiffDateStr = $pervDiffDate.year + "-" + $pervDiffDate.month + "-" + "01";
    		
    		var prevDiffCnt = $.date.dateDiff(nowDate, prefDiffDateStr);
    		
    		if ( prevDiffCnt <= 365 ){
        		var prevDateArr = prevDate.split("-");
    				$date.year 	= prevDateArr[0];
    				$date.month = prevDateArr[1];
    				$date.day 	= prevDateArr[2];    		
    	    		$.calendar.displayCalendar();
    		}
    	},
    	nextMonth : function(e){
    		var nowDate 	= $date.year + "-" + $date.month + "-" + "01";
    		var nextDate	= $.date.dateAdd(nowDate, "m", 1);
    		
    		var $nextDiffDate = {};
    		$.date.nowDate( $nextDiffDate );
    		var nextDiffDateStr = $nextDiffDate.year + "-" + $nextDiffDate.month + "-" + "01";
    		var prevDiffCnt = $.date.dateDiff(nextDiffDateStr, nextDate);
    		
    		if ( prevDiffCnt <= 365 ){
        		var nextDateArr = nextDate.split("-");
				$date.year 	= nextDateArr[0];
				$date.month = nextDateArr[1];
				$date.day 	= nextDateArr[2];    		
	    		$.calendar.displayCalendar();
    		}
    	},
		MHListCall : function(clickDate){
			// LIST DATA
			let html= `<li class="MH-list">
				<div class="MH-head">
					<div class="MH-workTime MH-round">근무</div>
					<div class="MH-prg-time MH-round"><span class="hour">10</span><span>:</span><span class="minutes">50</span></div>
				</div>
				<div class="MH-prj-name">중대형 플랫폼 설계 점검을 위한 서스펜션</div>
			</li>
			<li class="MH-list">
				<div class="MH-head">
					<div class="MH-prj-code MH-round">HR-999999</div>
					<div class="MH-prg-time MH-round"><span class="hour">10</span><span>:</span><span class="minutes">50</span></div>
				</div>
				<div class="MH-prj-name">중대형 플랫폼 설계 점검을 위한 서스펜션</div>
			</li>
			<li class="MH-list">
				<div class="MH-head">
					<div class="MH-prj-code MH-round">HR-999999</div>
					<div class="MH-prg-time MH-round"><span class="hour">10</span><span>:</span><span class="minutes">50</span></div>
				</div>
				<div class="MH-prj-name">중대형 플랫폼 설계 점검을 위한 서스펜션</div>
			</li>
			`
			$('#MH-list-append').empty();
			$('#MH-list-append').append(html);
		},
		MHviewList:function(){
			var type = 1;
			var prjCount = 2;
			var html = '';

			// prj-dl << 삭제 해주시면 됩니다.
			if(type == 1){
				html = `<dl class="work-dl">
					<dt class="round-dt type1">근</dt>
					<dd class="">08:00</dd>
				</dl>
				<dl class="prj-dl">
					<dt class="round-dt type2">MH</dt>
					<dd class="">외 ${prjCount}</dd>
				</dl>`
			};

			if(type == 2){
				html = `<dl class="prj-dl">
					<dt class="round-dt type2">MH</dt>
					<dd class="">외 ${prjCount}</dd>
				</dl>`
			}
			return html;
		}
	}

})(jQuery);

function apiCall(){

}

(function ($) {
	 $.date = {
    	nowDate : function(obj)
    	{
  		  var today 		= new Date(); // 날자 변수 선언
		  var dateNow 		= fnLPAD(String(today.getDate()),"0",2); //일자를 구함
		  var monthNow 		= fnLPAD(String((today.getMonth()+1)),"0",2); // 월(month)을 구함
		  var yearNow    	= String(today.getFullYear()); //년(year)을 구함
		  
		  if (!!(obj))
		  {
			  obj.year = yearNow;
			  obj.month = monthNow;
			  obj.day = dateNow;			  
		  }
		  else
		  {
			  $date.year = yearNow;
			  $date.month = monthNow;
			  $date.day = dateNow;			  
		  }
    	}
    	,
    	dateDiff : function(start, end)
    	{
    		var startArr    = start.split("-");	
    		var endArr     	= end.split("-");	
    		var start_date  = new Date(startArr[0], startArr[1] - 1 ,  startArr[2], 0, 0, 0);
    		var end_date    = new Date(endArr[0], endArr[1] - 1 ,  endArr[2], 0, 0, 0);
    		var day 		= 1000*60*60*24;
    		var interval 	= end_date - start_date;
    		var diff        = parseInt(interval/day,10);
    		return diff;    		
    	}
    	,
    	dateAdd : function(DateStr, AddType, AddCnt)
    	{
    		var _strDate = null;
    		var parts 		= DateStr.split('-');
    		var iYar 		= Number(parts[0]);
    		var iMonth 		= Number(parts[1]) - 1;
    		var iDay 		= Number(parts[2]);
    		switch (AddType) {
    			case "y":
    				iYar = iYar + AddCnt;
    				break;
    			case "m":
    				iMonth = iMonth + AddCnt;
    				break;
    			case "d":
    				iDay = iDay + AddCnt;
    				break;
    			default:
    		}
    		var now = new Date(iYar, iMonth, iDay);

    		var year = now.getFullYear();
    		var mon = (now.getMonth() + 1) > 9 ? '' + (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
    		var day = now.getDate() > 9 ? '' + now.getDate() : '0' + now.getDate();
    		return String.format("{0}-{1}-{2}", year, mon, day);
    	}
    };
})(jQuery);


String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function fnLPAD(val,set,cnt){
	if( !set || !cnt || val.length >= cnt){
	   return val;
	}

	var max = (cnt - val.length)/set.length;

	for(var i = 0; i < max; i++){
	   val = set + val;
	}

	return val;
}


function setSelectBox(){
	//$("#myplane_date01 > option").empty();
	var nowYear 	= $date.year + "-" + $date.month + "-" + "01";
	var prevYear	= $.date.dateAdd(nowYear, "y", -10);	
	var nextYear	= $.date.dateAdd(nowYear, "y", 10);
	
	var optionValue = "";
	for ( var k = parseInt(prevYear,10); k <= parseInt(nextYear,10); k++)
	{
		var selected ="";
		if ( k == $date.year)
		{
			selected ="selected";
		}
		else
		{
			selected ="";
		}
		optionValue += '<option value="'+k+'" '+selected+'>'+k+' 년</option>';
		//$("#myplane_date01").appendTo(optionValue);
	}
	
	$("#myplane_date01").html(optionValue);
	$("#myplane_date01").trigger("change");
	
	
	
	var optionValue = "";
	for ( var k = 1; k <= 12; k++)
	{
		var selected ="";
		if ( k == parseInt($date.month,10) )
		{
			selected ="selected";
		}
		else
		{
			selected ="";
		}
		
		optionValue += '<option value="'+fnLPAD(k+'',"0",2)+'" '+selected+'>'+fnLPAD(k+'',"0",2)+' 월</option>';
	}
	$("#myplane_date02").html(optionValue);
	$("#myplane_date02").trigger("change");		

}

function getSelectBoxDay(){
	var nowDateObj = {};
	$.date.nowDate(nowDateObj);
	
	var selectedYear 	= $("#myplane_date01 option:selected").val();
	var selectedMonth 	= $("#myplane_date02 option:selected").val();
	var selectLastDay 	= ( new Date( parseInt(selectedYear,10),  parseInt(selectedMonth,10), 0) ).getDate();    
	var optionValue = "";
	
	$("#myplane_date03").html("");
	for ( var k = 1; k <= selectLastDay; k++)
	{
		var selected ="";
		if ( k == parseInt(nowDateObj.day,10) )
		{
			selected ="selected";
		}
		else
		{
			selected ="";
		}
		
		optionValue += '<option value="'+fnLPAD(k+'',"0",2)+'" '+selected+'>'+fnLPAD(k+'',"0",2)+' 일</option>';
	}
	$("#myplane_date03").html(optionValue);
	$("#myplane_date03").trigger("change");				
}