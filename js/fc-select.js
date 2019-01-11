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
    // This is the callback that will be triggered when a selection is made
    select: function(start, end, jsEvent, view) {
      alert(start.format("MM/DD/YYYY hh:mm a") + " to " + end.format("MM/DD/YYYY hh:mm a") + " in view " + view.name);
    }
  } // End of calendar options
  );
});
