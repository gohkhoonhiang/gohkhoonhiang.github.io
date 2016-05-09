$(document).ready(function() {
	$('a').click(function(){
		$('html, body').animate({
			scrollTop: $( $.attr(this, 'href') ).offset().top
		}, 500);
		return false;
	});
	$('body').scrollspy({ target: '#navbar-example' });
	$('.icon-popover').popover({ trigger: 'hover', placement: 'top' });
	$('#contact-form-submit').click(function(e) {
		e.preventDefault();
		var url = "//docs.google.com/forms/d/16S1tuPQY_g0atfjLNnGxv5vyo3BiWThXoYchwOArXy0/formResponse";
		var data = {
			'entry.976136711': $('#contact-name').val(),
			'entry.1715736389': $('#contact-email').val(),
			'entry.261050291': $('#contact-number').val(),
			'entry.177081687': $('#contact-purpose').val(),
		};
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			data: data,
			statusCode: {
				0: function() {
					console.log("unknown");
				},
				200: function() {
					console.log("success");
					window.location.href = "contact_confirm.html";
				}
			}
		});
	});
});
