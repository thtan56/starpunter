$(document).ready(function() {
    // page is now ready, initialize the calendar...
    var $calendar = $('#calendar').fullCalendar({
      weekends: false, // hide
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      dayClick: function() {
        alert('a day has been clicked');
      },
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function() {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          // if so, remove the element from the "Draggable Events" list
          $(this).remove();
        }
      }
    })
  });
  