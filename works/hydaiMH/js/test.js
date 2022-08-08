$(document).ready(function () {
	$.calendar.init();
	setSelectBox()
	getSelectBoxDay();
	
	$.openevent.getStamp('A');
	
	$("#myplane_date01, #myplane_date02").on("change", function(){
		getSelectBoxDay();		
	});
	

	$(".todayMoveBtn").on("click", function(){
		$.calendar.init();
	});	
	
	$(".calendarTypeChange").on("click", function(){
		var index = $(".calendarTypeChange").index(this);
		if ( index ==0 )
		{
			$(".ms_calWrap").show();
			$(".ms_calList").hide();
			$(".cal_bottom_bg").show();
			$calendar.type ="box";
		}
		else
		{
			$(".ms_calList").show();
			$(".ms_calWrap").hide();
			$(".cal_bottom_bg").hide();
			$calendar.type ="list";
		}
		$.calendar.init( $date );
	});
	
	$("ul.calUtil2 a").eq(0).on("click", function(){
		var ww = $(window).scrollTop();
		$("div.myPop").css('top', ww + "px");
		$("div.myDimm").show();
		$("div.myPop").fadeIn();
		
		getSelectBoxDay();
		$("div.myPop a.a1").html("등록");
		$("div.myPop a.a1").data("method", "write");
		return false;
	});
	
	$("div.myPop p.close, div.myPop a.a2 ,  div.myDimm").on("click", function(){
		$("div.myDimm").hide();
		$("div.myPop").hide();
		
		$("#myplan_tit").val("");
		$("#myplan_con").val("");
	});	
	
	$("div.myPop a.a1").on("click", function(){
		
		var deny_char = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s!@#?$%&*().\r\n,\*]+$/
		if(pattern_check("#myplan_tit" ,   "제목을 입력하세요." , "해당 영역은 한글/숫자/영문, 특수기호  !,@,#,?,$,%,&,*,(,) 입력 가능합니다.", deny_char )==false){return;}
		if(pattern_check("#myplan_con" ,   "내용을 입력하세요." , "해당 영역은 한글/숫자/영문, 특수기호  !,@,#,?,$,%,&,*,(,) 입력 가능합니다.", deny_char )==false){return;}
		
		var method			= $(this).data("method");
		var title			= $("#myplan_tit").val();
		var memo			= $("#myplan_con").val();
		var is_date 		= $("#myplane_date01").val() + "-" + $("#myplane_date02").val() + "-" + $("#myplane_date03").val();
		var is_detail		= '{ title : "'+title+'" , message : "'+memo+'"  }';

		var param = { "is_date" : is_date, "snc_callendar_name" : title , "snc_detail" : is_detail  };
		
		
		if ( method == "write")
		{
			__ajaxCall("/my/calendarInsertAjax.do", param, true, "json", "post",
					function (_response) 
					{
						if ( _response.result_code == "0")
						{
							$("div.myDimm").hide();
							$("div.myPop").hide();
							
							$("#myplan_tit").val("");
							$("#myplan_con").val("");						
							$.calendar.init($date);
						}
						else
						{
							alert("시스템 오류로 인해 캘린더 정보등록이 실패 하였습니다.");
							return;
						}
	    				
			        }
					, 
					function(_error)
					{
					}
	    	);  				
		}
		else
		{
			var index			= $(this).data("index");
			param.snc_index 	= index;
			
			//console.log(param);
			__ajaxCall("/my/calenderUpdate.do", param, true, "json", "post",
					function (_response) 
					{
						if ( _response.result_code == "0")
						{
							$("div.myDimm").hide();
							$("div.myPop").hide();
							
							$("#myplan_tit").val("");
							$("#myplan_con").val("");						
							$.calendar.init($date);
						}
						else
						{
							alert("올바르지 않은 방식으로 수정처리 할 수 없습니다.");
							return;
						}
			        }
					, 
					function(_error)
					{
					}
	    	);  			
			
		}
	
		
	
	});
});

