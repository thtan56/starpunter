// initialize the external events
// -----------------------------------------------------------------
$('#external-events .fc-event').each(function() {
  // store data so the calendar knows to render an event upon drop
  $(this).data('event', {
    title: $.trim($(this).text()), // use the element's text as the event title
    stick: true // maintain when user navigates (see docs on the renderEvent method)
  });

  // make the event draggable using jQuery UI
  $(this).draggable({
    zIndex: 999,
    revert: true,      // will cause the event to go back to its
    revertDuration: 0  //  original position after the drag
  });
});
// -----------------------------------------------------------------
// Create calendar when document is ready
$(document).ready(function() {
  $('input[type=radio][name=organiser]').change(function() {          // function 1
    console.log("radio change"+this.value);
    $.ajax({
      url: "php/fc-getGames.php",
      type: "GET",
      data: {orgid: this.value},
      dataType: 'json',
      success: function(responses) {
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', responses);
      }
    });
  });

  $("#trash").droppable();  // Trash init
  //============================================================== 
  // We will refer to $calendar in future code
  var $calendar = $("#calendar").fullCalendar(            // function 2
    { // Start of options
      header: {
        left: 'prevYear,nextYear',
        center: 'title',
        right: 'today,month,agendaDay,agendaWeek prev,next'
      },
      themeSystem: 'jquery-ui',
      defaultView: 'month',
      events: 'php/fc-getGames.php',      // load all the events from mysql event table
      //=== function 2 ====================================================
      selectable: true,   // Make possible to respond to clicks and selections
      select: function(start, end, allDay) { 
        console.log("select-add event");
        var title = "Appointment";
        var organiser = $("input[name='organiser']:checked").val();
        console.log(organiser);    
        //--------------------------
        var gamecblist = getGame(organiser+',,');    
        //-----------------------------
        var eventDescription = "<b>" + start.format("dddd, MMMM Do YYYY") 
            + " from " + start.format("hh:mm a") + " to " + end.format("hh:mm a") + "</b>"+
            '<div class="row">'+gamecblist +'</div>';
        //    "Organiser:"+organiser+"<br>"+cbHomeTeam+cbAwayTeam+'</div>';
        swal({
          title: title,
          html: eventDescription,
          focusConfirm: false,
          preConfirm: () => {
            return organiser + "," +
                  $('.home_team:checked').val() + "," + 
                  $('.away_team:checked').val();
          },
//          input: 'text',
          showCancelButton: true,
          confirmButtonText: 'Add',
          // Close dialog if user clicks outside
          allowOutsideClick: () => !swal.isLoading()
        }).then((result) => {
          if (result.value) {
            var event = {            // Build event
              title: result.value,          // get data from input
              color: 'DeepSkyBlue',
              textColor: 'black',
              start: start.format(),
              end: end.format()
            };          
            $("#calendar").fullCalendar('renderEvent', event, true);     // Save event locally in fullCalendar's event array 
            $("#calendar").fullCalendar('unselect');   // Unselect event. Selection trail will disappear.
            //------ b) fc-add =----------------
            start=moment(event.start).format('Y-MM-DD HH:mm:ss');
            end=moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss');
            console.log("start/end:"+start+"/"+end);
            $.ajax({
              url: "php/fc-addGame.php",
              type: "POST",
              data: {title: event.title, start: start, end: end},
              success: function(data) {  }
            });
            //--------------------
          }
        });   // end of swal
      },    // end of select        
      // === function 3 ==================================
      editable: true,         // function 1
      eventClick: function(event, jsEvent, view){         // Callback triggered when we click on an event
        console.log("eventClick-modify event");
        var gamecblist = getGame(event.title);        
        var gamecomponent = event.title.split(',');
        var organiser = gamecomponent[0];

        event.end=(event.end != null) ? moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm a')
                                : moment(event.start).add(1, "hours").format('Y-MM-DD HH:mm');
        var eventDescription = "<b>" 
            + event.start.format("dddd, MMMM Do YYYY") + " from " + event.start.format("hh:mm a") + " to " + event.end + "</b>"+
            '<div class="row">'+gamecblist+'</div>';        
        swal({
          title: event.title,
          html: eventDescription,
          focusConfirm: false,
          preConfirm: () => {
            return organiser + "," +
                  $('.home_team:checked').val() + "," + 
                  $('.away_team:checked').val();
          },
          showCancelButton: true,
          confirmButtonText: 'Modify',            
          onOpen: () => {    },
          allowOutsideClick: () => !swal.isLoading()      // Close dialog if user clicks outside
        }).then( (result) => {
          console.log('eventClick');
          if (result.value) {
            event.title = result.value;   // Modify event title
            $calendar.fullCalendar("updateEvent", event);       // Call the "updateEvent" method
            //-------- c) fcupdate ---------------
            start=moment(event.start).format('Y-MM-DD HH:mm:ss');
            end=moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss');
            $.ajax({
              url: "php/fc-updateGame.php",
              type: "POST",
              data: {title: event.title, start: start, end: end, id: event.id },
              success: function(data) { }
            });    // ajax
          }
        });   // then 
      }, // End callback eventClick
      //=== function 4 ===============================================
      droppable: true,    // this allows things to be dropped onto the calendar
      drop: function() {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          $(this).remove();     // if so, remove the element from the "draggable events" list
        };
        console.log("drop");
      },
      eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
        //-------- f) fcadd: move cell 2 cell ---------------
        start=moment(event.start).format('Y-MM-DD HH:mm:ss');
        end=moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss');
        console.log("eventDrop: start/end:"+start+"/"+end);
        console.log(event);
        $.ajax({
          url: "php/fc-updateGame.php",
          type: "POST",
          data: {title: event.title, start: start, end: end, id: event.id },
          success: function(data) { }
        });    // ajax
      },
      eventReceive: function(event) {
        //-------- e) fcadd: drop in ---------------
        start=moment(event.start).format('Y-MM-DD HH:mm:ss');
        if (event.end != null) { end=moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss');
        } else {                 end=moment(event.start).add(1, "hours").format('Y-MM-DD HH:mm:ss'); };
        console.log("eventReceive(add): start/end:"+start+"/"+end);
        console.log(event);
        $.ajax({
          url: "php/fc-addGame.php",
          type: "POST",
          data: {title: event.title, start: start, end: end},
          success: function(data) {     //  $calendar.fullCalendar('refetchEvents');
//            alert('Added Successfully');
          }
        });
      },
      dragRevertDuration: 0,    // Drag animation duration: none    
      eventDragStop: function(event, jsEvent, ui, view) {
        if(isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {
          $('#calendar').fullCalendar('removeEvents', event._id);    // use event's internal ID(_id) to remove selected event   
          var el = $( "<div class='fc-event'>" ).appendTo( '#external-events-listing' ).text( event.title );   //append 2 events-box
          el.draggable({
            zIndex: 999,
            revert: true, 
            revertDuration: 0 
          });
          el.data('event', { title: event.title, id :event.id, stick: true });
          //-------- d) fcremove ---------------
          console.log("id:"+event.id);
          $.ajax({
            url: "php/fc-deleteGame.php",
            type: "POST",
            data: {id: event.id },
            success: function(data) { 
              // alert('Delete Successfully'); 
            }
          });
        }
      },
    } // End of options
  );
});
var isEventOverDiv = function(x, y) {
  var external_events = $( '#external-events' );
  var offset = external_events.offset();
  offset.right = external_events.width() + offset.left;
  offset.bottom = external_events.height() + offset.top;
  // Compare
  if (x >= offset.left
      && y >= offset.top
      && x <= offset.right
      && y <= offset .bottom) { return true; }
  return false;
};
var getGame = function(gameTitle) {
  var gamecomponent = gameTitle.split(',');
  var organiser = gamecomponent[0];
  var teams = '';
  $.ajax({ type: "GET",   
    url: "php/fc-getOrgTeams.php",
    dataType: "json",
    data: { id: organiser }, 
    async: false,
    success : function(data) { teams=data; }
  });
  var cbHomeTeam='<div class="column"><strong>Home Team:</strong><br>';
  var cbAwayTeam='<div class="column"><strong>Away Team:</strong><br>';
  var homechecked="";
  var awaychecked="";
  for(var i=0; i<teams.length; i++) {
    homechecked = (gamecomponent[1] == teams[i]) ? "checked" : ""; 
    awaychecked = (gamecomponent[2] == teams[i]) ? "checked" : "";  
    cbHomeTeam += "<input type='checkbox' class='home_team' value='"+teams[i]+"' "+homechecked+ " />" + teams[i] + "<br/>";   
    cbAwayTeam += "<input type='checkbox' class='away_team' value='"+teams[i]+"' "+awaychecked+ " />" + teams[i] + "<br/>";
  };                      
  cbHomeTeam += '</div>';            
  cbAwayTeam += '</div>';
  return "Organiser:"+organiser+"<br>"+cbHomeTeam+cbAwayTeam;
}
//        for (var i = 0; i < doc.length; i++){
//          var obj = doc[i];
//          console.log(i);
//          console.log(doc);
/*


        $(doc).each(function() {
          console.log("hello"); 
          var start = $(this).attr('start');     
          console.log(start);

          end=start;
          var end = start;
          events.push({
            id:    $(this).attr('id'),
            title: $(this).attr('title'),
            start: start,
            end:   end
          });
          callback(events);
        });
*/    
//        $('#calendar').fullCalendar('addEventSource',events);

//        $('#calendar').fullCalendar('addEventSource', events);
//        $('#calendar').fullCalendar('refetchEvents');  
