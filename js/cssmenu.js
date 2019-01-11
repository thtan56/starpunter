$(document).ready(function(){
  $("div[data-includeHTML]").each(function () {                
    $(this).load($(this).attr("data-includeHTML"));
  });
//active state  
  $(function() {
    $('li a').click(function(e) {
        console.log(e);
        e.preventDefault();
        var $this = $(this);
        $this.closest('ul').find('.active').removeClass('active');
        $this.parent().addClass('active');
        window.location.href = $(this).attr('href');    // otherwise no action
    });
  });
});
