$(function() {

	function onImagesLoad(images, callback) {
		var self = this,
			unloaded = images.length;
		if (unloaded == 0) {
			callback();
		}

		images.each(function() {
			if (this.completed && typeof this.naturalWidth !== 'undefined') {
				imageLoaded();
			}
			else {
				var image = new Image();
				$(image).on('load', function(e) {
					$(this).off(e);
					imageLoaded();
				});
				image.src = $(this).attr('src');
			}
		});

		function imageLoaded() {
			unloaded--;
			if (unloaded === 0) {
				callback();
			}
		}
	}

	var touchEnable = 'ontouchstart' in document.documentElement;

	$('.swiper-container').each(function() {

		var swiper = $(this);
		swiper.data('i', 0);
		var isWrapItem = swiper.data('wrapitem');
		var isWrapTableCell = swiper.hasClass('is-wrap-table-cell');
		var imgautoheight = swiper.data('imgautoheight');
		var isCenter = swiper.data('center');
		swiper.data('is-wrap-item', isWrapItem);
		swiper.data('is-wrap-table-cell', isWrapTableCell);
		swiper.data('locked', false);

		if (isWrapItem) {
			swiper.children().each(function() {
				var wrap = $('<div>').addClass('swiper-wraper');
				if (isWrapTableCell) {
					wrap.addClass('table-cell');
				}
				$(this).detach().appendTo(wrap);
				wrap.appendTo(swiper);

				if (isCenter) {
					wrap.addClass('swiper-wraper-center')
				}
			});
		}

		swiper.data('N', swiper.children().length);

		if (isCenter) {
			swiper.children().addClass('swiper-wraper-center');
		}

		if (imgautoheight) {
			var images = swiper.find('img');
			var swiperHeight = 0;
			onImagesLoad(images, function() {
				var img = images[0];
				if (img) {
					// 取第一个的高度
					swiperHeight = $(img).height();
					if (swiperHeight > 0) {
						swiper.css('height', swiperHeight + 'px');
						swiper.find('img').css('max-height', swiperHeight + 'px');
					}
				}
			});
		}

		// events
		function drag(e) { 
			e.preventDefault(); 
			if (swiper.data('locked')) {
				var x0 = parseInt(swiper.data('x0'))||0;
				var i = parseInt(swiper.data('i'))||0;
				var N = parseInt(swiper.data('N'))||0;
				var tx = Math.round(unify(e).clientX - x0) + 'px';
				var dx = unify(e).clientX - x0;
				var translate = '', tv;

				if (i < N - 1 && dx < 0) {
					tv = '-' + Math.max(0, (i)*100) + '%';
				} else if (i > 0 && dx > 0) { 
					tv = '-' + Math.max(0, (i)*100) + '%';
				} else if (i == 0) {
					tv = 0;
				} else {
					tv = '-' + Math.max(0, (i)*100) + '%';
				}
				if (!swiper.data('transition')) {
					swiper.data('transition', swiper.children().eq(0).css('transition'));
				}
				translate = tv == 0 ? tx : 'calc('+tv+' + '+tx+')';
				swiper
					.children()
					.css('transform', 'translate(' + translate + ')')
					.css('transition', 'none');
			}
		}

		swiper.on(touchEnable ? 'touchmove' : 'mousemove', drag);

		function unify(e) { 
			return e.originalEvent.changedTouches ? 
				e.originalEvent.changedTouches[0] : 
				e; 
		}

		function lock(e) {
			swiper.data('x0', unify(e).clientX);
			swiper.data('locked', true);
		}

		function move(e) {
			if (!swiper.data('locked')) {
				return;
			}
			var x0 = parseInt(swiper.data('x0'))||0;
			var i = parseInt(swiper.data('i'))||0;
			var N = parseInt(swiper.data('N'));
			if (typeof x0 !== null) {
				var dx = unify(e).clientX - x0;
				var f = Math.abs((dx/window.innerWidth).toFixed(2));

				if (f < .2 || (i == 0 && dx > 0) || (i == (N-1) && dx < 0)) {
					console.log(123)
					swipeToCurr(swiper);
				}				
				else if (i < N - 1 && dx < 0) {
					swipeToLeft(swiper);
				}
				else if (i > 0 && dx > 0) {
					swipeToRight(swiper);
				}

				swiper.data('x0', null);
			}
			swiper.data('locked', false);
		}

		function swipeToLeft(swiper) {
			var i = parseInt(swiper.data('i'))||0;
			swiper
				.children()
				.css('transition', swiper.data('transition'))
				.css('transform', 'translate(-' + Math.max(0, (i+1)*100) + '%)');

			swiper.data('i', i+1);
		}

		function swipeToRight(swiper) {
			var i = parseInt(swiper.data('i'))||0;
			swiper
				.children()
				.css('transition', swiper.data('transition'))
				.css('transform', 'translate(-' + Math.max(0, (i-1)*100) + '%)');

			swiper.data('i', i-1);
		}

		function swipeToCurr(swiper) {
			var i = parseInt(swiper.data('i'))||0;
			swiper
				.children()
				.css('transition', swiper.data('transition'))
				.css('transform', 'translate(-' + Math.max(0, (i)*100) + '%)');
		}

		swiper.on(touchEnable ? 'touchstart' : 'mousedown', lock);
		swiper.on(touchEnable ? 'touchend' : 'mouseup', move);

	});


});