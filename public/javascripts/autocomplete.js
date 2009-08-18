;(function($) {
	
$.fn.extend({
	completable: function(url, options) {
	  options.url = url;
	  options.width = options.width || $(this).innerWidth() + "px";
	  options.inputClass = options.inputClass || 'autocomplete-loading';
	  options.delay = options.delay || 1000;
	  options.enter = options.enter || "default";
	  
		return this.each(function() {
			new $.completer(this, options);
		});
	}
});
$.completer = function(input, options) {
  var $input = $(input);
  var current_key;	
  
	var KEY = {
		UP: 38,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8,
		ENTER: 13,
		CTRL: 17
	};
  
  var get = {
    ACBox: function(){
      return $('#autocomplete');
    },//ACBox
    CurrentItem: function(){
      return get.ACBox().find('li.current');
    },//CurrentItem
    PrevItem: function(){
      return get.CurrentItem().prev('li');
    },//PrevItem
    NextItem: function(){
      return get.CurrentItem().next('li');
    },//NextItem
    FirstItem: function(){
      return get.ACBox().find('li:first');
    },//LastItem
    LastItem: function(){
      return get.ACBox().find('li:last');
    }, //LastItem
    OffsetInput: function(){
	  return [$input.offset().top + $input.innerHeight() + 1, $input.offset().left];
	  }
  };//get
  
  $input.bind('keydown',function(event){
    current_key = document.layers ? event.which : document.all ? event.keyCode : document.getElementById ? event.keyCode : 0;
    switch(current_key){
      case KEY.UP:
        isVisible(get.ACBox()) ? navigateUpDown('up') : whenStopTyping(requestData);
      break;
      case KEY.DOWN:
        isVisible(get.ACBox()) ? navigateUpDown('down') : whenStopTyping(requestData);
      break;
      case KEY.ESC:
        hideResults();
      break;
      case KEY.ENTER:
        if( isVisible(get.ACBox()) && isVisible(get.CurrentItem()) ) {
          if(options.enter == "default"){
            if(isVisible(get.CurrentItem().find('a'))){
              document.location.href = get.CurrentItem().find('a').attr('href');
            }//if
          }//if
          else {
            options.enter(get.CurrentItem()[0]);
          }//else
        }//if
      break;
      default:
        whenStopTyping(requestData);
      break;
    }
  });
  
  get.ACBox().find('li').live('mouseover',function(){
    setCurrentItem($(this));
  });
  
	function isVisible(elem){
	  return elem.length && elem.is(':visible');
	}
	
	function hideResults(){
	  get.ACBox().remove();
	}
	
	function whenStopTyping(fnc){
	  hideResults();
	  var last_time = new Date().getTime();
	  requested = false;
	  var t = setTimeout(function(){
	    if(!requested){
    	  var current_time = new Date().getTime();
    	  if(current_time - last_time > options.delay){
    	    requestData();
    	    requested = true;
    	  }//if
	    }//if
  	}, options.delay + 100);  
	}//whenStopTyping
	
	function requestData(){
	  $input.addClass(options.inputClass);
	  $.ajax({
  		dataType: options.dataType,
  		url: options.url,
  		data: 'q='+ ($input.val() || ""),
  		success: function(data) {
  			results = options.handle(data);
  			buildAC(results);
  		}
  	});
	}
	
	function buildAC(results){
	  if(results.length){
  	  var ac = $('<div id="autocomplete"></div>');
  	  ac.css('width',options.width);
  	  ac.css('top',get.OffsetInput()[0] + "px");
  	  ac.css('left',get.OffsetInput()[1] + "px");
  	  var ul = $('<ul></ul>');
  	  $.each(results,function(i){
  	    ul.append('<li>'+ results[i] +'</li>');
  	  });
  	  ac.html(ul);
  	  $('body').append(ac);
  	  ac.slideDown('fast');
	  }
	}
	
  function navigateUpDown(tipo){
    var current_item = get.CurrentItem();
    var end_item = tipo == "up" ? get.LastItem() : get.FirstItem();
    var next_item = tipo == "up" ? get.PrevItem() : get.NextItem();
    next_item = isVisible(next_item)? next_item : end_item;
    isVisible(current_item) ? setCurrentItem(next_item) : setCurrentItem(end_item);
  }//navigateUp
  
  function setCurrentItem(item){
    get.CurrentItem().removeClass('current');
    item.addClass('current');
  }
};

})(jQuery);