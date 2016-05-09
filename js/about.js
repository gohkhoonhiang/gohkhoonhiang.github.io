$(document).ready(function() {
	$('a').click(function(){
		$('html, body').animate({
			scrollTop: $( $.attr(this, 'href') ).offset().top
		}, 500);
		return false;
	});
	$('body').scrollspy({ target: '#navbar-example' });
	$('.icon-popover').popover({ trigger: 'hover', placement: 'top' });
        $('.help-block').hide();
	$('#contact-form-submit').click(function(e) {
		e.preventDefault();
                var contactName = $('#contact-name').val();
                var contactEmail = $('#contact-email').val();
                var contactNumber = $('#contact-number').val();
                var contactPurpose = $('#contact-purpose').val();
                if (!contactName) {
                    $('#contact-name-error').html("I would love to know who you are. Perhaps you could leave your name?");
                    $('#contact-name-error').show();
                    $('#contact-name').parent().addClass("has-error");
                    return;
                } else {
                    $('#contact-name-error').html("");
                    $('#contact-name-error').hide();
                    $('#contact-name').parent().removeClass("has-error");
                }
                if (!contactEmail && !contactNumber) {
                    $('#contact-email-error').html("I would love to know how to get back to you. Your email will be much appreciated.");
                    $('#contact-email-error').show();
                    $('#contact-email').parent().addClass("has-error");
                    $('#contact-number-error').html("Or if you could allow me to contact you through the phone.");
                    $('#contact-number-error').show();
                    $('#contact-number').parent().addClass("has-error");
                    return;
                } else {
                    $('#contact-email-error').html("");
                    $('#contact-email-error').hide();
                    $('#contact-email').parent().removeClass("has-error");
                    $('#contact-number-error').html("");
                    $('#contact-number-error').hide();
                    $('#contact-number').parent().removeClass("has-error");
                }
                if (!contactPurpose) {
                    $('#contact-purpose-error').html("I'm eager to learn first-hand what you might want to share!");
                    $('#contact-purpose-error').show();
                    $('#contact-purpose').parent().addClass("has-error");
                    return;
                } else {
                    $('#contact-purpose-error').html("");
                    $('#contact-purpose-error').hide();
                    $('#contact-purpose').parent().removeClass("has-error");
                }
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
					window.location.href = "contact_confirm/index.html";
				},
				200: function() {
					console.log("success");
					window.location.href = "contact_confirm/index.html";
				}
			}
		});
	});
        $('.form-control').change(function() {
            if (($(this).attr('id') == "contact-email" && $(this).val()) || ($(this).attr('id') == "contact-number" && $(this).val())) {
                console.log($(this));
                $('#contact-email').next('.help-block').html("");
                $('#contact-email').next('.help-block').hide();
                $('#contact-email').parent().removeClass("has-error");
                $('#contact-number').next('.help-block').html("");
                $('#contact-number').next('.help-block').hide();
                $('#contact-number').parent().removeClass("has-error");
            }
            else if ($(this).val()) {
                $(this).next('.help-block').html("");
                $(this).next('.help-block').hide();
                $(this).parent().removeClass("has-error");
            }
        });
});
