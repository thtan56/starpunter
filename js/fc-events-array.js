// Create calendar when document is ready
$(document).ready(function() {
  // Array of events
  var events_array = [{
    title: "Event 1",
    start: moment().startOf('month'),   // Set to 1st of the month at 12:00 am
    end: moment().startOf('month').add(90, 'minutes'),    // Set to en the 1st of the month at 1:30 am
    color: "red"
  }, {
    title: "Event 2",
    start: moment().startOf('month').add(1, 'days'),     
    end: moment().startOf('month').add({    // Set to end the 1st of the month at 3:00 am
      'days': 1,
      'hours': 3
    }),
    color: "green"
  }, {
    title: "Multi-day event",
    start: moment().startOf('month'),
    end: moment().startOf('month').add(1, 'weeks'),  // Set to end one week after the start of the month
    color: "blue",
    allDay: true      // This is an all-day event
  },
  ];
  // We will refer to $calendar in future code
  var $calendar = $("#calendar").fullCalendar(
    { // Start of options
    header: {
      left: 'title',
      center: '',
      right: 'today,month,agendaDay,agendaWeek prev,next customPrevButton, customNextButton'
    },
    customButtons: {
      customPrevButton: {
          text: 'custom prev !',
          click: function () { alert('custom prev ! clicked !'); }
      },
      customNextButton: {
          text: 'custom ext!',
          click: function () { alert('custom ext ! clicked !');  }
      },
    },
    events: events_array
    } // End of options
  );
});

