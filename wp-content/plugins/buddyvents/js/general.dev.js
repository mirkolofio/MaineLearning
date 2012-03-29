jQuery(document).ready( function() {
	jQuery('.bpe-sorter select').hover(
		function () {
			jQuery('.user-dropdowns').addClass('keep-open');
  		},
		function () {
			jQuery('.user-dropdowns').removeClass('keep-open');
		}
	);
	
	jQuery('.sorter').change(function() {
		window.location.href = jQuery(this).val();
	});
	
	jQuery('.zoomin,.cal-popup').click( function() {
		var link = jQuery(this);
		var id = link.attr('id');
		id = id.split('-');
		id = id[1];
		
		link.addClass('loading');

		jQuery.post( ajaxurl, {
			'_ajax_nonce': bpeGen.nonce,
			'action': 'bpe_fullcalendar_click_calevent',
			'event_id' : id,
			'cookie': encodeURIComponent(document.cookie)
		},
		function(response) {
			if( response == '-1' )
				return false;

			response = jQuery.parseJSON(response);

			jQuery.colorbox({
				html: response.html,
				width: "70%",
				opacity: 0.6,
				onComplete:function(){
					if(parseInt(response.hasLocation) == 1 ) {
						eval( 'map_init' + id +'()' );
					}
				}
			});
			link.removeClass('loading');
		});
		return false;
	});
	
	jQuery('.grid-view .zoomin,.grid-view .grid-date').hide();
	jQuery('.grid-view').hover(function () {
		jQuery(this).children().children('.zoomin').show();
		jQuery(this).children().children('.grid-date').slideDown('fast');
	}, 
	function () {
		jQuery(this).children().children('.zoomin').hide();
		jQuery(this).children().children('.grid-date').slideUp('fast');
	});

	jQuery('.cal-widget-next,.cal-widget-prev').live( 'click', function() {		
		var calType = jQuery(this).attr('class');

		var calId = jQuery(this).parent().parent().attr('id');
		calId = calId.split('-');
		calId = calId[1];

  		var calLoader = jQuery('#bpe_calendar-'+ calId +' h3');
		calLoader.addClass('cal-loading');
		
		var calMonth = jQuery('#current_month_bpe_calendar-'+ calId).val();
		var calYear = jQuery('#current_year_bpe_calendar-'+ calId).val();

		jQuery.post( ajaxurl, {
			'action': 'bpe_cal_widget_get_month',
			'cookie': encodeURIComponent(document.cookie),
			'id': calId,
			'month': calMonth,
			'year': calYear,
			'type': calType
		},
		function(response) {
			response = jQuery.parseJSON(response);
			if(response.type == 'success') {
				jQuery('#cal_bpe_calendar-'+ calId).empty().html(response.content);
			}

			calLoader.removeClass('cal-loading');
		});
		
		return false;
	});

	jQuery('#events-pag a').live( 'click', function(event){
		var tab = jQuery('#object-nav ul li.selected');
		
		tab.addClass('loading');
		
		var page = jQuery(this).attr('href');
		page = page.split('?');
		page = page[1].split('=');
		page = page[1];

		jQuery.post( ajaxurl, {
			'action': 'events_pagination',
			'page' : page,
			'pathname' : document.location.pathname,
			'cookie': encodeURIComponent(document.cookie)
		},
		function(response) {
			jQuery('#events-dir-list').empty().html(response);
			tab.removeClass('loading');
		});
		
		return false;
	});
});