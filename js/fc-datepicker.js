// Create calendar when document is ready
$(document).ready(function() {
  $("#trash").droppable();  // Trash init
  //============================================================== 
  var $calendar = $("#calendar").fullCalendar(
    { // Start of options
      header: {
        left: 'prevYear,nextYear',
        center: 'title',
        right: 'today,month,agendaDay,agendaWeek prev,next'
      },
      themeSystem: 'jquery-ui',
      defaultView: 'agendaWeek',
      events: 'php/fc-getPeriods.php',      // load all the events from mysql period table
      //=== function 2 ====================================================
      selectable: true,  
      select: function(start, end, allDay) { 
        var dialogTitle = $('#calCreateEventDialog').find('#eventDescription').val().trim() != "" 
              ? $('#eventDescription').val() : "Appointment";
        $('#calCreateEventDialog').find('#eventTitle').val("Appointment");
        $('#calCreateEventDialog').find('#eventDescription').html("<b>" 
          + start.format("dddd, MMMM Do YYYY") + " from " 
          + start.format("hh:mm a") + " to " + end.format("hh:mm a") + "</b>");
        $('#calCreateEventDialog').data({ 'start':start, 'end':end });
        $('#calCreateEventDialog').dialog({title: "Event: " + dialogTitle});
        $('#calCreateEventDialog').dialog('open');
      }, // End select callback      
      editable: true,   // Allow modifying event by drag and drop
      eventClick: function(event){
        $('#calModifyEventDialog').find('#eventDescription').html("<b>" 
            + event.start.format("dddd, MMMM Do YYYY") + " from " 
            + event.start.format("hh:mm a")            + " to " + event.end.format("hh:mm a") + "</b>");
        $('#calModifyEventDialog').data({'event':event});
        $('#calModifyEventDialog').dialog({title: "Event: " + event.title}); // Set dialog title dynamically, according to selected event
        $('#calModifyEventDialog').find("#eventTitle").val(event.title);  // Set title field to current event's title   
        $('#calModifyEventDialog').dialog('open');    // Open dialog
      } // End eventClick callback        
    } // End of calendar options
  );
});   // End of $(document)      
// Create Event Dialog JavaScript **************************************
$('#calCreateEventDialog').dialog({
  resizable: false,
  autoOpen: false,
  modal: true,
  width: 500,
  buttons: {
    Create: function() {      
      var start = $(this).data('start');     // Get start and end dates from data payload
      var end = $(this).data('end');
      var eventTitle = $(this).find("#eventTitle").val().trim();    
      var event = {     // Build event
        title: eventTitle != "" ? eventTitle: "Appointment",
        color: 'DeepSkyBlue',
        textColor: 'black',
        start: start.format(),
        end: end.format()
      }       
      $("#calendar").fullCalendar('renderEvent', event, true);  // Save event locally in fullCalendar's event array
      $("#calendar").fullCalendar('unselect');    // Unselect event. Selection trail will disappear.
      $(this).dialog('close');      // Close dialog
    },  // Create
    Cancel: function() { $(this).dialog('close'); }
  }    // end of buttons
 });
 // Modify Event Dialog ********************************************************
 $('#calModifyEventDialog').dialog({
  resizable: false,
  autoOpen: false,
  modal:true,
  width: 500,
  buttons: {
    Modify: function() {
      var event = $(this).data('event');  // Load event object from data payload
      var title = $(this).find("#eventTitle").val().trim(); // Get title from dialog
      event.title = title != "" ? title : "Appointment";  // Get event title or assign default if empty
      $("#calendar").fullCalendar('updateEvent', event);  // Instantly update event in calendar
      $(this).dialog('close');
    },
    Remove: function() {      // Remove the selected event
      var event = $(this).data('event');
      var response = confirm("Remove event '" + event.title +"'?");
      if (response == true){ $("#calendar").fullCalendar("removeEvents", event._id);  };
      $(this).dialog('close');
    },
    Cancel: function() { $(this).dialog('close'); }
  }
});
// Function to allow interaction between the datepicker
// and the calendar.
$(function() {
  $( "#small_calendar" ).datepicker({    // If date clicked
    'onSelect':function(dt,dobj){
      $("#calendar").fullCalendar('gotoDate',dt); // Tell calendar to navigate to date selected
    },
    // If month or year changed
    'onChangeMonthYear':function(year,month, dobj){
      // Move to first day of that month.
      // We have to substract 1 from month to
      // make it compatible with fullCalendar
      var dt = new Date(year,month - 1,1);
      // Tell calendar to navigate to date selected
      $("#calendar").fullCalendar('gotoDate',dt);
    }
  });
});
