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

jQuery(function ($) {
	var options = {

		url: "/js/jsondata.json",
	  
		getValue: "name",
		theme: "square"
	  };
	  
	  $("#LocationSearch").easyAutocomplete(options);
	  
	// custom formatting example
	$('.count-number').data('countToOptions', {
		formatter: function (value, options) {
			return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
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
	$("a.contribute-medical-bill").click(function () {
		$("div.context-tabs-mask h1").text("Contribute medical bill info annoymously");
	})
	$("a.contribute-reset-bill").click(function () {
		$("div.context-tabs-mask h1").text("How much hospital treatment costed?");
	})
	$("ul.context-choice-tabs li").click(function () {
		$("ul.context-choice-tabs li").removeClass("active-context");
		$(this).addClass("active-context");
		var arrowbox = $("ul.context-choice-tabs").next();
		arrowbox.removeClass("active-1");
		arrowbox.removeClass("active-2");
		arrowbox.removeClass("active-3");
		arrowbox.removeClass("active-4");
		if ($(this).text().trim() == "Hospital") {
			$("ul.context-choice-tabs").next().addClass("active-3")
		}
		else if ($(this).text().trim() == "Surgery") {
			$("ul.context-choice-tabs").next().addClass("active-1")
		}
		else if ($(this).text().trim() == "Speciality") {
			$("ul.context-choice-tabs").next().addClass("active-2")
		}
		else if ($(this).text().trim() == "Doctor") {
			$("ul.context-choice-tabs").next().addClass("active-4")
		}
	})
})
$(window).on('load resize', function () {
	vidRescale();
});


