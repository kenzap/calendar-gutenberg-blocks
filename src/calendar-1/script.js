jQuery(function ($) {
	"use strict";

	// initialize calendar listeners
	var calendar = $(".kenzap .kenzap-booking-form-1 .owl-carousel").owlCarousel({
		autoplay: false,
		loop: false,
		margin: 0,
		dots: false,
		mouseDrag:false,
		slideBy: 1,
		nav: false,
		responsive: {
			0:{
				items:1
			},
			600:{
				items:1
			},
			1200:{
				items:1
			}
		}
	});

	// owl carousel listeners
	calendar.on('changed.owl.carousel', function(event) {
		
		if(event.type=='changed')
			setCalDefaults();
		console.log(event);
	})

	var dt = "", date = "", dow = "", date_full = "";
	$(".kenzap .kenzap-booking-form-1 a,.kenzap .kenzap-booking-form-1 button").on("click", function(){
		
		// calendar right click/swipe
		if ($(this).hasClass("month-next")) { 
			calendar.trigger('next.owl.carousel');
			return false;
		}
		
		// calendar left click/swipe
		if ($(this).hasClass("month-prev")) { 
			calendar.trigger('prev.owl.carousel');
			return false
		}

		if ($(this).hasClass("available")) { 
			$(".kenzap .kenzap-booking-form-1 .calendar-box .calendar-body ul li .selected").removeClass("selected").addClass("available");
			$(this).addClass('selected');
		}
		
		if ($(this).hasClass("time-available")) { 
			$(".kenzap .kenzap-booking-form-1 .calendar-box .calendar-footer ul li .time-selected").removeClass("time-selected").addClass("time-available");
			$(this).addClass('time-selected');
		}

		if ($(this).hasClass("cal-day")) {

			// check booking slot availabity
			var cid = $(".kenzap .kenzap-booking-form-1").data('cid');
			var ym = $(this).parent().attr('data-ym');
			dt = parseInt($(this).parent().attr('data-dt'));
			date = $(this).parent().attr('data-date');
			dow = $(this).parent().attr('data-dow');
			date_full = $(this).parent().attr('data-full');

			$("#cal_dow").html(dow);
			$("#cal_date_time").html(date_full).attr('data-full',date_full);

			// get previous booking details to restrict timeslots if exceeds max booking number
			getBookings(cid+"_"+ym);

			// cache in cookies for checkout
			createCookie("kenzap_booking_month_id",cid+"_"+ym,1);
			createCookie("kenzap_booking_day",$(this).html(),1);
			createCookie("kenzap_booking_date",date,1);

			// remove CTA
			$(".booking-btn").remove();	
		}

		if ($(this).hasClass("cal-time")) { 

			// get woo product details 
			var cid = $(".kenzap .kenzap-booking-form-1").data('cid');
			var product_id = $(".kenzap .kenzap-booking-form-1").data('product');
			var product_id_time = $(this).parent().attr('data-product');
			var $btn_cont = $(".btn-cont");

			if(product_id_time.length>0) { product_id = product_id_time; }
			
			if(product_id!=""){

				// prepare CTA NEXT button
				if($btn_cont.data('type') == 'simple'){
					$btn_cont.html('<a class="booking-btn" href="'+$btn_cont.data('url')+'?quantity=1&add-to-cart='+product_id+'" data-quantity="1" data-product_id="'+product_id+'" data-product_sku="" >'+$btn_cont.data('text')+'</a>');
				}else{
					$btn_cont.html('<a class="booking-btn" href="'+$(this).parent().attr('data-url')+'?quantity=1&add-to-cart='+product_id+'" data-quantity="1" data-product_id="'+product_id+'" data-product_sku="" >'+$btn_cont.data('text')+'</a>');
				}
				getProduct(product_id);
			}

			// get variables
			var id = $(this).parent().attr('data-id');
			var max = $(this).parent().attr('data-max');
			var desc = $(this).parent().attr('data-desc');
			var feat = $(this).parent().attr('data-feat').split("\n");
			createCookie("kenzap_calendar_id",cid,1);
			createCookie("kenzap_booking_time_id",id,1);
			createCookie("kenzap_booking_time_max",max,1);
			createCookie("kenzap_booking_time",$(this).html(),1);

			// structure feature list into html
			var featF = '';
			$.each(feat, function(v){ featF += ((feat[v]!="")?'<li>'+feat[v]+'</li>':'');});

			// populatge right pane
			$("#product_desc").html(desc);
			$("#product_feat").html(featF);
			$("#cal_date_time").html($("#cal_date_time").attr('data-full')+' <span>'+$(this).html()+'</span>');
		}
	});

	function setCalDefaults(){

		$(".booking-btn").fadeOut();
		$("#cal_dow").html($("#cal_dow").data("def"));
		$("#cal_date_time").html($("#cal_date_time").data("def"));
		$(".kenzap .kenzap-booking-form-1 .calendar-box .calendar-footer ul li .time-selected").removeClass("time-selected");
		dt = date = dow = date_full = "";
		$('.kenzap .calendar-footer ul li').fadeOut(0);
	}

	function getBookings(id){
   
		//perform ajax request
		$.ajax({
			type: 'POST',
			dataType: 'html',
			url: kenzapCalendar.ajaxurl,
			data: {
			  'id': id,
			  'action': 'kenzap_calendar_get_dates'
			},
			beforeSend : function () {

			},
			success: function (data) {

				if (data.length) {
					
					var total = 0;
					var bookings = JSON.parse(data);
					var amount_of_bookings = bookings[readCookie("kenzap_booking_day")];
					if (typeof(amount_of_bookings)==="undefined"){ amount_of_bookings = 0; }
					
					// filter and view timeslots that match with calendar time
					$('.kenzap .calendar-footer ul li').fadeOut(0);
					$('.kenzap .calendar-footer ul li').filter(function(){
		
						var res = (parseInt($(this).attr('data-ds')) <= dt && dt <= parseInt($(this).attr('data-de')));
						if(res) total++;
						return res;
					}).fadeIn(0).children('button').removeClass("not-available").removeClass("time-selected").addClass("time-available");

					// hide time slots that exceed max booking number
					$('.kenzap .calendar-footer ul li').filter(function(){

						return (parseInt($(this).attr('data-max')) <= amount_of_bookings[$(this).attr('data-id')]);
					}).children('button').addClass("not-available").removeClass("time-available").removeClass("time-selected");//.fadeOut(0); 

					// if no free timeslots view notifications
					if(total==0){ $(".calendar-footer-no").fadeIn();}else{$(".calendar-footer-no").fadeOut(0);}
				
				// something wrong no data loaded from backends
				} else {

					$(".calendar-footer-no").html("Somethig went wrong. Please reload the page or try again later.").fadeIn();
				}

			},
			error : function (jqXHR, textStatus, errorThrown) {

				$(".calendar-footer-no").html("Somethig went wrong. Please reload the page or try again later.").fadeIn();
			},
		});
		return false;
	}

	//var bookingsAjax = '';
	function getProduct(id){

		//perform ajax request
		$.ajax({
			type: 'POST',
			dataType: 'html',
			url: kenzapCalendar.ajaxurl,
			data: {
				'id': id,
				'action': 'kenzap_calendar_get_product'
			},
			beforeSend : function () {

			},
			success: function (data) {
	
				if (data.length) {

					var data_js = JSON.parse(data);
					$("#product_title").html(data_js['title']);
					$("#product_price").html(data_js['price']);
				}
			},
			error : function (jqXHR, textStatus, errorThrown) {

				$(".calendar-footer-no").html("Somethig went wrong. Please reload the page or try again later.").fadeIn();
			},
		});
		return false;
	}  
		
	function createCookie(name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	}

	function readCookie(name) {

		var nameEQ = encodeURIComponent(name) + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
		}
		return null;
	}
});
	
