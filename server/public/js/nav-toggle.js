$(document).ready(function(){
	$("#drop-nav").hide();
	
	$("#toggle-nav").click(function(){
		$("#drop-nav").toggle();
	});
	
	$(window).resize(function() {
    	$('.container').height($(window).height() -50);
	});

	$(window).trigger('resize');
});

$(document).ready(function(){
});