/** ajax 데이터 셋 구성**/
(function ($) {
    $.calendar = {
    	arrEngMonth :  new Array('January','Febuary','March','April','May','June', 'July','August','September','October','November','December') ,
    	arrWeekKor  :  new Array('일','월','화','수','목','금','토')																					,
    	arrWeekEng  :  new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat')																		,
    	arrWeekDip  :  new Array('sun','','','','','','sat')																		,
    	init : function(obj)
    	{
    		if ( !(obj) )
    		{
    			$.date.nowDate();	//현재 날짜를 가져와서
    			$date.day = "01";	//해당 일자는 1일로 세팅해준다.
    		}
    		else
    		{
    			$date.year 	= obj.year;
    			$date.month = obj.month;
    			$date.day 	= "01";	//해당 일자는 1일로 세팅해준다.
    		}
    		
    		$.calendar.getCalendarEvt(function(){
    			$.calendar.displayCalendar();
    		});
    		
    		
    		$(".displayNowCalendar").prev().find("a").unbind("click").on("click", $.calendar.prevMonth);
    		$(".displayNowCalendar").next().find("a").unbind("click").on("click", $.calendar.nextMonth);

    	}
    	,
    	getCalendarEvt : function(callback)
    	{
    		var param = {"year" : $date.year, "month" : $date.month};
    		
    		__ajaxCall("/my/calendarListAjax.do", param, true, "json", "post",
    				function (_response) 
    				{
        				if ( _response.result_code == "0")
        				{
        					$event.data =_response.list;
        					callback();
        				}
    		        }
    				, 
    				function(_error)
    				{
    				}
        	);        		
    	}
    	,
    	displayCalendar : function()
    	{
    		if ( $calendar.type == "box")
    		{
    			//var monthEng = $.calendar.arrEngMonth[ parseInt($date.month) - 1 ]; //해당 월을 영문으로 변경
    			//$(".displayNowCalendar").html( monthEng + ' ' + $date.year );
    			var monthEng = $.calendar.arrEngMonth[ parseInt($date.month, 10) - 1 ]; //해당 월을 영문으로 변경
    			$(".displayNowCalendar").html( $date.year + '. ' + $date.month+'. ' );
    			
        		$(".calendarPrint").unbind("click").on("click", function(){
        			$(".calendar_wrap").printElement({
        				printMode: 'popup' ,
        				pageTitle : "스타벅스 코리아 캘린더" ,
        				overrideElementCSS: ['/common/css/style_util.css', '/common/css/reset.css', '/common/css/style.css']  
        			});
        		});
        		        			
    		}
    		else
    		{
    			var monthEng = $.calendar.arrEngMonth[ parseInt($date.month,10) - 1 ]; //해당 월을 영문으로 변경
    			$(".displayNowCalendar").html( $date.year + '. ' + $date.month+'. ' );    
    			
        		$(".calendarPrint").unbind("click").on("click", function(){
        			$(".calendar_wrap").printElement({
        				printMode: 'popup' ,
        				pageTitle : "스타벅스 코리아 캘린더" ,
        				overrideElementCSS: ['/common/css/style_util.css', '/common/css/reset.css', '/common/css/style.css']  
        			});
        		});
    		}
    		
    		$.calendar.setCalendar();
    		

    		    		
    	}
    	,
    	prevMonth : function(e)
    	{
    		var nowDate 	= $date.year + "-" + $date.month + "-" + "01";
    		var prevDate	= $.date.dateAdd(nowDate, "m", -1);
    		
    		var $pervDiffDate = {};
    		$.date.nowDate( $pervDiffDate );
    		var prefDiffDateStr = $pervDiffDate.year + "-" + $pervDiffDate.month + "-" + "01";
    		
    		var prevDiffCnt = $.date.dateDiff(nowDate, prefDiffDateStr);
    		
    		if ( prevDiffCnt <= 365 )
    		{
        		var prevDateArr = prevDate.split("-");
    				$date.year 	= prevDateArr[0];
    				$date.month = prevDateArr[1];
    				$date.day 	= prevDateArr[2];    		
    	    		$.calendar.getCalendarEvt(function(){
    	    			$.calendar.displayCalendar();
    	    		});    			
    		}
    	}
    	,
    	nextMonth : function(e)
    	{
    		var nowDate 	= $date.year + "-" + $date.month + "-" + "01";
    		var nextDate	= $.date.dateAdd(nowDate, "m", 1);
    		
    		var $nextDiffDate = {};
    		$.date.nowDate( $nextDiffDate );
    		var nextDiffDateStr = $nextDiffDate.year + "-" + $nextDiffDate.month + "-" + "01";
    		var prevDiffCnt = $.date.dateDiff(nextDiffDateStr, nextDate);
    		
    		
    		//console.log(prevDiffCnt);
    		
    		if ( prevDiffCnt <= 365 )
    		{
        		var nextDateArr = nextDate.split("-");
				$date.year 	= nextDateArr[0];
				$date.month = nextDateArr[1];
				$date.day 	= nextDateArr[2];    		
	    		$.calendar.getCalendarEvt(function(){
	    			$.calendar.displayCalendar();
	    		});    		    			
    		}
    	}
    	,
    	setCalendar : function()
    	{
    		if ( $calendar.type == "box")
    		{
    			
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
        		for ( var i = 0; i <= DayMaxCnt; i++ )
        		{
        			var nowDateObj = {};
        			
        			$.date.nowDate(nowDateObj);
        			
        			var nowDateStr		=  $.calendar.returnDateFormat("string", nowDateObj); 
        			var isForDate 		= $.date.dateAdd(StartDay, "d", i );
        			var isForDateArr	= isForDate.split("-");
        			var isForDateCvt	= {"year" : isForDateArr[0] , "month" : isForDateArr[1] , "day" : isForDateArr[2] };
        			var isForDateObj	= $.calendar.returnDateFormat("object", isForDateCvt);
        			var isForDateWeek	= isForDateObj.getDay();	
        			
        			if ( i == 0) { html += '<tr>'; }
        			var blackCss = "";
        			if ( isForDateArr[1] != $date.month ){	blackCss ="blank"; }
        			
        			var evtDisplay = "";
        				evtDisplay = $.calendar.evtDisplay(isForDate, isForDateWeek);
        			
        			if ( nowDateStr == isForDate)
        			{
        				html += '<td class="'+blackCss+' today" ><p class="tt">오늘</p><p class="date '+$.calendar.arrWeekDip[isForDateWeek]+'"><a href="#" data-date="'+isForDate+'">'+isForDateArr[2]+'</a></p>'+evtDisplay+'</td>';
        			}
        			else
        			{
        				html += '<td class="'+blackCss+'" ><p class="date '+$.calendar.arrWeekDip[isForDateWeek]+'"><a href="#" data-date="'+isForDate+'">'+isForDateArr[2]+'</a></p>'+evtDisplay+'</td>';
        			}
        			if ( (i+1) % 7 == 0) 
        			{
        				if ( i == DayMaxCnt)
        				{
        					html += '</tr>';
        				}
        				else
        				{
        					html += '</tr><tr>';
        				}
        			}
        		}
    			$("#calendarDayBox").append(html);   
    			
    			$(".moreAddBtn").on("click", function(){
    				$(this).parent().next().show();
    				
					var myWin 		= $(window).width();
					if (myWin < 641) 
					{
						$(".myDimm").fadeIn("fast");
					}
    			});
    			
    			$(".more").on("click", function(){
    				$(this).next().show();
    			});
    			
    			
    			$('div.plan_pop p.close').on("click", function(){
    				$(this).parents('div.plan_pop').hide();
    				$(".myDimm").hide();
    			});    			
    		}
    		else
    		{
        		var dateObject 	= $.calendar.returnDateFormat("object");
        		var dateStr	 	= $.calendar.returnDateFormat("string");
        		var lastDay		= $.calendar.getLastDay();
        		var obj			= { "year" : $date.year, "month" : $date.month, "day" : fnLPAD(lastDay, "0", 2 )};
        		var lastDayObj  = $.calendar.returnDateFormat("object", obj);
        		var lastDayStr  = $.calendar.returnDateFormat("string", obj);
        		var startWeek	= dateObject.getDay();
        		var endWeek		= lastDayObj.getDay();
        		var StartDay	= $.date.dateAdd(dateStr, "d",  0 );
        		var EndDay		= $.date.dateAdd(lastDayStr, "d",  0 );
        		var DayMaxCnt	= $.date.dateDiff(StartDay, EndDay);

        		
    			$(".ms_cal_list").empty();
    			var html ="";
        		for ( var i = 0; i <= DayMaxCnt; i++ )
        		{
        			var nowDateObj = {};
        			$.date.nowDate(nowDateObj);
        			var nowDateStr		=  $.calendar.returnDateFormat("string", nowDateObj); 
        			var isForDate 		= $.date.dateAdd(StartDay, "d", i );
        			var isForDateArr	= isForDate.split("-");
        			var isForDateCvt	= {"year" : isForDateArr[0] , "month" : isForDateArr[1] , "day" : isForDateArr[2] };
        			var isForDateObj	= $.calendar.returnDateFormat("object", isForDateCvt);
        			var isForDateWeek		= isForDateObj.getDay();
        			var isForDateWeekEng	=	$.calendar.arrWeekKor[ isForDateWeek ];
        			var iClass;
        			var cClass;
        			
        			var evtDisplay = "";
    					evtDisplay = $.calendar.evtDisplay(isForDate, isForDateWeek);
        			

    				
        			if ( nowDateStr == isForDate)
        			{
        				if ( evtDisplay == "")
        				{
        					html = '<li class="today"><dl><dt>'+isForDateArr[1]+'.'+isForDateArr[2]+' '+isForDateWeekEng+'</dt><dd><p class="today_tt">오늘</p></dd></dl></li>';
        				}
        				else
        				{
        					html = '<li class="selected"><dl><dt>'+isForDateArr[1]+'.'+isForDateArr[2]+' '+isForDateWeekEng+'</dt><dd>'+evtDisplay+'</dd></dl></li>';
        						
        				}
        				
        			}
        			else
        			{
        				if ( evtDisplay == "")
        				{
        					html = '<li><dl><dt>'+isForDateArr[1]+'.'+isForDateArr[2]+' '+isForDateWeekEng+'</dt><dd></dd></dl></li>';
        				}
        				else
        				{
        					html = '<li class="selected"><dl><dt>'+isForDateArr[1]+'.'+isForDateArr[2]+' '+isForDateWeekEng+'</dt><dd>'+evtDisplay+'</dd></dl></li>';
        				}
        				
        			}    
        			
        			if ( i <= (DayMaxCnt/2) )
        			{
        				$(".ms_cal_list").eq(0).append(html);
        			}
        			else
        			{
        				$(".ms_cal_list").eq(1).append(html);
        			}        			
        		}
        		
        		

        		
    		}
    		
    		
    		$(".myp").unbind("click").on("click", $.calendar.getCalenderView);
			

			
    	}
    	,
    	getCalenderView : function(e)
    	{
    		var index 		= $(this).data("index")+"";
    		var typeCode	= $(this).data("category")+"";
    		var param 		= {"snc_index" : index};
    		
    		__ajaxCall("/my/calendarListAjax.do", param, true, "json", "post",
    				function (_response) 
    				{
    					
        				if ( _response.result_code == "0")
        				{
        					
        					
        					//console.log( $("#calendarView_"+typeCode) );
        					
        					var $selector = $("#calendarView_"+typeCode);
        					$selector.tmpl(_response.list,{
        						getCategory : function(category)
        						{
        							var seq 		= "";
        							var title		= "";
        							if ( category == 'C')
        							{
            							var detail 		= this.data.cdr_detail;
	        							    detail		= detail.replace(/\n/g, "<BR />");
	 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	        							
	 	       							seq 		=  detailObj.promition_seq;    
	 	       							title		=  detailObj.promotion_title;
	 	       							
										if ( title.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
											//console.log(title);
											title = title.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
										}
	 	       							
        							}
        							
        							return $.calendar.convertCategoryImg(category, seq, title);
        						}
        						,
        						getTitle : function()
        						{
        							return this.data.cdr_title;
        						}
        						,
        						getUserInfo : function(typeCode)
        						{
	       							
        							return $vo.displayName;
        							
        						}
        						,
     						
        						getMessageF1 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
        							return detailObj.message;
        						}
        						
        						,
        						getStoreB1 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
        							return detailObj.description2;
        						}
        						,
        						getDateB1 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
        							return detailObj.startDate;
        						}    
        						,
        						getCardNameA4 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
 	       							
 	       							//console.log(detailObj);
        							return detailObj.cardNickname;
        						}
        						,
        						getCardStartDateA4 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
        							return detailObj.startDate;
        						}  
        						,
        						getCardAmountA4 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
        							return detailObj.amount;
        						}
        						,
        						getCardNumberA4 : function()
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
 	       							return "●●●●●●●●●●" + detailObj.cardNumber.substr(10);
	       							/*return detailObj.cardNumber;*/
        						}
        						,
        						
        						getLevelIcon : function(point)
        						{
        							var detail 		= this.data.cdr_detail;
        							    detail		= detail.replace(/\n/g, "<BR />");
 	       							var detailObj	= eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
 	       							if ( point == "from")
 	       							{
 	       								var level		= detailObj.description1;
 	       							}
 	       							else
 	       							{
 	       								var level		= detailObj.description2;
 	       							}
 	       							
 	       							
 	       							var returnImage = "";
 	       							if( level == "WELCOME")
 	       							{
 	       								returnImage = '<img src="/common/img/util/cal/w_star.jpg" alt="" /> Welcome Level';
 	       							}
 	       							else if(level == "GREEN")
 	       							{
 	       								returnImage = '<img src="/common/img/util/cal/g_star.jpg" alt="" /> Green Level';
 	       							}
 	       							else if(level == "GOLD")
 	       							{
 	       								returnImage = '<img src="/common/img/util/cal/g_star2.jpg" alt="" /> Gold Level';
 	       							}
 	       							else
 	       							{
 	       								returnImage = '<img src="/common/img/util/cal/w_star.jpg" alt="" /> Welcome Level';
 	       							}
 	       							
 	       							
        							return returnImage;
        						}
        						,        						
        						getJsonData : function(name)
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail		= detail.replace(/\n/g, "<BR />");
	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							
	       							if (detailObj[name].indexOf("프리퀀시 Star Dash 이벤트") > -1) {
	       								detailObj[name] = detailObj[name].replace("프리퀀시 Star Dash 이벤트","5 DAYS, 5 STARS!");
	       							}
	       							
	       							return detailObj[name];        							
        						}
        						,      
        						getCPImg : function()
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail		= detail.replace(/\n/g, "<BR />");
	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							
	       							return detailObj.coupon_image;
        						}
        						,
        						getCPName : function()
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail		= detail.replace(/\n/g, "<BR />");
	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							
	       							return detailObj.coupon_name;
        						}
        						,
        						getCPStart : function()
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail		= detail.replace(/\n/g, "<BR />");
	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							
	       							return detailObj.coupon_start;
        						}
        						,
        						
        						getCPEnd : function()
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail		= detail.replace(/\n/g, "<BR />");
	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							
	       							return detailObj.coupon_end;
        						}
        						
        						,
        						getHollcakeDate : function(target)
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail		= detail.replace(/\n/g, "<BR />");
	       							var detailObj	=	eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							
	       							var dateStr = detailObj[target];
	       							var yearStr  = dateStr.substring(0,4);
	       							var monthStr = dateStr.substring(4,6);
	       							var dayStr   = dateStr.substring(6);
	       							var rtnDateStr = yearStr + "-" + monthStr + "-" + dayStr;
	       							return rtnDateStr;        							
        						}  
        						,        						
        						getHollcakePrice : function()
        						{
        							var detail 		= this.data.cdr_detail;
    							    detail			= detail.replace(/\n/g, "<BR />");
	       							var detailObj	= eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
	       							var priceStr 	= detailObj["cake_price"];
	       							
	       							return formatnumber(priceStr);
    							
        						}        						
        						        						
        						
        					}).prependTo(".ms_cont");

        					
        					var ww = $(window).scrollTop();
        					$("div.calPop").css('top', ww + "px");
        					$("div.calPop").fadeIn();
        					$("div.myDimm").show();  
        					
        					$(".cdViewMod").unbind("click").on("click", function(){
        						var index = $(this).data("index");
        						$("div.myDimm").hide();
        						$("div.calPop").remove();
        						$.calendar.calendarModify(_response);        						
        					});
        					
        					$(".cdViewDel").unbind("click").on("click", function(){
        						var index = $(this).data("index");
        						
        						if ( confirm('해당 캘린더를 삭제하시겠습니까?'))
        						{
        							var param = { "snc_index" : index };
        				    		__ajaxCall("/my/calenderdel.do", param, true, "json", "post",
        				    				function (_response) 
        				    				{
        				        				if ( _response.result_code == "0")
        				        				{
        			        						$("div.myDimm").hide();
        			        						$("div.calPop").remove();
        			        						$.calendar.init($date);
        				        				}
        				        				else
        				        				{
        				        					alert("올바르지 않은 방식으로 삭제를 처리할 수 없습니다.")
        				        					return;
        				        				}
        				    		        }
        				    				, 
        				    				function(_error)
        				    				{
        				    				}
        				        	);         							
        							
        						}
        					});
        					
        					
        					$("div.calPop p.close, div.myDimm").unbind("click").on("click", function(){
        						$("div.myDimm").hide();
        						$("div.calPop").remove();
        					});
        					
        				}
    		        }
    				, 
    				function(_error)
    				{
    				}
        	); 
    	}
    	,
    	calendarModify : function(data)
    	{
    		var ww = $(window).scrollTop();
    		$("div.myPop").css('top', (ww - ($("div.myPop").height() / 2) ) + "px");
    		$("div.myDimm").show();
    		
    		//console.log( data );
    		var thatDate 	= data.list[0].snc_date_str;
    		var thatTitle 	= data.list[0].cdr_title;
    		var thatMessage = data.list[0].cdr_detail;
    		
		    var detail			= thatMessage.replace(/\n/g, "<BR>");
			var detailObj		= eval( "(" + detail.replace(/&quot;/gi,"\"") +")");
			var detailMessage	= detailObj.message;
				detailMessage	= detailMessage.replace(/<br\s*[\/]?>/gi, "\n");	
			
			var thatDateArr		= thatDate.split("-");
			
			//console.log(thatDateArr);
			
			$("#myplane_date01 option").each(function(i){
				var value = $(this).val();
				
				if ( value == thatDateArr[0])
				{
					$(this).attr("selected", "selected");
					
				}
			});
			$("#myplane_date01").trigger("change");
			
			
			$("#myplane_date02 option").each(function(i){
				var value = $(this).val();
				
				if ( value == thatDateArr[1])
				{
					$(this).attr("selected", "selected");
					
				}
			});
			$("#myplane_date02").trigger("change");

			$("#myplane_date03 option").each(function(i){
				var value = $(this).val();
				
				if ( value == thatDateArr[2])
				{
					$(this).attr("selected", "selected");
					
				}
			});			
			$("#myplane_date03").trigger("change");
			
			
			
			$("#myplan_tit").val(thatTitle);
			$("#myplan_con").val(detailMessage);
			
			//console.log(detailObj);
			
			
    		$("div.myPop a.a1").html("수정");
    		$("div.myPop a.a1").data("method", "mod");
    		$("div.myPop a.a1").data("index", 	data.list[0].cdr_index);
    		
    		$("div.myPop").fadeIn("fast", function(){
    			
    			
    		});
    		return false;    		
    	}
    	,
    	evtDisplay : function( date , week )
    	{
    		var evtDisplayHtml = '';
    		var targetIndex	   = -1;
    		
    		
    		
    		if ( $event.data != null )
    		{
				jQuery.each( $event.data , function(x,y)
    			{
					var isDbDateStr = y.snc_date_str;
						isDbDateStr = isDbDateStr.replace("2999-", date.substring(0,5) ); //2999년도로 들어오는 데이터를 매해마다 출력하기 위한 치환
						
					
					
    				if ( isDbDateStr == date)
    				{
    					targetIndex = x;
    					return;
    				}
    			});
    			
    			if ( targetIndex > -1 )
    			{
    				if ( $calendar.type == "box")
    				{
        				var message_type 		= $event.data[targetIndex].cdr_calendar_type;
        				var message_index 		= $event.data[targetIndex].cdr_index;
        				var message_category 	= $event.data[targetIndex].cdr_category;
        				var message_title 		= $event.data[targetIndex].cdr_title;
        				var message_cnt 		= $event.data[targetIndex].cdr_cnt;
        				
        				message_type = message_type.substring(1);
        				message_index = message_index.substring(1);
        				message_category = message_category.substring(1);
        				message_title = message_title.substring(1);
        				
        				evtDisplayHtml = "";
        				if ( message_cnt > 1)
        				{
        					var msgArrIndex 	= message_index.split("@");
        					var msgArrType  	= message_type.split("@");
        					var msgArrCategory  = message_category.split("@");
        					var msgArrTitle 	= message_title.split("@");    	
							
							if( date == "2015-10-30" )
							{
								for( var k = 0; k <= msgArrIndex.length- 1; k++)
								{
									if ( k <= 2)	//2개까지만 보여주고
									{

										var execptTitle = msgArrTitle[k];
										if ( execptTitle.indexOf("[메리 사이렌 오더 데이] 프로모션 시작") <= -1 )
										{
											var isCALC_TITLE = msgArrTitle[k];
											var styleSet = "";
										
											if ( isCALC_TITLE.indexOf("크리스마스 카드 이벤트") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( isCALC_TITLE.indexOf("메리 사이렌 오더 데이") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( isCALC_TITLE.indexOf("더블 플래너 이벤트") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											

											if ( isCALC_TITLE.indexOf("2016 스타벅스 플래너") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( isCALC_TITLE.indexOf("크리스마스 프로모션") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( isCALC_TITLE.indexOf("크리스마스") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											if ( isCALC_TITLE.indexOf("피지오 수상 기념 이벤트") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}											
											if ( isCALC_TITLE.indexOf("기어S2 런칭") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}													
												
										
											if ( isCALC_TITLE.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
												//console.log(isCALC_TITLE);
												//console.log(msgArrTitle[k]);
												isCALC_TITLE = isCALC_TITLE.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
												msgArrTitle[k] = msgArrTitle[k].replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
											}
											
											if ( isCALC_TITLE.indexOf("5 DAYS, 5 STARS!") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}			
											
																				
											
											
											if( isCALC_TITLE.length > 12)
											{
												var newTit = isCALC_TITLE.substring(0,11)+"..";
											}
											else
											{
												var newTit = isCALC_TITLE;
											}
											
											evtDisplayHtml += '<dl class="myp" data-category="'+msgArrType[k]+'" data-index="'+msgArrIndex[k]+'"><dt><img src="'+$.calendar.convertCategoryImg(msgArrCategory[k], "", msgArrTitle[k])+'" alt=""></dt><dd '+styleSet+' title="'+msgArrTitle[k]+'">'+newTit+'</dd></dl>';
										}
									}
								}
							}
							else
							{
								for( var k = 0; k <= msgArrIndex.length- 1; k++)
								{
									if ( k <= 1)	//2개까지만 보여주고
									{
										var isCALC_TITLE = msgArrTitle[k];
										
										var styleSet = "";
										
										
										if ( isCALC_TITLE.indexOf("크리스마스 카드 이벤트") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}
										
										if ( isCALC_TITLE.indexOf("메리 사이렌 오더 데이") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}
										
										if ( isCALC_TITLE.indexOf("더블 플래너 이벤트") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}
										

										if ( isCALC_TITLE.indexOf("2016 스타벅스 플래너") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}
										
										if ( isCALC_TITLE.indexOf("크리스마스 프로모션") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}
										
										if ( isCALC_TITLE.indexOf("크리스마스") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}
										if ( isCALC_TITLE.indexOf("피지오 수상 기념 이벤트") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}	
										if ( isCALC_TITLE.indexOf("기어S2 런칭") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}											
										
										if ( isCALC_TITLE.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
											//console.log(isCALC_TITLE);
											//console.log(msgArrTitle[k]);
											isCALC_TITLE = isCALC_TITLE.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
											msgArrTitle[k] = msgArrTitle[k].replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
										}

										if ( isCALC_TITLE.indexOf("5 DAYS, 5 STARS!") > -1 )
										{
											styleSet = 'style="color:#ff0000"';
										}		
										
										
										if( isCALC_TITLE.length > 12)
										{
											var newTit = isCALC_TITLE.substring(0,11)+"..";
										}
										else
										{
											var newTit = isCALC_TITLE;
										}
										
										evtDisplayHtml += '<dl class="myp" data-category="'+msgArrType[k]+'" data-index="'+msgArrIndex[k]+'"><dt><img src="'+$.calendar.convertCategoryImg(msgArrCategory[k], "", msgArrTitle[k])+'" alt=""></dt><dd '+styleSet+' title="'+msgArrTitle[k]+'">'+newTit+'</dd></dl>';
									}
								}
							}

        					
        					if ( msgArrIndex.length > 2)	//같은 날짜에 데이터가 2개 이상이라면...
        					{

								if( date == "2015-10-30" )
								{
									evtDisplayHtml += '<p class="more" ><a href="javascript:void(0)" class="moreAddBtn" data-date="'+date+'" data-grpIndex="'+targetIndex+'" >'+(msgArrIndex.length-3)+'개</a></p>';
								}
								else
								{
									evtDisplayHtml += '<p class="more" ><a href="javascript:void(0)" class="moreAddBtn" data-date="'+date+'" data-grpIndex="'+targetIndex+'" >'+(msgArrIndex.length-2)+'개</a></p>';
								}
        						
        						
        						
        						var weekKorName =  $.calendar.arrWeekKor[week];
        						var dateCvtStr  =  date.replace(/-/gi,".");
        					
        						evtDisplayHtml += '<div class="plan_pop">';
        						evtDisplayHtml += '	<div class="plan_pop_head">';
        						evtDisplayHtml += '		<p class="tit"><span class="en">'+dateCvtStr+'</span> <span class="kor">('+weekKorName+')</span></p>';
        						evtDisplayHtml += '		<p class="close"><a href="javascript:void(0)"><img src="/common/img/util/cal/calpop_close.png" alt="닫기"></a></p>';
        						evtDisplayHtml += '	</div>';
        						evtDisplayHtml += ' <div class="plan_pop_content">';    	
								

								if( date == "2015-10-30" )
								{

									for( var k = 0; k <= msgArrIndex.length- 1; k++)
									{
										if ( k > 2)
										{	
											var execptTitle = msgArrTitle[k];
											if ( execptTitle.indexOf("[메리 사이렌 오더 데이] 프로모션 시작") <= -1 )
											{
												var styleSet 	= "";
												var xmasTitle 	= msgArrTitle[k];
												
												if ( xmasTitle.indexOf("크리스마스 카드 이벤트") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}
												
												if ( xmasTitle.indexOf("메리 사이렌 오더 데이") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}
												
												if ( xmasTitle.indexOf("더블 플래너 이벤트") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}
												

												if ( xmasTitle.indexOf("2016 스타벅스 플래너") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}
												
												if ( xmasTitle.indexOf("크리스마스 프로모션") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}  
												if ( xmasTitle.indexOf("크리스마스") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}
												if ( xmasTitle.indexOf("피지오 수상 기념 이벤트") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}	
												if ( xmasTitle.indexOf("기어S2 런칭") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}	

												
												if ( xmasTitle.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
													//console.log(xmasTitle);
													//console.log(msgArrTitle[k]);
													xmasTitle = xmasTitle.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
													msgArrTitle[k] = msgArrTitle[k].replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
												}

												if ( xmasTitle.indexOf("5 DAYS, 5 STARS!") > -1 )
												{
													styleSet = 'style="color:#ff0000"';
												}
												
												evtDisplayHtml += '<dl class="myp" data-category="'+msgArrType[k]+'" data-index="'+msgArrIndex[k]+'"><dt><img src="'+$.calendar.convertCategoryImg(msgArrCategory[k],"",msgArrTitle[k])+'" alt=""></dt><dd '+styleSet+' title="'+msgArrTitle[k]+'">'+msgArrTitle[k]+'</dd></dl>';
											}
										}
									}
								}
								else
								{
									for( var k = 0; k <= msgArrIndex.length- 1; k++)
									{
										if ( k > 1)
										{
											
											var styleSet 	= "";
											var xmasTitle 	= msgArrTitle[k];
											
											if ( xmasTitle.indexOf("크리스마스 카드 이벤트") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( xmasTitle.indexOf("메리 사이렌 오더 데이") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( xmasTitle.indexOf("더블 플래너 이벤트") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											

											if ( xmasTitle.indexOf("2016 스타벅스 플래너") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											
											if ( xmasTitle.indexOf("크리스마스 프로모션") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}
											if ( xmasTitle.indexOf("크리스마스") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}	
											if ( xmasTitle.indexOf("피지오 수상 기념 이벤트") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}			
											
											if ( xmasTitle.indexOf("기어S2 런칭") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}			
											
											if ( xmasTitle.indexOf("5 DAYS, 5 STARS!") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}														
													
											
											if ( xmasTitle.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
												//console.log(xmasTitle);
												//console.log(msgArrTitle[k]);
												xmasTitle = xmasTitle.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
												msgArrTitle[k] = msgArrTitle[k].replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
											}
											
											if ( xmasTitle.indexOf("5 DAYS, 5 STARS!") > -1 )
											{
												styleSet = 'style="color:#ff0000"';
											}															
																					
											
											evtDisplayHtml += '<dl class="myp" data-category="'+msgArrType[k]+'" data-index="'+msgArrIndex[k]+'"><dt><img src="'+$.calendar.convertCategoryImg(msgArrCategory[k],"",msgArrTitle[k])+'" alt=""></dt><dd '+styleSet+' title="'+msgArrTitle[k]+'">'+msgArrTitle[k]+'</dd></dl>';
											
										}
									}
								}


        						evtDisplayHtml += ' </div>';    	
        						evtDisplayHtml += ' <div class="plan_pop_foot"></div>';
        						evtDisplayHtml += '</div>';    						
        					}
        					
        				}
        				else
        				{
							var isCALC_TITLE = message_title;
							
							
							var styleSet = "";
							
							
							if ( isCALC_TITLE.indexOf("크리스마스 카드 이벤트") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}
							
							if ( isCALC_TITLE.indexOf("메리 사이렌 오더 데이") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}
							
							if ( isCALC_TITLE.indexOf("더블 플래너 이벤트") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}
							
							if ( isCALC_TITLE.indexOf("2016 스타벅스 플래너") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}							
							
							if ( isCALC_TITLE.indexOf("크리스마스 프로모션") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}	
							if ( isCALC_TITLE.indexOf("크리스마스") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}	
							if ( isCALC_TITLE.indexOf("피지오 수상 기념 이벤트") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}	
							
							if ( isCALC_TITLE.indexOf("기어S2 런칭") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}															
							
							if ( isCALC_TITLE.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
								//console.log(isCALC_TITLE);
								//console.log(message_title);
								isCALC_TITLE = isCALC_TITLE.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
								message_title = message_title.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
							}

							if ( isCALC_TITLE.indexOf("5 DAYS, 5 STARS!") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}	
							
							
							if( isCALC_TITLE.length > 12)
							{
								var newTit = isCALC_TITLE.substring(0,11)+"..";
							}
							else
							{
								var newTit = isCALC_TITLE;
							}
							        					
        					evtDisplayHtml += '<dl class="myp" data-category="'+message_type+'" data-index="'+message_index+'"><dt><img src="'+$.calendar.convertCategoryImg(message_category, "", message_title)+'" alt=""></dt><dd '+styleSet+' title="'+message_title+'">'+message_title+'</dd></dl>';
        				}
        				
        				    					
    					
    				}
    				else
    				{

        				var message_type 		= $event.data[targetIndex].cdr_calendar_type;
        				var message_index 		= $event.data[targetIndex].cdr_index;
        				var message_category 	= $event.data[targetIndex].cdr_category;
        				var message_title 		= $event.data[targetIndex].cdr_title;
        				var message_cnt 		= $event.data[targetIndex].cdr_cnt;
        				
        				message_type = message_type.substring(1);
        				message_index = message_index.substring(1);
        				message_category = message_category.substring(1);
        				message_title = message_title.substring(1);
        				
        				evtDisplayHtml = "";
        				if ( message_cnt > 1)
        				{
        					var msgArrIndex 	= message_index.split("@");
        					var msgArrType  	= message_type.split("@");
        					var msgArrCategory  = message_category.split("@");
        					var msgArrTitle 	= message_title.split("@");
        					
        					var titleHtml = "";
        					var btnHtml   = "";
        					var addClass  = "";
        					for( var k = 0; k <= msgArrIndex.length- 1; k++)
        					{
        						if ( k == msgArrIndex.length- 1)
        						{
        							addClass = "last";
        						}
        						else
        						{
        							addClass = "";
        						}
        						
        						
    							var styleSet = "";
    							var xMasTitle = msgArrTitle[k];
    							
    							if ( xMasTitle.indexOf("크리스마스 카드 이벤트") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}
    							
    							if ( xMasTitle.indexOf("메리 사이렌 오더 데이") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}
    							
    							if ( xMasTitle.indexOf("더블 플래너 이벤트") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}
    							if ( xMasTitle.indexOf("2016 스타벅스 플래너") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}   
    							
    							if ( xMasTitle.indexOf("크리스마스 프로모션") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}
    							if ( xMasTitle.indexOf("크리스마스") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}    							
    							    
    							if ( xMasTitle.indexOf("피지오 수상 기념 이벤트") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}    							
    							if ( xMasTitle.indexOf("기어S2 런칭") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}
    							     
    							
    							if ( xMasTitle.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
    								//console.log(xMasTitle);
    								//console.log(msgArrTitle[k]);
    								xMasTitle = xMasTitle.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
    								msgArrTitle[k] = msgArrTitle[k].replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
    							}
        						
    							if ( xMasTitle.indexOf("5 DAYS, 5 STARS!") > -1 )
    							{
    								styleSet = 'style="color:#ff0000"';
    							}        		
    							
        						titleHtml += '<p  '+styleSet+' class="plan '+addClass+'" ><img src="'+$.calendar.convertCategoryImg(msgArrCategory[k], "", msgArrTitle[k])+'" alt=""> '+msgArrTitle[k]+'</p>';
        						btnHtml   += '<li><a href="javascript:void(0);" class="myp" data-category="'+msgArrType[k]+'" data-index="'+msgArrIndex[k]+'">상세보기</a></li>';
        					}
        					

        					evtDisplayHtml += titleHtml;
        					evtDisplayHtml += '<ul class="detail">';
        					evtDisplayHtml += btnHtml;
        					evtDisplayHtml += '</ul>';
        				}
        				else
        				{
        					
							var styleSet = "";
							var xMasTitle = message_title;
							
							if ( xMasTitle.indexOf("크리스마스 카드 이벤트") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}
							
							if ( xMasTitle.indexOf("메리 사이렌 오더 데이") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}
							
							if ( xMasTitle.indexOf("더블 플래너 이벤트") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}        
							if ( xMasTitle.indexOf("2016 스타벅스 플래너") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							} 
							
							if ( xMasTitle.indexOf("크리스마스 프로모션") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							} 	
							if ( xMasTitle.indexOf("크리스마스") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							} 	
							
							if ( xMasTitle.indexOf("피지오 수상 기념 이벤트") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							} 
							
							
							if ( xMasTitle.indexOf("기어S2 런칭") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							} 
							
														
							if ( xMasTitle.indexOf("프리퀀시 Star Dash 이벤트") > -1) {
								//console.log(xMasTitle);
								//console.log(message_title);
								xMasTitle = xMasTitle.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
								message_title = message_title.replace("프리퀀시 Star Dash 이벤트", "5 DAYS, 5 STARS!");
							}
							
							if ( xMasTitle.indexOf("5 DAYS, 5 STARS!") > -1 )
							{
								styleSet = 'style="color:#ff0000"';
							}							
        					
        					evtDisplayHtml += '<p '+styleSet+' class="plan last"><img src="'+$.calendar.convertCategoryImg(message_category, "", message_title)+'" alt=""> '+message_title+'</p>';
        					evtDisplayHtml += '<ul class="detail">';
        					evtDisplayHtml += '		<li><a href="javascript:void(0);" class="myp" data-category="'+message_type+'" data-index="'+message_index+'">상세보기</a></li>';
        					evtDisplayHtml += '</ul>';        
							
	
        				}
    				}
    			}  
    		}
    		return evtDisplayHtml;
    	}
    	,
    	convertCategoryImg : function(category, seq, title)
    	{
    		var imgStr = "";
    		switch( category )
    		{
    			case "A" :  imgStr = "/common/img/util/cal/cal_icon08.png";    break;		//구매관련
    			case "B" :  imgStr = "/common/img/util/cal/cal_icon03.png";    break;		//우수회원 관련
    			
    			case "C" :
    				
					if ( title.indexOf("2016 스타벅스 플래너") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}					
					else if ( title.indexOf("메리 사이렌 오더 데이") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}
					else if ( title.indexOf("더블 플래너 이벤트") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}
					
					else if ( title.indexOf("크리스마스") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}		
					else if ( title.indexOf("피지오 수상 기념 이벤트") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}	
					
					else if ( title.indexOf("기어S2 런칭") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}	
					else if ( title.indexOf("5 DAYS, 5 STARS!") > -1 )
					{
						imgStr = "/common/img/util/cal/cal_xmas.png";
					}				
					else
					{
						imgStr = "/common/img/util/cal/cal_icon05.png";
					}
    				
    				
					    
					break;		//이벤트 관련
					
					
    			case "D" :  imgStr = "/common/img/util/cal/cal_icon10.png";    break;
    			case "E" :  imgStr = "/common/img/util/cal/cal_icon01.png";    break;
    			case "F" :  imgStr = "/common/img/util/cal/cal_icon07.png";    break;
    			case "G" :  imgStr = "/common/img/util/cal/cal_icon02.png";    break;
    			case "H" :  imgStr = "/common/img/util/cal/cal_icon04.png";    break;
    			case "I" :  imgStr = "/common/img/util/cal/cal_icon09.png";    break;
    			case "J" :  imgStr = "/common/img/util/cal/cal_icon06.png";    break;
    			case "K" :  imgStr = "/common/img/util/cal/cal_icon11.png";    break;    			
    		}
    		
    		return imgStr;
    	}
    	,
    	returnDateFormat : function(iType, $object)
    	{
    		if (iType=="string")
    		{
    			if ( !!($object) )
    			{
    				return $object.year + "-" + $object.month + "-" + $object.day;
    			}
    			else
    			{
    				return $date.year + "-" + $date.month + "-" + $date.day;
    			}
    			
    		}
    		else if(iType="object")
    		{ 
    			if ( !!($object) )
    			{
    				return  new Date( parseInt($object.year,10), parseInt($object.month,10) - 1, parseInt($object.day,10), 0, 0, 0);
    			}
    			else
    			{
    				return  new Date( parseInt($date.year,10), parseInt($date.month,10) - 1, parseInt($date.day,10), 0, 0, 0);
    			}
    			
    			
    		}
    	}
    	,
    	getLastDay : function()
    	{
    		var lastDay = ( new Date( $date.year,  $date.month, 0) ).getDate();    		
    		return lastDay;
    	}
    };
})(jQuery);


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


function setSelectBox()
{
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

function getSelectBoxDay()
{
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