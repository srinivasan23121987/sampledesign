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
	$("button.btn-next").click(function () {
		var bills = hospital_bills;
		if (bills[0] == "Surgery" && bills[1] == "Hospital") {
			var surgerySearch = $("input#SurgerySearch");
			var surgerySearchv = surgerySearch.val();
			var surgicaltype=$("#myModal").find("fieldset:eq(0) div.form-group div.buying-selling-group input[type='radio']:checked").val();
			alert(surgicaltype);

		}

	});
	$("button#SurgerySearchButton").click(function () {
		var bills = hospital_bills[0];
		if (bills == "Surgery") {
			var surgerySearch = $("input#SurgerySearch");
			var surgerySearchv = surgerySearch.val()
			if (surgerySearchv) {
				initiateAjax("/SearchSurgery", surgerySearchv, function (data, err) {
					console.log(data)
					surgerySearch.css({ "border": "1px solid #7f8c8d" });
					$("#myModal").modal('show');
					let html = '';
					data.forEach((item) => {
						html += `<label class="btn btn-default buying-selling">
						<input type="radio" name="options" value="${item.name}" id="option${incremntv}" autocomplete="off" required>
						<span class="radio-dot"></span>
						<span class="buying-selling-word">${item.name}</span>
					</label>`;
						incremntv++;
					})

					$("#myModal").find("fieldset:eq(0) div.form-group div.buying-selling-group").html(html)
				})

			} 
			else {
				surgerySearch.css({ "border": "2px solid red" });
			}
		}

	});
	var surgoptions = {
		url: "/getSurgery",
		ajaxSettings: {
			dataType: "json",
			method: "POST",
			data: {
				dataType: "json"
			}
		},
		list: {
			maxNumberOfElements: 8,
			match: {
				enabled: true
			}, sort: {
				enabled: true
			}
		},

		getValue: "name",
		requestDelay: 400,
		theme: "square"
	};
	var specoptions = {

		url: "/getType",

		getValue: "name",
		ajaxSettings: {
			dataType: "json",
			method: "POST",
			data: {
				dataType: "json"
			}
		},
		list: {
			maxNumberOfElements: 8,
			match: {
				enabled: true
			}, sort: {
				enabled: true
			}
		},

		theme: "square",
		requestDelay: 400
	};
	var hospoptions = {

		url: "/getHospital",

		getValue: "name",
		ajaxSettings: {
			dataType: "json",
			method: "POST",
			data: {
				dataType: "json"
			}
		},
		list: {
			maxNumberOfElements: 8,
			match: {
				enabled: true
			}, sort: {
				enabled: true
			}
		},

		theme: "square",
		requestDelay: 400
	};
	var docoptions = {

		url: "/getDoctor",

		getValue: "name",
		ajaxSettings: {
			dataType: "json",
			method: "POST",
			data: {
				dataType: "json"
			}
		},
		list: {
			maxNumberOfElements: 8,
			match: {
				enabled: true
			}, sort: {
				enabled: true
			}
		},

		theme: "square",
		requestDelay: 400
	};

	$("input#SurgerySearch").easyAutocomplete(surgoptions);
	$("input#SurgerySearchs").easyAutocomplete(surgoptions);
	$("input#SpecialitySearch").easyAutocomplete(specoptions);
	$("input#SpecialitySearchs").easyAutocomplete(specoptions);
	$("input#HospitalSearch").easyAutocomplete(hospoptions);
	$("input#HospitalSearchs").easyAutocomplete(hospoptions);
	$("input#DoctorSearch").easyAutocomplete(docoptions);
	$("input#DoctorSearchs").easyAutocomplete(docoptions);
	// custom formatting example


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
$(function () {
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
	$("form#surgery-form div input#SurgerySearch").parent().show();
	$("ul.context-choice-tabs li").click(function () {
		$("ul.context-choice-tabs li").removeClass("active-context");
		$(this).addClass("active-context");
		var arrowbox = $("ul.context-choice-tabs").next();
		arrowbox.removeClass("active-1");
		arrowbox.removeClass("active-2");
		arrowbox.removeClass("active-3");
		arrowbox.removeClass("active-4");
		$("form#surgery-form div input#DoctorSearch,form#surgery-form div input#SpecialitySearch,form#surgery-form div input#HospitalSearch,form#surgery-form div input#SurgerySearch").parent().hide();
		if ($(this).text().trim() == "Hospital") {
			$("ul.context-choice-tabs").next().addClass("active-3");
			$("form#surgery-form div input#HospitalSearch").parent().show();
			hospital_bills[0] = "Hospital";
			hospital_bills[1] = "Surgery";

		}
		else if ($(this).text().trim() == "Surgery") {
			$("ul.context-choice-tabs").next().addClass("active-1")
			$("form#surgery-form div input#SurgerySearch").parent().show();
			hospital_bills[0] = "Surgery";
		}
		else if ($(this).text().trim() == "Speciality") {
			$("ul.context-choice-tabs").next().addClass("active-2")
			$("form#surgery-form div input#SpecialitySearch").parent().show();
			hospital_bills[0] = "Speciality";
			hospital_bills[1] = "Hospital";
		}
		else if ($(this).text().trim() == "Doctor") {
			$("form#surgery-form div input#DoctorSearch").parent().show();
			$("ul.context-choice-tabs").next().addClass("active-4")
			hospital_bills[0] = "Doctor";
		}
		alert(hospital_bills[0]);
	})

})
$(window).on('load resize', function () {
	vidRescale();
});


