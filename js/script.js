var hospital_bills = ["Surgery", "Hospital"];
let incremntv = 0;
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var tv,
	playerDefaults = { autoplay: 0, autohide: 1, modestbranding: 0, rel: 0, showinfo: 0, controls: 0, disablekb: 1, enablejsapi: 0, iv_load_policy: 3 };
var vid = [
	{ 'videoId': 'IYxxQUPkS6I', 'startSeconds': 515, 'endSeconds': 690, 'suggestedQuality': 'hd720' },
	{ 'videoId': 'IYxxQUPkS6I', 'startSeconds': 465, 'endSeconds': 657, 'suggestedQuality': 'hd720' },
	{ 'videoId': 'IYxxQUPkS6I', 'startSeconds': 0, 'endSeconds': 240, 'suggestedQuality': 'hd720' },
	{ 'videoId': 'IYxxQUPkS6I', 'startSeconds': 19, 'endSeconds': 241, 'suggestedQuality': 'hd720' }
],
	randomVid = Math.floor(Math.random() * vid.length),
	currVid = randomVid;


function onYouTubePlayerAPIReady() {
	tv = new YT.Player('tv', { events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }, playerVars: playerDefaults });
}

function onPlayerReady() {
	tv.loadVideoById(vid[currVid]);
	tv.mute();
}

function onPlayerStateChange(e) {
	if (e.data === 1) {
		$('#tv').addClass('active');
		$('.hi em:nth-of-type(2)').html(currVid + 1);
	} else if (e.data === 2) {
		$('#tv').removeClass('active');
		if (currVid === vid.length - 1) {
			currVid = 0;
		} else {
			currVid++;
		}
		tv.loadVideoById(vid[currVid]);
		tv.seekTo(vid[currVid].startSeconds);
	}
}

function vidRescale() {

	var w = $(window).width() + 200,
		h = $(window).height() + 200;

	if (w / h > 16 / 9) {
		tv.setSize(w, w / 16 * 9);
		$('.tv .screen').css({ 'left': '0px' });
	} else {
		tv.setSize(h / 9 * 16, h);
		$('.tv .screen').css({ 'left': -($('.tv .screen').outerWidth() - w) / 2 });
	}
}

(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};

		return $(this).each(function () {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from: $(this).data('from'),
				to: $(this).data('to'),
				speed: $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals: $(this).data('decimals')
			}, options);

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// initialize the element with the starting value
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof (settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof (settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));
function removeLoader() {
	$("#loadingDiv").fadeOut(500, function () {
		// fadeOut complete. Remove the loading div
		$("#loadingDiv").remove(); //makes page more lightweight 
	});
}
function initialLoadAjax(url, data, callback) {
	$.ajax({
		url: url,
		type: "POST",
		dataType: "json",
		data: { "data": data },
		success: function (result) {

			return callback(result, null);
		}, error: function (err) {

			return callback(null, err);
		}, beforeSend: function () {

		}
	});

}

