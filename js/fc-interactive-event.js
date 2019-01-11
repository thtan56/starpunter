// Create calendar when document is ready
$(document).ready(function() {
  // We will refer to $calendar in future code
  var $calendar = $("#calendar").fullCalendar({
    // Start of calendar options
    header: {
      left: 'title',    
      center: '',
      right: 'today,month,agendaDay,agendaWeek prev,next'
    },
    // Make possible to respond to clicks and selections
    selectable: true,
    // This is the callback that will be triggered when a selection is made.
    // It gets start and end date/time as part of its arguments
    select: function(start, end, jsEvent, view) {
      // Ask for a title. If empty it will default to "New event"
      var title = prompt("Enter a title for this event", "New event");
      // If did not pressed Cancel button
      if (title != null) {
        var event = {        // Create event
          title: title.trim() != "" ? title : "New event",
          start: start,
          end: end
        };
        // Push event into fullCalendar's array of events
        // and displays it. The last argument is the
        // "stick" value. If set to true the event
        // will "stick" even after you move to other
        // year, month, day or week.
        $calendar.fullCalendar("renderEvent", event, true);
      };
      // Whatever happens, unselect selection
      $calendar.fullCalendar("unselect");
    } // End select callback
  } // End of calendar options
  );
});
 