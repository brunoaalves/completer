;(function($) {

$.fn.extend({
	alert("test");
	completable: function(url, options) {
	  options.url = url;
	  options.width = options.width || $(this).innerWidth() + "px";
	  options.inputClass = options.inputClass || 'autocomplete-loading';
	  options.delay = options.delay || 1000;
	  options.enter = options.enter || "default";
	  options.dataType = options.dataType || "json";
	  options.perScroll = options.perScroll || 4;
	  
	  if(typeof options.cache){
	    console.log("Asd");
	  }
	  else if(options.cache === true){
	    options.cache = {
	      expiresAt: 60000
	    }//options.cache
	  }//if
	  
		return this.each(function() {
			new $.completer(this, options);
		});
	}
});
$.completer = function(input, options) {
  var $input = $(input);
  var current_key;	
  var current_scroll;
  
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
        exists(get.ACBox()) ? navigateUpDown('up') : whenStopTyping(requestData);
      break;
      case KEY.DOWN:
        exists(get.ACBox()) ? navigateUpDown('down') : whenStopTyping(requestData);
      break;
      case KEY.ESC:
        hideResults();
      break;
      case KEY.ENTER:
        if( exists(get.ACBox()) && exists(get.CurrentItem()) ) {
          if(options.enter == "default"){
            if(exists(get.CurrentItem().find('a'))){
              document.location.href = get.CurrentItem().find('a').attr('href');
            }//if
          }//if
          else {
            options.enter(get.CurrentItem()[0]);
          }//else
        }//if
      break;
      case KEY.CTRL:
      break;
      case KEY.TAG:
      break;
      default:
        whenStopTyping(requestData);
      break;
    }
  });
  
  get.ACBox().find('li').live('mouseover',function(){
    setCurrentItem($(this));
  });
  
	function exists(elem){
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
    	    options.val = $input.val() || "";
    	    if(!$cache.verify(options.val)){
    	      requestData();
    	    }
    	    else {
    	      var cache = $cache.results[options.val];
    	      buildAC(cache);
    	      console.log("pega do cache");
    	    }
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
  		data: 'q='+ options.val,
  		success: function(data) {
  			results = options.handle(data);
  			$cache.results[options.val] = results;
  			buildAC(results);
  		}
  	});
	}
	
	function buildAC(results){
	  if(results.length){
  	  var ac = $('<div id="autocomplete"></div>');
  	  var height = 114;
  	  var ul = $('<ul></ul>');
  	  $.each(results,function(i){
  	    ul.append('<li>'+ results[i] +'</li>');
  	  });
  	  ac.html(ul);
  	  $('body').append(ac);
  	  /*$.each(get.ACBox().find('li'),function(i){
  	    height += this.offsetHeight;
  	    if(i == (options.perScroll - 1)){
  	      return false;
  	    }
  	  });*/
  	  ac.hide();
  	  ac.css({
  	    'height': height + "px",
  	    'width': options.width,
  	    'top': get.OffsetInput()[0] + "px",
  	    'left': get.OffsetInput()[1] + "px",
  	    'visibility': 'visible'
  	  });
  	  ac.slideDown('fast');
	  }
	}
	
  function navigateUpDown(tipo){
    var current_item = get.CurrentItem();
    var end_item = tipo == "up" ? get.LastItem() : get.FirstItem();
    var next_item = tipo == "up" ? get.PrevItem() : get.NextItem();
    next_item = exists(next_item)? next_item : end_item;
    exists(current_item) ? setCurrentItem(next_item) : setCurrentItem(end_item);
    moveScroll(tipo);
  }//navigateUp
  
  function setCurrentItem(item){
    get.CurrentItem().removeClass('current');
    item.addClass('current');
  }
  
  function moveScroll(tipo){
    var current_item = get.CurrentItem();
    var ac = get.ACBox();
    var scroll = ac[0].scrollTop;
    var total_offset = 0;
    var current_offsetHeight = current_item[0].offsetHeight;
    var current_offsetTop = current_item[0].offsetTop
    var total_offset = get.LastItem().innerHeight() + get.LastItem()[0].offsetTop;
    if(!exists(get.PrevItem())){
      scroll = 0;
    }
    else if(!exists(get.NextItem())){
      scroll = total_offset;
    }
    else if((current_offsetTop + current_offsetHeight) >= (ac[0].offsetHeight + scroll) && tipo == "down"){
      scroll += current_offsetHeight;
    }
    else if((current_offsetTop - current_offsetHeight) <= (scroll) && tipo == "up"){
      scroll -= current_offsetHeight;
    }
    ac[0].scrollTop = scroll;
  }
};

$cache = {
  results: [],
  verify: function(val){
    if($cache.results[val]){
      return true
    }
    else {
      return false;
    }
  }//verify
}//$cache

})(jQuery);


/**
 * var_dump
 */
function var_dump(element, limit, depth)
{
	depth = depth?depth:0;
	limit = limit?limit:1;
	returnString = '<ol>';
	for(property in element)
	{
		//Property domConfig isn't accessable
		if (property != 'domConfig')
		{
			returnString += '<li><strong>'+ property + '</strong> <small>(' + (typeof element[property]) +')</small>';
			if (typeof element[property] == 'number' || typeof element[property] == 'boolean')
				returnString += ' : <em>' + element[property] + '</em>';
			if (typeof element[property] == 'string' && element[property])
				returnString += ': <div style="background:#C9C9C9;border:1px solid black; overflow:auto;"><code>' +
									element[property].replace(/</g, '<').replace(/>/g, '>') + '</code></div>';
			if ((typeof element[property] == 'object') && (depth <limit))
				returnString += var_dump(element[property], limit, (depth + 1));
			returnString += '</li>';
		}
	}
	returnString += '</ol>';
	if(depth == 0)
	{
		winpop = window.open("", "","width=800,height=600,scrollbars,resizable");
		winpop.document.write('<pre>'+returnString+ '</pre>');
		winpop.document.close();
	}
	return returnString;
}