function initiateAjax(url, data, callback) {
	$.ajax({
		url: url,
		type: "POST",
		dataType: "json",
		data: { "data": data },
		success: function (result) {
			return callback(result, null);
		}, error: function (err) {
			return callback(null, err);
		}
	});

}
jQuery(function ($) {

	var surgicaltype;
	$("button.backfront").click(function () {
		var bills = hospital_bills;
		if (bills[0] == "Surgery" && bills[1] == "Hospital") {
			var surgerySearch = $("input#SurgerySearch");
			var surgerySearchv = surgerySearch.val();
			surgicaltype = $("input#speciality-1").val();
			var hospital = $("input#hospital-1").val();
			var doctor = $("input#doctor-1").val();

			// alert(hospital+"=>"+doctor+"=>"+surgerySearchv+"=>"+surgicaltype);
			if (surgerySearchv && surgicaltype && (hospital == "" || hospital == null) && (doctor == "" || doctor == null)) {
				initiateAjax("/SearchSurgeryH", { surgery: surgerySearchv, type: surgicaltype }, function (data, err) {
					$("ul.context-choice-tabs li:eq(1)").text(surgicaltype);

					$("ul.context-choice-tabs li").each(function (i) {
						len = $(this).text().trim().length;

						if (len > 10) {
							$(this).text($(this).text().substr(0, 10) + '...');
						}
					});


					surgerySearch.css({ "border": "1px solid #7f8c8d" });
					$("div.form-flows-1").hide();
					$("div.form-flows-2").show();
					$("div.form-flows-3").hide();
					$("div.form-flows-4").hide();
					$("ul.context-choice-tabs").next().removeClass("active-1");
					$("ul.context-choice-tabs").next().removeClass("active-2");
					$("ul.context-choice-tabs").next().removeClass("active-3");
					$("ul.context-choice-tabs").next().removeClass("active-4");
					$("ul.context-choice-tabs").next().addClass("active-3");
					$('input#hospital-1').autoComplete({
						minChars: 1,
						source: function (term, suggest) {
							var choices = data;
							var matches = [];
							for (i = 0; i < choices.length; i++)
								if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
							suggest(matches);
						}, onSelect: function (e, term, item) {
							if (term)
								$("button.backfront").click();
							$("div.autocomplete-suggestions ").hide()
						}
					});
					if (data.length == 1)
						$("button.backfront").click();
				})

			} else if (surgerySearchv && surgicaltype && hospital && (doctor == "" || doctor == null)) {
				initiateAjax("/SearchSurgerySpecDoctor", { type: surgicaltype }, function (data, err) {
					$('input#doctor-1').autoComplete({
						minChars: 1,
						source: function (term, suggest) {
							var choices = data;
							var matches = [];
							for (i = 0; i < choices.length; i++)
								if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
							suggest(matches);
						}, onSelect: function (e, term, item) {
							if (term)
								$("button.backfront").click();
							$("div.autocomplete-suggestions ").hide()
						}
					});
					surgerySearch.css({ "border": "1px solid #7f8c8d" });
					$("ul.context-choice-tabs").next().removeClass("active-1");
					$("ul.context-choice-tabs").next().removeClass("active-2");
					$("ul.context-choice-tabs").next().removeClass("active-3");
					$("ul.context-choice-tabs").next().removeClass("active-4");
					$("ul.context-choice-tabs").next().addClass("active-4");
					$("ul.context-choice-tabs li:eq(2)").text(hospital);


					$("ul.context-choice-tabs li").each(function (i) {
						len = $(this).text().trim().length;

						if (len > 10) {
							$(this).text($(this).text().substr(0, 10) + '...');
						}
					});


					// let html = '<ul class="nav nav-pills red" style="margin-bottom:10px;">';
					// let incrm = 0;
					// data.forEach((item) => {
					// 	if (incrm == 0) {
					// 		html += `<li class="active"><a data-toggle="pill" style="margin-right:5px;" href="#home${incrm}">${item.Statistics}</a></li>
					// 	 `;
					// 	}
					// 	else if (incrm != 0) {
					// 		html += `<li><a data-toggle="pill" style="margin-right:5px;" href="#home${incrm}">${item.Statistics}</a></li>
					// 		`;
					// 	}
					// 	incremntv++;
					// 	incrm++;
					// })
					// html += `</ul><div class="tab-content">`;
					// let incrm1 = 0;
					// data.forEach((item, index) => {
					// 	if (incrm1 == 0) {
					// 		html += `<div id="home${incrm1}" class="tab-pane fade in active">
					// 		<table class="table table-bordered" style="word-wrap:break-word">`;
					// 		for (prop in item) {
					// 			if (prop != "_id" && prop != "HOSPITAL" && prop && prop != "Operation" && prop != "TYPE" && prop != "Statistics")
					// 				html += `<tr><td><b>${prop}</b></td><td>${item[prop]}</td></tr>`;
					// 		}
					// 		html += `</table></div>`;
					// 	}
					// 	else if (incrm1 != 0) {
					// 		html += `<div id="home${incrm1}" class="tab-pane fade">
					// 		<table class="table table-bordered"  style="word-wrap:break-word">`;
					// 		for (prop in item) {
					// 			if (prop != "_id" && prop != "HOSPITAL" && prop && prop != "Operation" && prop != "TYPE" && prop != "Statistics")
					// 				html += `<tr><td><b>${prop}</b></td><td>${item[prop]}</td></tr>`;
					// 		}
					// 		html += `</table></div>`;

					// 	}
					// 	incremntv++;
					// 	incrm1++;
					// })
					// html += `</div>`


					$("div.form-flows-1").hide();
					$("div.form-flows-3").show();
					$("div.form-flows-2").hide();
					$("div.form-flows-4").hide();

				})
			} else if (surgerySearchv && surgicaltype && hospital && doctor) {
				$("div.form-flows-1").hide();
				$("div.form-flows-4").show();
				$("div.form-flows-3").hide();
				$("div.form-flows-2").hide();
				$("div.context-tabs-mask").addClass("different-box");
				$("div.static-hph").addClass("static-ph");
				$("ul.context-choice-tabs li:eq(3)").text(doctor);
				$("ul.context-choice-tabs").next().removeClass("active-1");
				$("ul.context-choice-tabs").next().removeClass("active-2");
				$("ul.context-choice-tabs").next().removeClass("active-3");
				$("ul.context-choice-tabs").next().removeClass("active-4");
			}
			$("ul.context-choice-tabs li").each(function (i) {
				len = $(this).text().trim().length;
				if (len > 10) {
					$(this).text($(this).text().substr(0, 10) + '...');
				}
			});
		}
	});

	$("button.frontback").click(function () {
		var parentele = $(this).parent();
		parentele.hide();
		$("ul.context-choice-tabs").next().removeClass("active-1");
		$("ul.context-choice-tabs").next().removeClass("active-2");
		$("ul.context-choice-tabs").next().removeClass("active-3");
		$("ul.context-choice-tabs").next().removeClass("active-4");
		if (parentele.prev().html() == undefined) {
			$("div.form-flows").hide()
			$("input#SurgerySearch").show();
			$("button#SurgerySearchButton").show()
			$("ul.context-choice-tabs").next().addClass("active-1");
			return;
		}
		if (parentele.prev().hasClass("form-flows-1")) {
			$("ul.context-choice-tabs").next().addClass("active-2");
		}
		if (parentele.prev().hasClass("form-flows-2")) {
			$("ul.context-choice-tabs").next().addClass("active-3");

		}
		if (parentele.prev().hasClass("form-flows-3")) {
			$("div.static-hph").removeClass("static-ph");
			$("div.context-tabs-mask").removeClass("different-box")
			$("ul.context-choice-tabs").next().addClass("active-4");

		}

		parentele.prev().show();
	})
	$('.selectpicker').selectpicker({
		style: 'btn-default redbutton',
		size: 4
	});

	$("button#SurgerySearchButton").click(function () {

		$("div.form-flows-2").hide()
		$("div.form-flows-3").hide()
		$("div.form-flows-4").hide();
		var bills = hospital_bills[0];
		if (bills == "Surgery") {
			var surgerySearch = $("input#SurgerySearch");
			var surgerySearchv = surgerySearch.val()
			if (surgerySearchv) {
				$("input#SurgerySearch").hide();
				$("button#SurgerySearchButton").hide()
				$("ul.context-choice-tabs").next().removeClass("active-1");
				$("ul.context-choice-tabs").next().removeClass("active-2");
				$("ul.context-choice-tabs").next().removeClass("active-3");
				$("ul.context-choice-tabs").next().removeClass("active-4");
				$("ul.context-choice-tabs").next().addClass("active-2");
				initiateAjax("/SearchSurgery", surgerySearchv, function (data, err) {
					surgerySearch.css({ "border": "1px solid #7f8c8d" });
					let html = '';
					$("div.form-flows").show()
					$("div.form-flows-1").show()
					$('input#speciality-1').autoComplete({
						minChars: 1,
						source: function (term, suggest) {
							var choices = data;
							var matches = [];
							for (i = 0; i < choices.length; i++)
								if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
							suggest(matches);
						}, onSelect: function (e, term, item) {
							if (term)
								$("button#SurgerySearchButton").click();
						}
					});



					if (data.length == 1)
						$("button.backfront").click();
				})

				$("ul.context-choice-tabs li:eq(0)").text(surgerySearchv);
				$("ul.context-choice-tabs li").each(function (i) {
					len = $(this).text().trim().length;
					if (len > 10) {
						$(this).text($(this).text().substr(0, 10) + '...');
					}
				});

			}
			else {
				surgerySearch.css({ "border": "2px solid red" });
			}
		}

	});
	let surgoptions;
	let typeoptions;
	let typehosp;
	let typedoc;

	initialLoadAjax("/getSurgery", '', function (data, err) {
		surgoptions = data;
		$('input#SurgerySearch').autoComplete({
			minChars: 1,
			source: function (term, suggest) {
				var choices = surgoptions;
				var matches = [];
				for (i = 0; i < choices.length; i++)
					if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
				suggest(matches);
			}, onSelect: function (e, term, item) {
				if (term)
					$("button#SurgerySearchButton").click();
			}
		});
		initialLoadAjax("/getType", '', function (data, err) {
			typeoptions = data;
			$('input#SpecialitySearch').autoComplete({
				minChars: 1,
				source: function (term, suggest) {
					var choices = typeoptions;
					var matches = [];
					for (i = 0; i < choices.length; i++)
						if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
					suggest(matches);
				}
			});
			initialLoadAjax("/getHospital", '', function (data, err) {
				typehosp = data;
				$('input#HospitalSearch').autoComplete({
					minChars: 1,
					source: function (term, suggest) {
						var choices = typehosp;
						var matches = [];
						for (i = 0; i < choices.length; i++)
							if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
						suggest(matches);
					}
				});
				initialLoadAjax("/getDoctor", '', function (data, err) {
					typedoc = data;
					$('input#HospitalSearch').autoComplete({
						minChars: 1,
						source: function (term, suggest) {
							var choices = typedoc;
							var matches = [];
							for (i = 0; i < choices.length; i++)
								if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
							suggest(matches);
						}
					});

					removeLoader();


				});
			});
		});
	});



	$('.count-number').data('countToOptions', {
		formatter: function (value, options) {
			return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
		}
	});

	$(window).resize(function () {
		if ($(window).width() <= 600) {
			$('#prop-type-group').removeClass('btn-group');
			$('#prop-type-group').addClass('btn-group-vertical');
		} else {
			$('#prop-type-group').addClass('btn-group');
			$('#prop-type-group').removeClass('btn-group-vertical');
		}
	});

	// start all the timers
	$('.timer').each(count);

	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}
});
$("input#SurgerySearch").change(function () {
	$("button#SurgerySearchButton").click();
})

