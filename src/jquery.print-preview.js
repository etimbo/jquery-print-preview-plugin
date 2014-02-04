/*!
 * jQuery Print Preview Plugin v1.0.1
 *
 * Copyright 2011, Tim Connell
 * Licensed under the GPL Version 2 license
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Date: Wed Jan 25 00:00:00 2012 -000
 *
 * @author Ezra Pool <ezra@creativemonkeys.nl>
 * @version 1.0.2
 * @since jQuery 1.7
 */

(function ($) {
	// Initialization
	$.fn.printPreview = function () {
		this.each(function () {
			$(this).bind('click', function (e) {
				e.preventDefault();
				if (!$('#print-modal').length) {
					$.printPreview.loadPrintPreview();
				}
			});
		});
		return this;
	};

	// Private functions
	var $mask, size, $print_modal, $print_controls;
	$.printPreview = {
		loadPrintPreview: function () {
			var $print_frame, print_frame_ref, $iframe_head, $iframe_body, starting_position, css;

			// Declare DOM objects
			$print_modal = $('<div id="print-modal"></div>');
			$print_controls = $('<div id="print-modal-controls">' +
				'<a href="#" class="print" title="Print page">Print page</a>' +
				'<a href="#" class="close" title="Close print preview">Close</a>').hide();
			$print_frame = $('<iframe id="print-modal-content" scrolling="no" border="0" frameborder="0" name="print-frame" />');

			// Raise print preview window from the dead, zooooooombies
			$print_modal
				.hide()
				.append($print_controls)
				.append($print_frame)
				.appendTo('body');

			// The frame lives
			print_frame_ref = $print_frame.get(0).contentDocument;

			print_frame_ref.open();
			print_frame_ref.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' +
				'<head><title>' + document.title + '</title></head>' +
				'<body></body>' +
				'</html>');
			print_frame_ref.close();

			// Grab contents and apply stylesheet
			$iframe_head = $('head link[media*=print], head link[media=all]').clone();
			$iframe_body = $('body > *:not(#print-modal)').clone();
			$iframe_head.each(function () {
				$(this).attr('media', 'all');
			});
			if (!$.browser.msie && !($.browser.version < 7)) {
				$('head', print_frame_ref).append($iframe_head);
				$('body', print_frame_ref).append($iframe_body);
			} else {
				$('body > *:not(#print-modal)').clone().each(function () {
					$('body', print_frame_ref).append(this.outerHTML);
				});
				$('head link[media*=print], head link[media=all]').each(function () {
					$('head', print_frame_ref).append($(this).clone().attr('media', 'all')[0].outerHTML);
				});
			}

			// Disable all links
			$('a', print_frame_ref).bind('click.printPreview', function (e) {
				e.preventDefault();
			});

			// Introduce print styles
			$('head').append('<style type="text/css">' +
				'@media print {' +
				'/* -- Print Preview --*/' +
				'#print-modal-mask,' +
				'#print-modal {' +
				'display: none !important;' +
				'}' +
				'}' +
				'</style>'
				);

			// Load mask
			$.printPreview.loadMask();

			// Disable scrolling
			$('body').css({
				overflowY: 'hidden',
				height: '100%'
			});

			$(print_frame_ref).on('load', 'img', function () {
				$print_frame.height($print_frame.contents().height());
			});

			// Position modal
			starting_position = $(window).height() + $(window).scrollTop();
			css = {
				top:         starting_position,
				height:      '100%',
				overflowY:   'auto',
				zIndex:      10000,
				display:     'block'
			};

			$print_modal
				.css(css)
				.animate({
					top: $(window).scrollTop()
				}, 400, 'linear', function () {
					$print_controls.fadeIn('slow').focus();
				});

			$print_frame.height($print_frame.contents().height());

			// Bind closure
			$('a', $print_controls).bind('click', function (e) {
				e.preventDefault();
				if ($(this).hasClass('print')) {
					window.print();
				} else {
					$.printPreview.destroyPrintPreview();
				}
			});
		},

		destroyPrintPreview: function () {

			$print_controls.fadeOut(100);
			$print_modal.animate({
				top: $(window).scrollTop() - $(window).height(),
				opacity: 1
			}, 400, 'linear', function () {
				$print_modal.remove();
				$('body').css({
					overflowY: 'auto',
					height: 'auto'
				});
			});
			$mask.fadeOut('slow', function () {
				$mask.remove();
			});

			$(document).unbind("keydown.printPreview.mask");
			$mask.unbind("click.printPreview.mask");
			$(window).unbind("resize.printPreview.mask");
		},

		/* -- Mask Functions --*/
		loadMask: function () {
			size = $.printPreview.sizeUpMask();
			$mask = $('<div id="print-modal-mask" />').appendTo($('body'));
			$mask.css({
				position:           'absolute',
				top:                0,
				left:               0,
				width:              size[0],
				height:             size[1],
				display:            'none',
				opacity:            0,
				zIndex:             9999,
				backgroundColor:    '#000'
			});

			$mask.css({
				display: 'block'
			}).fadeTo('400', 0.75);

			$(window).bind("resize.printPreview.mask", function () {
				$.printPreview.updateMaskSize();
			});

			$mask.bind("click.printPreview.mask", function (e) {
				$.printPreview.destroyPrintPreview();
			});

			$(document).bind("keydown.printPreview.mask", function (e) {
				if (e.keyCode === 27) {
					$.printPreview.destroyPrintPreview();
				}
			});
		},

		sizeUpMask: function () {
			if ($.browser.msie) {
				// if there are no scrollbars then use window.height
				var d = $(document).height(), w = $(window).height();
				return [
					window.innerWidth ||						// ie7+
						document.documentElement.clientWidth ||		// ie6
						document.body.clientWidth,					// ie6 quirks mode
					d - w < 20 ? w : d
				];
			} else {
				return [$(document).width(), $(document).height()];
			}
		},

		updateMaskSize: function () {
			var size = $.printPreview.sizeUpMask();
			$mask.css({
				width: size[0],
				height: size[1]
			});
		}
	};
}(jQuery));