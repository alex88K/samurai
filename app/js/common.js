$(function() {

	// NAV - change fill for SVG on hover 

	$('.dropdown-item').hover(function(e) {
		var el = $(this).find(".dropdown-i");
		var elSrc = el.attr('src');

		if (el.length) {
			el.attr('src', elSrc.replace(".svg", "-h.svg"));
		}
	}, function(e) {
		var el = $(this).find(".dropdown-i");
		var elSrc = el.attr('src');

		if (el.length) {
			el.attr('src', elSrc.replace("-h.svg", ".svg"));
		}
	});

	// Stylized Scrollbar

	$(".mCustomScrollbar").mCustomScrollbar();


	// NAV

	$('.js-navbar-collapse').click(function() {
      $('#js-navbar-toggle-button').toggleClass("collapsed active");
      $('#js-navbar-collapse').toggleClass('in');
      if ($('#js-navbar-collapse').hasClass('in')) {
          $('html').css({
              overflow: 'hidden'
          });
      } else {
          $('html').css({
              overflow: 'auto'
          });
      }
  });

	$(".navbar .close-btn").on("click", function() {
		$(".navbar-toggler, .navbar").removeClass("active");
		$("body").removeClass("nav-opened");
		$(".navbar-collapse").removeClass("show");
	});


	// Modals 

	$(".js-modals").click(function() {
		$('.modal.in').modal('hide');
		$(this).closest('.modal').modal('toggle');
	});


	$('.js-extended-dish').click(function(event) {
		$('#' + $(this).data('item-id')).modal('show');
	});

	
});



// load SVG-Sprite to LocalStorage

;( function( window, document ) {
	'use strict';

	var file     = 'img/sprite.svg',
	revision = 2;

	if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
		return true;

	var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
	request,
	data,
	insertIT = function()
	{
		document.body.insertAdjacentHTML( 'afterbegin', data );
	},
	insert = function()
	{
		if( document.body ) insertIT();
		else document.addEventListener( 'DOMContentLoaded', insertIT );
	};

	if( isLocalStorage && localStorage.getItem( 'inlineSVGrev' ) == revision )
	{
		data = localStorage.getItem( 'inlineSVGdata' );
		if( data )
		{
			insert();
			return true;
		}
	}

	try
	{
		request = new XMLHttpRequest();
		request.open( 'GET', file, true );
		request.onload = function()
		{
			if( request.status >= 200 && request.status < 400 )
			{
				data = request.responseText;
				insert();
				if( isLocalStorage )
				{
					localStorage.setItem( 'inlineSVGdata',  data );
					localStorage.setItem( 'inlineSVGrev',   revision );
				}
			}
		}
		request.send();
	}
	catch( e ){}

}( window, document ) );


/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  return false;
}