$(function () {
	$('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
	$("div.easy-autocomplete-container").addClass("style-4");
	$("a.contribute-medical-bill").click(function () {
		$("div.context-tabs-mask h1").text("Contribute medical bill info annoymously");
	})
	$("a.contribute-reset-bill").click(function () {
		$("div.context-tabs-mask h1").text("How much hospital treatment costed?");
	})
	$("a.navbar").click(function () {
		$("div#navbar-drawer-mask").toggle();
		$("div.strikingly-nav-transition").toggleClass("translate");
		$("div.navbar-drawer-bar").toggleClass("drawer-open");
	});
	$("form#surgery-form input#SurgerySearch").show();
	$("form#surgery-form input#SpecialitySearch").hide();
	$("form#surgery-form input#DoctorSearch").hide();
	$("form#surgery-form input#HospitalSearch").hide();
	$("ul.context-choice-tabs li").click(function () {
		$("div.context-tabs-mask h1").text('How much hospital treatment costed?');
		$("ul.context-choice-tabs li").removeClass("active-context");
		$("div.form-flows").hide();
		$(this).addClass("active-context");
		var arrowbox = $("ul.context-choice-tabs").next();
		$("div.form-flows").hide();
		$("div.form-flows-1").hide();
		$("div.form-flows-2").hide();
		$("div.form-flows-3").hide();
		$("input#SurgerySearch").hide();
		$("form#surgery-form input#SpecialitySearch").hide();
		$("form#surgery-form input#DoctorSearch").hide();
		$("form#surgery-form input#HospitalSearch").hide();
		$("input").val('')
		$("div.static-hph").removeClass("static-ph");
		$("div.context-tabs-mask").removeClass("different-box")
		arrowbox.removeClass("active-1");
		arrowbox.removeClass("active-2");
		arrowbox.removeClass("active-3");
		arrowbox.removeClass("active-4");


		if ($(this).data('type') == "Hospital") {
			$("ul.context-choice-tabs").next().addClass("active-3");
			$("button#SurgerySearchButton").show()
			$("form#surgery-form input#HospitalSearch").show();

			hospital_bills[0] = "Hospital";
			hospital_bills[1] = "Surgery";

		}
		else if ($(this).data('type') == "Surgery") {
			$("ul.context-choice-tabs li:eq(0)").text('Surgery');
			$("ul.context-choice-tabs li:eq(1)").text('Speciality');
			$("ul.context-choice-tabs li:eq(2)").text('Hospital');
			$("ul.context-choice-tabs li:eq(3)").text('Doctor');
			$("input#SurgerySearch").show();
			$("button#SurgerySearchButton").show()
			$("ul.context-choice-tabs").next().addClass("active-1")

			hospital_bills[0] = "Surgery";
		}
		else if ($(this).data('type') == "Speciality") {
			$("ul.context-choice-tabs").next().addClass("active-1")
			$("ul.context-choice-tabs li:eq(0)").text('Speciality');
			$("ul.context-choice-tabs li:eq(1)").text('Surgery');
			$("ul.context-choice-tabs li:eq(2)").text('Hospital');
			$("ul.context-choice-tabs li:eq(3)").text('Doctor');
			$("form#surgery-form input#SpecialitySearch").show();
			$("button#SurgerySearchButton").show()
			hospital_bills[0] = "Speciality";
			hospital_bills[1] = "Hospital";
		}
		else if ($(this).data('type') == "Doctor") {
			$("form#surgery-form input#DoctorSearch").show();
			$("button#SurgerySearchButton").show()
			$("ul.context-choice-tabs").next().addClass("active-4")
			hospital_bills[0] = "Doctor";
		}

	})

})
$(window).on('load resize', function () {
	vidRescale();
});


