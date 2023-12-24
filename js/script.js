$(function(e) {

  // ========= STOP PROPAGATION ==========
  $('[data-events="stopProp"]').on('click', function (event) {
    event.stopPropagation();
  });

  // ========= PREVENT DEFAULT ==========
  $('[data-events="prevDef"]').on('click', function (event) {
    event.preventDefault();
  });

  // PRESS CTRL + ENTER EVENT
  $('body').keydown(function(e) {
    if (e.ctrlKey && e.keyCode == 13) {
        var text = '';
        $('#modal-message-sent').hide();
        $('#modal-message').modal('show');
        $('.modal-message-error').show();

        if (window.getSelection) {
            text = window.getSelection();
        }else if (document.getSelection) {
            text = document.getSelection();
        }else if (document.selection) {
            text = document.selection.createRange().text;
        }
        $('.selected_text').text(text);
    }
  });

  // SHOW SENT MESSAGE DIALOG
  $('.modal-message-error a[type="submit"]').on('click', function () {
      var button = $(this);
      var error = $('.selected_text').text();
      var comment = $('#user-message-error').val();
      var url = window.location.href;
      var recaptcha = $("#g-recaptcha-response").val();
      var data = {
          'action' : 'misspell',
          'error'  : error,
          'url'    : url,
          'comment': comment,
          'recaptcha': recaptcha
      };
      button.text('Отправляем ...');
      button.prop( "disabled", true );
      $.ajax({
          type: 'POST',
          url: '/services/misspell',
          data: data,
          success: function(data) {
              grecaptcha.reset();
              button.text('Отправить');
              button.prop( "disabled", false );
              if(data.success) {
                  $('#user-message-error').val('');
                  $('.modal-message-error').hide();
                  $('#modal-message-sent').show();
                  setTimeout(function() { $('#modal-message').modal('hide'); $('#modal-message-sent').hide();}, 10000);
              }
              if(data.fail) {
                  alert(data.message);
                  button.attr('disabled', false);
              }
          }
      });

  });


  // SCROLL MENU VIEW ANIMATION
  $(window).on('scroll', function (event) {
    var pos = ($('#main-menu-marker').offset().top) - ($(window).scrollTop()) ;
    if(pos <= 0) {
     $('#scroll-menu').addClass('active');

        // set sticky search-block height
        var $header = $('.navbar.navbar-scroll');
        var $content = $('.sticky-top-search-block');
        if ($content[0]){
            var $window = $(window).on('resize', function(){
                if ($(window).width() >= 1024) {
                    var height = $(this).height() - $header.outerHeight() -50;
                    $content.height(height);
                    $content.addClass('active');
                } else {
                    $content.removeClass('active');
                    $content.attr('style','height:auto');
                }
            }).trigger('resize');
        }
    } else {
     $('#scroll-menu').removeClass('active');
    }
  });

  // LEFT FLOAT MENU (all-news.html)
  if ( $( "#list-menu" ).length ) {
    $(window).on('scroll', function (event) {
      var pos = $(window).scrollTop();
      if(pos > 380) {
        $('#list-menu').addClass('show');
      } else {
        $('#list-menu').removeClass('show');
      };
    });
  };

  // ======   SCROLL MENU COLLAPSE   =========
	$('.container-navbar-scroll a[data-toggle="collapse"]').on('click', function () {
    if($(this).attr('aria-expanded') == 'false') {
        $(this).parents('.container-navbar-scroll').addClass('show');
    } else {
    	$(this).parents('.container-navbar-scroll').removeClass('show');
    };
  });

  // ======= SCROLL MENU COLLAPSE SETTINGS ======
  $('#navbarScroll').on('show.bs.collapse', function () {
    $('#scroll-menu').addClass('show');
  }).on('hide.bs.collapse', function () {
    $('#scroll-menu').removeClass('show');
  });

  // ======= SCROLL MENU NESTED REGION COLLAPSE BUBBLE PREVENT ======
  $('#nav-regions .collapse').on('hide.bs.collapse', function (event) {
    event.stopPropagation();
  });

  // ======  CUSTOM COLLAPSE =========
  $('[data-events="collapse"]').on('click', function(event) {
    event.preventDefault();
    var targetId = $(this).attr("data-target");
    $(targetId).slideToggle();
    if($(this).attr('aria-expanded') === 'false') {
        $(this).attr('aria-expanded', 'true');
    } else {
        $(this).attr('aria-expanded', 'false');
    }
  });

  // ====== INPUT LABEL ANIMATION =========
  $('.form-control-float').focus(function(){
    $(this).parents('.form-group').addClass('focused');
  });

  $('.form-control-float').blur(function(){
    var inputValue = $(this).val();
    if ( inputValue == "" ) {
      $(this).removeClass('filled');
      $(this).parents('.form-group').removeClass('focused');
    } else {
      $(this).addClass('filled');
    }
  });

  // ====== SHOW SEARCH FIELD ON HEADER ========
  $('.btn-nav-search').on('click', function () {
    $($(this).attr('data-target')).addClass('active');
  });

  // ====== CLOSE HEADER SEARCH FIELD ========
  $('.input-menu-search .form-control').blur(function(){
    var inputValue = $(this).val();
    if ( inputValue == "" ) {
      $(this).parents(".input-menu-search").removeClass('active');
    } else {
      $(this).addClass('active');
    }
  });

  $('.input-menu-search .btn-close').on('click', function(){
    $(this).parents(".input-menu-search").removeClass('active');
  });

  // promo new dropdown
  var promoNewDropdownTrigger = $('.promo-new-trigger')

  if (promoNewDropdownTrigger) {
    promoNewDropdownTrigger.each(function( index ) {
        $(this).on('click', function(event) {
            event.stopPropagation();
    
            if ($(this).hasClass('is--active')) {
                $(this).removeClass('is--active')
            } else {
                $(this).addClass('is--active')
            }
        });
    })

	$(document).mouseup( function(e){
        promoNewDropdownTrigger.each(function( index ) {
            if ( !$(this).is(e.target) && $(this).has(e.target).length === 0 || $(this).children('.promo-new__dropdown').is(e.target) ) {
                $(this).removeClass('is--active')
            }
        })
	});
  }

    // resize
    window.addEventListener('resize', () => {
		popularListDropdowns()
    });

	// popular list
	const popularList = document.querySelector('.sections-menu-nav-new')
	const popularListItem = document.querySelectorAll('.sections-menu-nav-new > .nav-item')
	const popularListDropdown = document.querySelectorAll('.sections-menu-new__list > .sections-menu-new__list-item')

	let popularListWidth = 0
	let popularListItemWidth = 0

	function popularListDropdowns() {
		if (popularList && popularListItem && popularListDropdown) {
			popularListItemWidth = 0
			popularListWidth = popularList.offsetWidth

			popularListItem.forEach(item => {
				item.classList.remove('is--visible')
			})
			popularListDropdown.forEach(item => {
				item.classList.remove('is--hidden')
			})

			for (let i = 0; i < popularListItem.length; i++) {
				if ((popularListItemWidth + popularListItem[i].offsetWidth) <= popularListWidth) {
					popularListItemWidth += popularListItem[i].offsetWidth;
					popularListItem[i].classList.add('is--visible');
					popularListDropdown[i].classList.add('is--hidden');
				} else {
					break;
				}
			}
		}
	}

	popularListDropdowns()

  // sections menu new
  var sectionsMenuNew = $('.sections-menu-new')
  var newHamburger = $('.new-hamburger')

  if (newHamburger) {
    newHamburger.on('click', function(event) {
        event.stopPropagation();

        if (sectionsMenuNew.hasClass('is--active')) {
            sectionsMenuNew.removeClass('is--active')
        } else {
            sectionsMenuNew.addClass('is--active')
        }
    });
}

  // ====== DATERANGEPICKER Календарь =========
  var datepicker = $('input.daterange');
  if(datepicker.length > 0) {
      datepicker.each(function () {
          var input = $(this);
          input.daterangepicker({
              autoUpdateInput:false,
              maxDate:moment(),
              "singleDatePicker": true,
              "autoApply": false,
              "showDropdowns": true,
              "opens": "right",
              "locale": {
                    "format": "DD.MM.YYYY",
                    "separator": " - ",
                    "applyLabel": "Сохранить",
                    "cancelLabel": "Отменить",
                    "fromLabel": "С",
                    "toLabel": "по",
                    "customRangeLabel": "Custom",
                    "daysOfWeek": [
                      "Вс",
                      "Пн",
                      "Вт",
                      "Ср",
                      "Чт",
                      "Пт",
                      "Сб"
                    ],
                    "monthNames": [
                      "Январь",
                      "Февраль",
                      "Март",
                      "Апрель",
                      "Май",
                      "Июнь",
                      "Июль",
                      "Август",
                      "Сентябрь",
                      "Октябрь",
                      "Ноябрь",
                      "Декабрь"
                    ],
                    "firstDay": 1
                },
            },
            function(start, end, label) {
                input.val(start.format('DD.MM.YYYY'));

                input.trigger('change');
            }
          );
      }).on('change', function () {
          if($(this).data('auto_submit')){
              $(this).closest('form').trigger('submit');
          }
      });
      // Stop
      $('.daterangepicker').on('click', function(event) {
          event.stopPropagation();
      });
  };

  $.ajaxSetup({
		type: "POST",
		//timeout: 5000,
		//dataType: "script",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
		processData:true, //для DOM FALSE
		cache: false, //false, когда нужно загрузить обновленную страницу
		error:function (XMLHttpRequest, textStatus, errorThrown){
		}
	});

    // ====== BTN SHOW MORE TOGGLE =========
    $('.btn-show-more').on('click', function(){
        var btn = $(this);
        if(btn.is('.load')){
            return;
        }

        var original_html = btn.html();

        btn.addClass('load').text('Загрузка');

        if(!btn.attr('data-page')){
            btn.attr('data-page', 0);
        }
        var data_offset = parseInt(btn.attr('data-page'));

        if(btn.data('url')){
            var data = {
                    offset:btn.data('offset') ? btn.data('offset') : window.news_offset
                };

            if(btn.data('from')){
                data.from = btn.data('from');
            }
            if(btn.data('to')){
                data.to = btn.data('to');
            }



            $.ajax({
                url:btn.data('url'),
                data:$.param(data),
                success:function(data){
                    btn.removeClass('load').html(original_html);
                    var list = btn.prevAll('ul');
                    if(list.length==0){
                        list = btn.prevAll('section').first().find('ul');
                    }
                    $(data.html).appendTo(list);

                    if(btn.data('offset')){
                        var offset = parseInt(btn.data('offset'));
                        offset += data.count;
                        btn.data('offset', offset);
                    }else{
                        window.news_offset += data.count;
                    }


                    data_offset = (data_offset+data.count);
                    btn.attr('data-page', data_offset);

                    if(data.remove_btn){
                        var section = btn.closest('section'),
                            category_type = section.data('category_type');

                        if(category_type && category_type!='news'){
                            section.next('.line.mb-30').remove();
                        }

                        btn.remove();
                    }
                    var url = new URL(window.location.href);
                    url.searchParams.set('per-page', data_offset);
                    window.history.replaceState(null, null, url);
                }
            });
        }
    });


    // ====== SEARCH TAGS FILTER START =========
    if (!RegExp.escape) {
        RegExp.escape = function (value) {
            return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        };
    }

    function delay(callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }


    $('#search_tag_selector').keyup(delay(function (e) {
        var filter = this.value,
            regex;

        var filter_query = $('#search-form').attr('data-query');
        var action = $('#search-form').attr('action');
        var region = $('.region-item.active').attr('data-form_value');

        setTimeout(function() {
            if (filter != "") {
                $.ajax({
                    url:action,
                    type:'GET',
                    data:{
                        q: filter,
                        type: 'tags',
                        region: region,
                        query: filter_query,
                    },
                    success:function(data){

                        $('#source_tags').html(data);
                        if(!$('#source_tags').hasClass('show')){
                            $('#source_tags').addClass('show');
                        }
                    },
                    error:function(data){

                    }
                });
            } else {
                $('#source_tags').html('<span class="dropdown-item active">Введите запрос</span>');
            }
        }, 500);
    }, 500));

    var $medias = $('.dropdown-menu-search-tag .dropdown-item'),
        $h4s = $medias;

    $('#search_tag_selector').keyup(function () {
        $('#source_tags').html('<span class="dropdown-item active">Поиск...</span>');
    });

    $('#search_tag_selector').blur(function() {
        setTimeout(function() {
            if($('#source_tags').hasClass('show')){
                $('#source_tags').removeClass('show');
            }
        }, 500);
    });

    $('#search_tag_selector').on('click', function(e){
        e.preventDefault();
        if(!$('#source_tags').hasClass('show')){
            $('#source_tags').addClass('show');
        }
    });

    $('.tag-filter').on('click', '.dropdown-item', function(){
        $('#search_tag_selector').val('');
        if($('#source_tags').hasClass('show')){
            $('#source_tags').removeClass('show');
        }
    });
    // ====== SEARCH TAGS END =========

    var search_form_404 = $('#search_form_404');
    if(search_form_404.length>0){
        var redirect_timer = setTimeout(function () {
            location.href = search_form_404.data('redirect');
        }, 15000);

        search_form_404.on('input', 'input', function () {
            clearTimeout(redirect_timer);
        });
    }

    var filters = $('#filters'),
        search_form = filters.closest('form'),
        source_tags = $('#source_tags'),
        target_tags = $('#target_tags'),
        target_tags_mobile = $('#target_tags_mobile');

    filters.on('click', '.dropdown-item[data-form_name]:not(.active)', function(){
        var dropdown_menu = $(this).closest('.dropdown-menu-search'),
            data = {
                name:$(this).data('form_name'),
                value:$(this).data('form_value')
            };

        $(this).addClass('active').siblings('.active').removeClass('active');
        dropdown_menu.prev('a').find('.text-truncate').text($(this).text());
        dropdown_menu.next('input:hidden').attr('name', data.name).val(data.value);
        if($(this).attr('data-form_name') == 'region') {

            /*
            if(data.value > 0) {
                $('.category-region').attr('style','display:none !important');
                $(".category-region[data-region='" + data.value +"']").attr('style','display:block !important');
            } else {
                $('.category-region').attr('style','display:block !important');
            }
             */

            var filter = $(this).attr('data-form_value'),
                regex;

            var filter_query = $('#search-form').attr('data-query');
            var action = $('#search-form').attr('action');

            if(!filter) {
                filter = 'all';
            }
            $.ajax({
                url:action,
                type:'GET',
                data:{
                    q: filter,
                    type: 'categories',
                    query: filter_query,
                },
                success:function(data){

                    $('.form-search-categories').html(data);
                },
                error:function(data){

                }
            });
        }


    });

    source_tags.on('click', '.dropdown-item:not(.active)', function(){
        var tag = {
            id: $(this).data('tag_id'),
            title: $(this).data('tag_title'),
        };

        $('<li>' +
          '  <div class="btn-tag">' +
          '    <span class="btn-tag-text text-truncate">'+tag.title+'</span>' +
          '    <span class="btn-tag-del" data-tag_id="'+tag.id+'">' +
          '      <svg style="fill:none" width="20" height="20"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close-gray"></use></svg>' +
          '    </span>' +
          '  </div>' +
          '  <input type="hidden" name="tag[]" value="'+tag.id+'">' +
          '</li>').appendTo(target_tags);

        $('<div class="btn-tag">' +
          '  <span class="btn-tag-text text-truncate">'+tag.title+'</span>' +
          '  <span class="btn-tag-del" data-tag_id="'+tag.id+'">' +
          '    <svg style="fill:none" width="20" height="20"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close-gray"></use></svg>' +
          '  </span>' +
          '</div>').appendTo(target_tags_mobile);

        $(this).addClass('active');
    });

    target_tags.on('click', '.btn-tag-del', function (e, triggered){
        var tag = $(this).closest('li'),
            tag_id = tag.find('input:hidden').val();

        tag.remove();

        source_tags.find('[data-tag_id="'+tag_id+'"]').removeClass('active');

        if(triggered===true){
            return;
        }

        target_tags_mobile.find('[data-tag_id="'+tag_id+'"]').trigger('click', true);
    });

    target_tags_mobile.on('click', '.btn-tag-del', function (){
        var tag_id = $(this).data('tag_id');
        $(this).closest('.btn-tag').remove();

        target_tags.find('[data-tag_id="'+tag_id+'"]').trigger('click', true);
    });

    filters.on('click', '[data-action="reset"]', function () {
        target_tags.find('.btn-tag-del').trigger('click');
        filters.find('input:hidden').remove();
        filters.find('.daterange').val('');

        search_form.trigger('submit');
    });

    var form_submitted = false;
    search_form.on('submit', function (e){
        if(form_submitted){
            e.preventDefault();
            return;
        }

        var empty_fields = $(this).find(':input').filter(function () {
            return $(this).val() === '';
        });

        empty_fields.removeAttr('name');

        form_submitted = true;
    });


  // ====== REGION COLLAPSE MENU NAVIGATION =========
  $('.nav-scroll-regions li').hover(function(){
    $(this).parent().find('.nav-link.active').removeClass('active');
    var thisChildRef = $(this).children('a');
    thisChildRef.addClass('active');
    var thisChildRefAttr = thisChildRef.attr('data-toggle');
    if (thisChildRefAttr) {
      $('#toggle-sections .active').removeClass('active');
      $('#toggle-sections ' + thisChildRefAttr).addClass('active');
    }
  });

  // ====== FORM SELECT =========
  $('#list-press-center, #list-press-center-form').on('click', 'a', function(){
     var regSelect = $(this).attr('href'),
         regName = $(this).text(),
         dropdown = $(this).closest('.dropdown-menu'),
         data = $(this).data('content'),
         press_center_id = $(this).data('press_center_id');
     dropdown.find('a.active').removeClass('active');
     $(this).addClass('active');
     dropdown.prev().find('span').text(regName).attr('data-target', regSelect);

     $('#press_center_content').html(data && data.static_page_content ? data.static_page_content : '');

     if(press_center_id){
         $('#press_center_id_input').val(press_center_id);
     }
  }).on('click', 'span', function(e){
      e.stopPropagation();
  });

  function scrollTo(el){
      $("html, body").animate({ scrollTop: el.offset().top - $('#scroll-menu').height() }, 600);
  }

    function randomStr(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

  $('#feedback_form').on('click', '.reload-captcha', function (e){
      e.preventDefault();

      var img = $(this).prev('img'),
          path = img.attr('src');

      path = path.substr(0, path.indexOf('?'));

      img.attr('src', path + '?' + randomStr(8));
  });

  $('#feedback_form').on('submit', function (e){
      e.preventDefault();

      $(this).find('.form-message-required').remove();
      $(this).find('.invalid').removeClass('invalid');

      var show_error = function(el, message){
          var append_to = el;
          if(el.is('input:text,textarea')){
              append_to = el.parent();
              el.addClass('invalid')
          }
          $('<span/>', {'class':"form-message form-message-required", text:message}).appendTo(append_to);

          return append_to;
      };

      var errors = 0,
        first_error = false;
      $(this).find('[data-required="1"]').each(function () {
          if($(this).data('required_type')==='checkbox'){
              if($(this).find('input:checked').length>0){
                  return;
              }
          }else{
              var val = $(this).val().trim();
              if(val.length>0){
                  return;
              }
          }

          errors++;

          var append_to = show_error($(this), $(this).data('message'));

          if(first_error===false){
              first_error = append_to;
          }
      });

      if(errors>0){
          scrollTo(first_error);

          return;
      }

      var form = $(this);

      var form_error = function(message){
          var status = form.find('.sent_status').text(message).removeClass('d-none').addClass('text-red');
          scrollTo(status);
      };

      $.ajax({
          url:form.attr('action'),
          data:$.param(form.serializeArray()),
          success:function(data){
              if(data && data.error){
                  if(data.error_captcha){
                      var captcha = form.find('input[name=captcha]');
                      scrollTo( show_error(captcha, 'Символы с изображения введены не верно') );
                  }else{
                      form_error('Сообщение отправить не удалось');
                  }
                  return;
              }

              form.trigger('reset');
              var status = form.find('.sent_status').text('Сообщение успешно отправлено').removeClass('d-none text-red');
              scrollTo(status);
         },
         error:function(data){
              form_error('Сообщение отправить не удалось');
         }
      });
  }).on('focus change', 'input,textarea', function () {
      $(this).removeClass('invalid');
      if($(this).is('input:text,textarea')){
          $(this).nextAll('.form-message-required').remove();
          return;
      }

      $(this).closest('[data-required="1"]').find('.form-message-required').remove();
  });

  $(document).on('submit', 'form.ajax_poll_vote', function (e){
      var form = $(this);

      e.preventDefault();

      $.ajax({
        url:form.attr('action'),
        data:$.param({poll_answer:form.find(':checked').val()}),
        success:function(data){
            form.closest('section').replaceWith(data.html);
        }
    });
  });

  // ====== CAROUSEL =========
  $('.carousel-report').on('slid.bs.carousel', function () {
    var imgTitle = $(this).find(".carousel-item.active img").attr("data-title");
    var imgNum = $(this).find(".carousel-item.active img").attr("data-num");

    $(this).find(".carousel-report-title").text(imgTitle);
    $(this).find(".carousel-report-num").text(imgNum);

    //var imgWidth = $(this).find(".carousel-item.active img").attr("width");
    // console.log(imgWidth);
    //$(this).css("width", imgWidth);
  });

  // ====== CAROUSEL modal =========
  $('.carousel-report-modal').on('slid.bs.carousel', function () {
    var imgTitle = $(this).find(".carousel-item.active img").attr("data-title");
    var imgNum = $(this).find(".carousel-item.active img").attr("data-num");

    $(this).find(".carousel-report-title").text(imgTitle);
    $(this).find(".carousel-report-num").text(imgNum);
  });

  // scroll
  let prevScrollpos = window.pageYOffset;
  const product = document.querySelectorAll('.fixed-scroll-new')
  let coordOffsetLeftBottom = 0 // Fixed block on bottom position
  let coordOffsetCenterBottom = 0 // Fixed block on bottom position
  let coordOffsetRightBottom = 0 // Fixed block on bottom position
  let coordOffsetLeftTop = 0 // Fixed block on offsetop position
  let coordOffsetCenterTop = 0 // Fixed block on offsetop position
  let coordOffsetRightTop = 0 // Fixed block on offsetop position

  function getCoords(elem) {
      let box = elem.getBoundingClientRect();
      
      return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
      };
  }

    var Visible = function (target) {
        var targetPosition = {
            top: window.pageYOffset + target.getBoundingClientRect().top,
            left: window.pageXOffset + target.getBoundingClientRect().left,
            right: window.pageXOffset + target.getBoundingClientRect().right,
            bottom: window.pageYOffset + target.getBoundingClientRect().bottom
        },

        windowPosition = {
            top: window.pageYOffset,
            left: window.pageXOffset,
            right: window.pageXOffset + document.documentElement.clientWidth,
            bottom: window.pageYOffset + document.documentElement.clientHeight
        };

        if (targetPosition.bottom > windowPosition.top && targetPosition.top < windowPosition.bottom && targetPosition.right > windowPosition.left && targetPosition.left < windowPosition.right) {
            return target;
        } else {
            return false;
        };
    };

  function productScroll() {
    if (product) {
        if (window.innerWidth >= 1024) {
            let currentScrollPos = window.pageYOffset;

            if (prevScrollpos > currentScrollPos || prevScrollpos <= 0) { // If up
                product.forEach(item => {
                    if (Visible (item)) {
                        if (window.innerWidth >= 1280) {
                            if (item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height != item.getBoundingClientRect().height) {
                                // for left
                                if (item.querySelector('.fixed-scroll-new-left').classList.contains('product__fixed--active')) { // Если при фиксированном блоке скроллим вверх - убираем фиксацию
                                    item.querySelector('.fixed-scroll-new-left').classList.remove('product__fixed--active')
                                    item.querySelector('.fixed-scroll-new-left').classList.add('product__fixed--bottom')
                                    item.querySelector('.fixed-scroll-new-left').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-left').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, ' + coordOffsetLeftTop + 'px, 0px)'
                                }
            
                                if (window.pageYOffset <= (getCoords(item.querySelector('.fixed-scroll-new-left')).top - Number(107)) && item.querySelector('.fixed-scroll-new-left').classList.contains('product__fixed--bottom')) { // Если проскроллили до верха блока - фиксируем
                                    item.querySelector('.fixed-scroll-new-left').classList.add('product__fixed--top')
                                    item.querySelector('.fixed-scroll-new-left').style.position = 'fixed'
                                    item.querySelector('.fixed-scroll-new-left').style.top = '107px'
                                    item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, 0px, 0px)'
                                }
            
                                if (window.pageYOffset <= (item.offsetTop - Number(107)) && item.querySelector('.fixed-scroll-new-left').classList.contains('product__fixed--top')) {
                                    item.querySelector('.fixed-scroll-new-left').classList.remove('product__fixed--top')
                                    item.querySelector('.fixed-scroll-new-left').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-left').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, 0px, 0px)'
                                }
                            }

                            if (item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height != item.getBoundingClientRect().height) {
                                // for center
                                if (item.querySelector('.fixed-scroll-new-center').classList.contains('product__fixed--active')) { // Если при фиксированном блоке скроллим вверх - убираем фиксацию
                                    // console.log('fixed-1')
                                    item.querySelector('.fixed-scroll-new-center').classList.remove('product__fixed--active')
                                    item.querySelector('.fixed-scroll-new-center').classList.add('product__fixed--bottom')
                                    item.querySelector('.fixed-scroll-new-center').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-center').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, ' + coordOffsetCenterTop + 'px, 0px)'
                                }
            
                                if (window.pageYOffset <= (getCoords(item.querySelector('.fixed-scroll-new-center')).top - Number(107)) && item.querySelector('.fixed-scroll-new-center').classList.contains('product__fixed--bottom')) { // Если проскроллили до верха блока - фиксируем
                                    // console.log('fixed-2')
                                    item.querySelector('.fixed-scroll-new-center').classList.add('product__fixed--top')
                                    item.querySelector('.fixed-scroll-new-center').style.position = 'fixed'
                                    item.querySelector('.fixed-scroll-new-center').style.top = '107px'
                                    item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, 0px, 0px)'
                                }
            
                                if (window.pageYOffset <= (item.offsetTop - Number(107)) && item.querySelector('.fixed-scroll-new-center').classList.contains('product__fixed--top')) {
                                    // console.log('fixed-3')
                                    item.querySelector('.fixed-scroll-new-center').classList.remove('product__fixed--top')
                                    item.querySelector('.fixed-scroll-new-center').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-center').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, 0px, 0px)'
                                }
                            }
                        }

                        if (item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height != item.getBoundingClientRect().height) {
                            // for right
                            if (item.querySelector('.fixed-scroll-new-right').classList.contains('product__fixed--active')) { // Если при фиксированном блоке скроллим вверх - убираем фиксацию
                                item.querySelector('.fixed-scroll-new-right').classList.remove('product__fixed--active')
                                item.querySelector('.fixed-scroll-new-right').classList.add('product__fixed--bottom')
                                item.querySelector('.fixed-scroll-new-right').style.position = 'relative'
                                item.querySelector('.fixed-scroll-new-right').style.top = '0px'
                                item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, ' + coordOffsetRightTop + 'px, 0px)'
                            }
        
                            if (window.pageYOffset <= (getCoords(item.querySelector('.fixed-scroll-new-right')).top - Number(107)) && item.querySelector('.fixed-scroll-new-right').classList.contains('product__fixed--bottom')) { // Если проскроллили до верха блока - фиксируем
                                item.querySelector('.fixed-scroll-new-right').classList.add('product__fixed--top')
                                item.querySelector('.fixed-scroll-new-right').style.position = 'fixed'
                                item.querySelector('.fixed-scroll-new-right').style.top = '107px'
                                item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, 0px, 0px)'
                            }
        
                            if (window.pageYOffset <= (item.offsetTop - Number(107)) && item.querySelector('.fixed-scroll-new-right').classList.contains('product__fixed--top')) {
                                item.querySelector('.fixed-scroll-new-right').classList.remove('product__fixed--top')
                                item.querySelector('.fixed-scroll-new-right').style.position = 'relative'
                                item.querySelector('.fixed-scroll-new-right').style.top = '0px'
                                item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, 0px, 0px)'
                            }
                        }
                    }
                })
            } else { // If down
                product.forEach(item => {
                    if (Visible (item)) {
                        coordOffsetLeftTop = getCoords(item.querySelector('.fixed-scroll-new-left')).top - item.offsetTop
                        coordOffsetCenterTop = getCoords(item.querySelector('.fixed-scroll-new-center')).top - item.offsetTop
                        coordOffsetRightTop = getCoords(item.querySelector('.fixed-scroll-new-right')).top - item.offsetTop

                        if (window.innerWidth >= 1280) {
                            if (item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height != item.getBoundingClientRect().height) {
                                // for left
                                if (item.querySelector('.fixed-scroll-new-left').classList.contains('product__fixed--top')) {
                                    item.querySelector('.fixed-scroll-new-left').classList.remove('product__fixed--top')
                                    item.querySelector('.fixed-scroll-new-left').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-left').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, ' + coordOffsetLeftTop + 'px, 0px)'
                                }
                                
                                if (item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height <= (document.documentElement.clientHeight - Number(107))) {
                                    if (window.pageYOffset >= (getCoords(item.querySelector('.fixed-scroll-new-left')).top - Number(107))) {
                                        item.querySelector('.fixed-scroll-new-left').classList.add('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-left').style.position = 'fixed'
                                        item.querySelector('.fixed-scroll-new-left').style.top = '107px'
                                        item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, 0px, 0px)'
                                    }

                                    if (window.pageYOffset >= (item.offsetTop + (item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height) - Number(107))) {
                                        let transformFixedBottom = item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height
                
                                        item.querySelector('.fixed-scroll-new-left').classList.remove('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-left').classList.add('product__fixed--bottom')
                                        item.querySelector('.fixed-scroll-new-left').style.position = 'relative'
                                        item.querySelector('.fixed-scroll-new-left').style.top = '0px'
                                        item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, ' + transformFixedBottom + 'px, 0px)'
                                    }
                                } else {
                                    if (window.pageYOffset >= getCoords(item.querySelector('.fixed-scroll-new-left')).top + item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height - (document.documentElement.clientHeight - Number(30)) && !item.querySelector('.fixed-scroll-new-left').classList.contains('product__fixed--active')) {
                                        if (!((window.pageYOffset - item.offsetTop) - Number(30) >= item.getBoundingClientRect().height - document.documentElement.clientHeight)) {
                                            coordOffsetLeftBottom = (window.pageYOffset - item.offsetTop) - item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height + window.innerHeight - 30
                                        }
                    
                                        item.querySelector('.fixed-scroll-new-left').classList.add('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-left').style.position = 'fixed'
                                        item.querySelector('.fixed-scroll-new-left').style.top = document.documentElement.clientHeight - Number(30) + 'px'
                                        item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, -100%, 0px)'
                                    }
                                    if ((window.pageYOffset - item.offsetTop) - Number(30) >= item.getBoundingClientRect().height - document.documentElement.clientHeight) {
                                        let transformFixedBottom = item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-left').getBoundingClientRect().height
                    
                                        item.querySelector('.fixed-scroll-new-left').classList.remove('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-left').classList.add('product__fixed--bottom')
                                        item.querySelector('.fixed-scroll-new-left').style.position = 'relative'
                                        item.querySelector('.fixed-scroll-new-left').style.top = '0px'
                                        item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, ' + transformFixedBottom + 'px, 0px)'
                                    }
                                }
                            }

                            if (item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height != item.getBoundingClientRect().height) {
                                // for center
                                if (item.querySelector('.fixed-scroll-new-center').classList.contains('product__fixed--top')) {
                                    item.querySelector('.fixed-scroll-new-center').classList.remove('product__fixed--top')
                                    item.querySelector('.fixed-scroll-new-center').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-center').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, ' + coordOffsetCenterTop + 'px, 0px)'
                                }
                                
                                if (item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height <= (document.documentElement.clientHeight - Number(107))) {
                                    if (window.pageYOffset >= (getCoords(item.querySelector('.fixed-scroll-new-center')).top - Number(107))) {
                                        item.querySelector('.fixed-scroll-new-center').classList.add('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-center').style.position = 'fixed'
                                        item.querySelector('.fixed-scroll-new-center').style.top = '107px'
                                        item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, 0px, 0px)'
                                    }

                                    if (window.pageYOffset >= (item.offsetTop + (item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height) - Number(107))) {
                                        let transformFixedBottom = item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height
                
                                        item.querySelector('.fixed-scroll-new-center').classList.remove('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-center').classList.add('product__fixed--bottom')
                                        item.querySelector('.fixed-scroll-new-center').style.position = 'relative'
                                        item.querySelector('.fixed-scroll-new-center').style.top = '0px'
                                        item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, ' + transformFixedBottom + 'px, 0px)'
                                    }
                                } else {
                                    if (window.pageYOffset >= getCoords(item.querySelector('.fixed-scroll-new-center')).top + item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height - (document.documentElement.clientHeight - Number(30)) && !item.querySelector('.fixed-scroll-new-center').classList.contains('product__fixed--active')) {
                                        if (!((window.pageYOffset - item.offsetTop) - Number(30) >= item.getBoundingClientRect().height - document.documentElement.clientHeight)) {
                                            coordOffsetCenterBottom = (window.pageYOffset - item.offsetTop) - item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height + window.innerHeight - 30
                                        }
                    
                                        item.querySelector('.fixed-scroll-new-center').classList.add('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-center').style.position = 'fixed'
                                        item.querySelector('.fixed-scroll-new-center').style.top = document.documentElement.clientHeight - Number(30) + 'px'
                                        item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, -100%, 0px)'
                                    }
                                    if ((window.pageYOffset - item.offsetTop) - Number(30) >= item.getBoundingClientRect().height - document.documentElement.clientHeight) {
                                        let transformFixedBottom = item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-center').getBoundingClientRect().height
                    
                                        item.querySelector('.fixed-scroll-new-center').classList.remove('product__fixed--active')
                                        item.querySelector('.fixed-scroll-new-center').classList.add('product__fixed--bottom')
                                        item.querySelector('.fixed-scroll-new-center').style.position = 'relative'
                                        item.querySelector('.fixed-scroll-new-center').style.top = '0px'
                                        item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, ' + transformFixedBottom + 'px, 0px)'
                                    }
                                }
                            }
                        }

                        if (item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height != item.getBoundingClientRect().height) {
                            // for right
                            if (item.querySelector('.fixed-scroll-new-right').classList.contains('product__fixed--top')) {
                                item.querySelector('.fixed-scroll-new-right').classList.remove('product__fixed--top')
                                item.querySelector('.fixed-scroll-new-right').style.position = 'relative'
                                item.querySelector('.fixed-scroll-new-right').style.top = '0px'
                                item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, ' + coordOffsetRightTop + 'px, 0px)'
                            }

                            if (item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height <= (document.documentElement.clientHeight - Number(107))) {
                                if (window.pageYOffset >= (getCoords(item.querySelector('.fixed-scroll-new-right')).top - Number(107))) {
                                    item.querySelector('.fixed-scroll-new-right').classList.add('product__fixed--active')
                                    item.querySelector('.fixed-scroll-new-right').style.position = 'fixed'
                                    item.querySelector('.fixed-scroll-new-right').style.top = '107px'
                                    item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, 0px, 0px)'
                                }

                                if (window.pageYOffset >= (item.offsetTop + (item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height) - Number(107))) {
                                    let transformFixedBottom = item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height
            
                                    item.querySelector('.fixed-scroll-new-right').classList.remove('product__fixed--active')
                                    item.querySelector('.fixed-scroll-new-right').classList.add('product__fixed--bottom')
                                    item.querySelector('.fixed-scroll-new-right').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-right').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, ' + transformFixedBottom + 'px, 0px)'
                                }
                            } else {
                                if (window.pageYOffset >= getCoords(item.querySelector('.fixed-scroll-new-right')).top + item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height - (document.documentElement.clientHeight - Number(30)) && !item.querySelector('.fixed-scroll-new-right').classList.contains('product__fixed--active')) {
                                    if (!((window.pageYOffset - item.offsetTop) - Number(30) >= item.getBoundingClientRect().height - document.documentElement.clientHeight)) {
                                        coordOffsetRightBottom = (window.pageYOffset - item.offsetTop) - item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height + window.innerHeight - 30
                                    }
            
                                    item.querySelector('.fixed-scroll-new-right').classList.add('product__fixed--active')
                                    item.querySelector('.fixed-scroll-new-right').style.position = 'fixed'
                                    item.querySelector('.fixed-scroll-new-right').style.top = document.documentElement.clientHeight - Number(30) + 'px'
                                    item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, -100%, 0px)'
                                }

                                if ((window.pageYOffset - item.offsetTop) - Number(30) >= item.getBoundingClientRect().height - document.documentElement.clientHeight) {
                                    let transformFixedBottom = item.getBoundingClientRect().height - item.querySelector('.fixed-scroll-new-right').getBoundingClientRect().height
            
                                    item.querySelector('.fixed-scroll-new-right').classList.remove('product__fixed--active')
                                    item.querySelector('.fixed-scroll-new-right').classList.add('product__fixed--bottom')
                                    item.querySelector('.fixed-scroll-new-right').style.position = 'relative'
                                    item.querySelector('.fixed-scroll-new-right').style.top = '0px'
                                    item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, ' + transformFixedBottom + 'px, 0px)'
                                }
                            }
                        }
                    }
                })
            }
            prevScrollpos = currentScrollPos;
        } else {
            product.forEach(item => {
                item.querySelector('.fixed-scroll-new-left').style.position = 'relative'
                item.querySelector('.fixed-scroll-new-left').style.top = '0px'
                item.querySelector('.fixed-scroll-new-left').style.transform = 'translate3d(0px, 0px, 0px)'

                item.querySelector('.fixed-scroll-new-center').style.position = 'relative'
                item.querySelector('.fixed-scroll-new-center').style.top = '0px'
                item.querySelector('.fixed-scroll-new-center').style.transform = 'translate3d(0px, 0px, 0px)'

                item.querySelector('.fixed-scroll-new-right').style.position = 'relative'
                item.querySelector('.fixed-scroll-new-right').style.top = '0px'
                item.querySelector('.fixed-scroll-new-right').style.transform = 'translate3d(0px, 0px, 0px)'
            })
        }
    }
  }
  
  window.addEventListener('scroll', () => {
    productScroll()
  })
});

document.addEventListener('DOMContentLoaded', function () {
    // page bg
    const pageBg = document.querySelector('.page-bg-new')

    if (pageBg) {
        let pageHeaderHeight = document.querySelector('header').getBoundingClientRect().height
        let pageContentUlPadding = parseInt(getComputedStyle(document.querySelector('.page-bg-new-content > ul')).paddingTop)
        let pageContentLiHeight = 0;

        for (let index = 0; index < 3; index++) {
            pageContentLiHeight += document.querySelectorAll('.page-bg-new-content > ul > li')[index].getBoundingClientRect().height;
        }

        console.log(pageContentLiHeight)

        let pageBgHeight = pageHeaderHeight

        pageBg.style.height = pageBgHeight + pageContentUlPadding + pageContentLiHeight + Number(40) + 'px'
    }
    
    // background
    BackgroundCheck.init({
        targets: '.bg-check',
        images: '.page-bg-new__img'
    });
    console.log('true')
})