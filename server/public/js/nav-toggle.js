$(document).ready(function(){
	$("#drop-nav").hide();
	
	$("#toggle-nav").click(function(){
		$("#drop-nav").toggle();
	});
});

$(document).ready(function(){
	
	$(window).resize(function() {
    	$('.container').height($(window).height() -32);
	});

	$(window).trigger('resize');
});

