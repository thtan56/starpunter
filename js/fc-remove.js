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
    selectable: true,   // Make possible to respond to clicks and selections
    //================================================================
    // This is the callback that will be triggered when a selection is made.
    // It gets start and end date/time as part of its arguments
    select: function(start, end, jsEvent, view) {   // Ask for a title. If empty it will default to "New event"    
      var title = prompt("Enter a title for this event", "New event");    
      if (title != null) {   // If did not pressed Cancel button
        var event = {        // Create event
          title: title.trim() != "" ? title : "New event",
          start: start,
          end: end,          
          color: "lightBlue",     // Changed default colors to make delete links more obvious
          textColor: "black"
        };  
        // Push event into fullCalendar's array of events
        // and displays it. The last argument is the
        // "stick" value. If set to true the event
        // will "stick" even after you move to other
        // year, month, day or week.
        $calendar.fullCalendar("renderEvent", event, true);
      };
      $calendar.fullCalendar("unselect");   // Whatever happens, unselect selection
    }, // End select callback
    editable : true,        // Make events editable, globally
    eventClick: function(event, jsEvent, view){       // Callback triggered when we click on an event
      // Ask for a title. If empty it will default to "New event"
      var newTitle = prompt("Enter a new title for this event", event.title);
      // If did not pressed Cancel button
      if (newTitle != null) {
        // Update event
        event.title = newTitle.trim() != "" ? newTitle : event.title;
        // Call the "updateEvent" method
        $calendar.fullCalendar("updateEvent", event);
      }
    }, // End callback eventClick
    // Callback triggered just before an event is rendered
    eventRender: function(event, element){
      $(element).find(".fc-content").append("<div style='float:right'><a class='delete-link' href='javascript:remove_event(\""
      + event._id + "\")'>Delete</a></div>");
      // This is our fix for our confirm dialog problem
      // all delete-links will stop the propagation of the click
      // event.
      $(element).find('.delete-link').click(function(e) { 
        // This will stop the propagation of the click event
        // and it will not trigger eventClick callback
        e.stopImmediatePropagation(); 
      });
    }, // End callback eventRender
  } // End of calendar options
  );
});
// Global instance of the calendar to be used in other scripts.
var $calendar = $("#calendar").fullCalendar("getCalendar");
function remove_event(eventID){     // Removes event with ID eventID from calendar
  var remove = confirm("Remove event ID " + eventID + "?");
  if(remove == true){
    $calendar.fullCalendar("removeEvents", eventID);
  };
};
