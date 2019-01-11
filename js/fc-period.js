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
        defaultView: 'month',
        events: 'php/fc-getPeriods.php',      // load all the events from mysql period table
        //=== function 2 ====================================================
        selectable: true,   // Make possible to respond to clicks and selections 
        select: function(start, end, allDay) {
          console.log("select-add event");
          var title = "(eg enter 'Week 1' or 'Round 11')";
          var organiser = $("input[name='organiser']:checked").val();
          console.log(organiser); 
          var eventDescription = "<b>" + start.format("dddd, MMMM Do YYYY") 
                + "<br>from " + start.format("hh:mm a") + " to " + end.format("hh:mm a") + "</b><br>"
                + "<u>Organiser: " + organiser + "</u><br>";
            swal({
            title: title,
            html: eventDescription,
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Add',            
            allowOutsideClick: () => !swal.isLoading()          // Close dialog if user clicks outside
          }).then((result) => {
            if (result.value) {
              var event = {            // Build event
                title: organiser + "," + result.value,          // get data from input
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
                url: "php/fc-addPeriod.php",
                type: "POST",
                data: {title: event.title, start: start, end: end},
                success: function(data) { }
              });
            }
          });   // end of swal
        },    // end of select        
        // === function 3 ==================================
        editable: true,         // function 1
        eventClick: function(event){         // Callback triggered when we click on an event
          console.log("eventClick-modify event");
          var periodcomponent = event.title.split(',');
          var organiser = periodcomponent[0];

          var inputString='<br><input class="swal2-input" id="title" placeholder="Title"/><br>';
          inputString += '<input class="swal2-input" id="start" placeholder="Start Date"/><br>';
          inputString += '<input class="swal2-input" id="end" placeholder="End Date"/><br>';
          var eventDescription = "<b>" 
              + event.start.format("dddd, MMMM Do YYYY") + " from " + event.start.format("hh:mm a") + " to "
              + event.end.format("dddd, MMMM Do YYYY hh:mm a") + "</b>"
              + " Organiser: " + organiser + "<br>"+inputString;          
          swal({
            title: event.title,
            html: eventDescription,
            focusConfirm: false,
            preConfirm: () => {
              return [ $('#title').val(), $('#start').val(), $('#end').val()
              ]
            },   
            showCancelButton: true,
            confirmButtonText: 'Modify',            
            onOpen: () => {
              document.getElementById('title').value = event.title;   // old values as defaults
              document.getElementById('start').value = moment(event.start).format('Y-MM-DD HH:mm:ss');
              document.getElementById('end').value = moment(event.end).format('Y-MM-DD HH:mm:ss');
            },
            allowOutsideClick: () => !swal.isLoading()      // Close dialog if user clicks outside
          }).then( (result) => {
            console.log('eventClick');
            console.log(result);
            if (result.value) {
              event.title = result.value[0];   // Modify event title
              event.start = result.value[1];
              event.end   = result.value[2];
              $calendar.fullCalendar("updateEvent", event);       // Call the "updateEvent" method
              //-------- c) fcupdate ---------------
              start=moment(event.start).format('Y-MM-DD HH:mm:ss');
              end=moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss');
              $.ajax({
                url: "php/fc-updatePeriod.php",
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
        //-------- f) fcadd: move & drop in (date box 2 date box) ---------------
          start=moment(event.start).format('Y-MM-DD HH:mm:ss');
          end=moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss');
          console.log("eventDrop: start/end:"+start+"/"+end);
          $.ajax({
            url: "php/fc-updatePeriod.php",
            type: "POST",
            data: {title: event.title, start: start, end: end, id: event.id },
            success: function(data) { }
          });    // ajax
        },
        eventReceive: function(event) {
          //-------- e) fcadd: drop in ---------------
          var organiser = $("input[name='organiser']:checked").val();
          var periodcomponent = event.title.split(',');
          var orgtitle = (periodcomponent.length==1 ? organiser+','+event.title : event.title);

          start=moment(event.start).format('Y-MM-DD HH:mm:ss');
          end = (event.end != null) ? moment(event.end).subtract(1, "minutes").format('Y-MM-DD HH:mm:ss')
                                    : moment(event.start).add(1, "hours").format('Y-MM-DD HH:mm:ss'); 
          console.log("eventReceive(add): start/end:"+start+"/"+end);
          console.log(event);     // event._id = old id if drag for external events
          $.ajax({
            url: "php/fc-addPeriod.php",
            type: "POST",
            data: {title: orgtitle, start: start, end: end},
            success: function(data) { }
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
            el.data('event', { title: event.title, id :event._id, stick: true });
            //-------- d) fcremove ---------------
            console.log("id:"+event._id);
            $.ajax({
              url: "php/fc-deletePeriod.php",
              type: "POST",
              data: {id: event.id },
              success: function(data) { }
            });
          }
        },
      } // End of options
    );
  });
  //=====================================
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
  }
  