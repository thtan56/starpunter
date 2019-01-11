$(document).ready(function(){
  $("#sel_org").change(function(){
    var orgid = $(this).val();      // get value here
    console.log("testajax.js");
    console.log(orgid);
    $.ajax({ 
      type: "GET",   
      url: "php/fc-getOrgTeams.php",
      dataType: "json",
      data: { id: orgid }, 
      async: false,
      success : function(response) {
        console.log(response);
        var len = response.length;
        $("#sel_team").empty();
        for( var i = 0; i<len; i++){
          // var id = response[i]['id'];
          var name = response[i];
          console.log(name);
          $("#sel_team").append("<option value='"+name+"'>"+name+"</option>");
        }
      }    // success
    });   // ajax
  });     // select organiser change
});

