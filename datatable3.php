<?php
include 'php/config.php';
// Notes:
//   on new selection, the new datatable gets append to the bottom ???????
//


/* Connect to a MySQL database using driver invocation */
/*
$dsn = 'mysql:dbname=testdb;host=127.0.0.1';
$user = 'dbuser';
$password = 'dbpass';

try {
    $dbh = new PDO($dsn, $user, $password);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}

*/


$conn = mysqli_connect("localhost", "root", "cancer56", "test");
$query = 'select sector, count(*) from stocks where sector <> "" group by sector';
$tab_result = mysqli_query( $conn, $query);
$count=0;
$tab_menu = '';
while($row = mysqli_fetch_array($tab_result)) {
  $tab_menu .= '<li role="presentation"'. (($count==0) ? ' class=active">' : '>').
               '<a href="#'.$row["sector"].'" aria-controls="'.$row["sector"].'" data-toggle="tab" role="tab" '.
               'id="'. $row["sector"].'" onclick="sectorsDataTables(this.id)">'.
               $row["sector"].'</a></li>';
  $count++;
}
//  - 2) favorite
$query = 'select isfavorite, count(*) from stocks group by isfavorite';
$tab_result = mysqli_query( $conn, $query);
$dd_menu = '';
while($row = mysqli_fetch_array($tab_result)) {
  $dd_menu .= '<li><a href="#'.$row["isfavorite"].'" aria-controls="'.$row["isfavorite"].'" data-toggle="tab" role="tab" '.
               'id="'. $row["isfavorite"].'" onclick="favoritesDataTables(this.id)">'.
               $row["isfavorite"].'</a></li>';
}
//
mysqli_close($conn);
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Index Page</title>


    <!-- Our Custom CSS -->
    <link href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css" rel="stylesheet"><!-- latest -->
    <link href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap.min.css" rel="stylesheet"><!-- latest -->

    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">  
  </head>
  <body>



<div class="row" >
  <div class="col-md-6">
    <div class="panel panel-primary">
      <div class="panel-heading">Sectors Panel</div>
      <div class="panel-body" style="font-size: small">
        <div role="tabs">
          <ul role="tablist" class="nav nav-tabs"><?php echo $tab_menu; ?></ul>
          <div class="tab-content">        
            <div role="tabpanel" class="tab-pane fade active in" id="sectors">
              <div class="table-responsive">
                <table class="table table-striped table-bordered" id="sectorsTable"></table>  
              </div>
            </div>         
          </div>           
        </div>             
      </div>              
    </div>                
  </div>
  <div class="col-md-6 my-2">
    <div class="panel panel-info">
      <div class="panel-heading">Favorites Panel</div>
      <div class="panel-body" style="font-size: small">
        <!-- bootstrap component - dropdown -->
        <div class="dropdown">
          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" 
                data-toggle="dropdown" aria-haspopup="true"aria-expanded="true">
            Favorites
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <?php echo $dd_menu; ?>
          </ul>
        </div>      <!-- dropdown -->
        <div class="table-responsive">
          <table class="table table-striped table-bordered" id="favoritesTable"></table>
        </div>
      </div>
    </div>
  </div>
</div> 

<script src="http://code.jquery.com/jquery-3.3.1.js"></script>   
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>   <!-- latest -->
<script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap.js"></script>
</body>
<script>
$(document).ready(function(){
    console.log('1) jQuery started: a data-toggle');
    $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        var currentTab = $(e.target).text();        // get current tabs
        console.log('1a) current tab (selected):'+currentTab);
    });
    console.log('2) load stocksTable-sectors');
    $('#sectorsTable').DataTable({        // html table with class=table
         //default is lfrtip 
      pageLength: 10,
      ajax: {
        url:'/database/stocksSector.php',                 // load user datatable
        dataSrc: "",
        data: {sector: 'FINANCE'}             // problem if add success function
      },
      columns: [
              { data: 'id', name: 'Id', title: 'Id'},
              { data: 'ticker', name: 'Ticker', title: 'Ticker' },
              { data: 'sector', name: 'Sector', title: 'Sector'},
              { data: 'pe', name: 'PE', title: 'PE Ratio'},
              { data: 'earning', name: 'EPS', title: 'Earning'},
              { data: 'dividend', name: 'DPS', title: 'Dividend'},
              { data: 'lastprice', name: 'Price', title: 'Latest Price'},
              { data: 'retavg', name: 'RetAvg', title: 'Avg Returns'},
              { data: 'stddev', name: 'StdDev', title: 'Std Dev'},
              { data: 'sharpe', name: 'Sharpe', title: 'Sharpe'},
              { data: 'maxdrawdown', name: 'MaxDrawDown', title: 'Max DrawDown'}   
      ],
      columnDefs: [{targets: 6,       // lastprice
                        render: function ( data, type, row ) {
                          var color = (data > 10) ? '#32CD32' : (data > 4.99) ? 'blue' : 'red';                      
                          var data2 = $.fn.dataTable.render.number('','.',2,'$').display(data);
                          return '<span style="color:' + color + '">' + data2 + '</span>'; }},
                      {targets: 7,       // avg returns
                        render: function ( data, type, row ) {
                          var color = (data < 0.005) ? 'red' : '#32CD32';    // red < 0.5%                  
                          return '<span style="color:' + color + '">' + data + '</span>'; }},   
                      {targets: 8,       // std dev
                        render: function ( data, type, row ) {
                          var color = (data > 0.10) ? 'red' : '#32CD32';    // red > 10%                   
                          return '<span style="color:' + color + '">' + data + '</span>'; }},    
                      {targets: 9,       // sharpe
                        render: function ( data, type, row ) {
                          var color = (data < 1) ? 'red' : '#32CD32';    // red < 1
                          var data2 = $.fn.dataTable.render.number('','.',2,'').display(data);                  
                          return '<span style="color:' + color + '">' + data2 + '</span>';}},                                             
                      {targets: 10,       // max draw down
                        render: function ( data, type, row ) {           // red > 10 % down
                          var color = (data < -0.09) ? 'red' : (data < -0.05) ? 'blue' : '#32CD32';  
                          var data2 = $.fn.dataTable.render.number('','.',2,'').display(data);                      
                          return '<span style="color:' + color + '">' + data2 + '</span>'; }},                                           
      ]
    });      // DataTable
});    
function sectorsDataTables(sid) {
  console.log('5) sector clicked:'+sid);
  var table = $('#sectorsTable').DataTable({        // html table with id=sectorsTable
        paging: true,
        destroy: true,                              // destroy before re-initialised since datatable already existed
        ajax: {
          url:'/database/stocksSector.php',                     // load posts datatable
          data: {sector: sid},
          dataSrc: ""
        },
        columns: [       // title displace as column title
              { data: 'id', name: 'Id', title: 'Id',
                  render: function(data,type,row,meta) {
                     return '<a href='+data+'/edit>'+data+'</a>';
                  }},      
              { data: 'ticker', name: 'Ticker', title: 'Ticker',
                      render: function(data, type, row, meta) {
                        return '<a href=/charts/candlestick?tickerid='+encodeURIComponent(data)+'>'+data+'</a>';
                      }
              },
              { data: 'sector', name: 'Sector', title: 'Sector'},
              { data: 'pe', name: 'PE', title: 'PE Ratio',
                  render: $.fn.dataTable.render.number('','.',2,'') },
              { data: 'earning', name: 'EPS', title: 'Earning'},
              { data: 'dividend', name: 'DPS', title: 'Dividend'},
              { data: 'lastprice', name: 'Price', title: 'Latest Price'},    
              { data: 'retavg', name: 'RetAvg', title: 'Avg Returns'},
              { data: 'stddev', name: 'StdDev', title: 'Std Dev'},
              { data: 'sharpe', name: 'Sharpe', title: 'Sharpe'},
              { data: 'maxdrawdown', name: 'MaxDrawDown', title: 'Max DrawDown'}  
        ],
        columnDefs: [{targets: 6,       // lastprice
                        render: function ( data, type, row ) {
                          var color = (data > 10) ? '#32CD32' : (data > 4.99) ? 'blue' : 'red';                      
                          var data2 = $.fn.dataTable.render.number('','.',2,'$').display(data);
                          return '<span style="color:' + color + '">' + data2 + '</span>';
                        }
                      },
                      {targets: 7,       // avg returns
                        render: function ( data, type, row ) {
                          var color = (data < 0.005) ? 'red' : '#32CD32';    // red < 0.5%                  
                          return '<span style="color:' + color + '">' + data + '</span>';
                        }
                      },   
                      {targets: 8,       // std dev
                        render: function ( data, type, row ) {
                          var color = (data > 0.10) ? 'red' : '#32CD32';    // red > 10%                   
                          return '<span style="color:' + color + '">' + data + '</span>';
                        }
                      },    
                      {targets: 9,       // sharpe
                        render: function ( data, type, row ) {
                          var color = (data < 1) ? 'red' : '#32CD32';    // red < 1
                          var data2 = $.fn.dataTable.render.number('','.',2,'').display(data);                  
                          return '<span style="color:' + color + '">' + data2 + '</span>';
                        }
                      },                                             
                      {targets: 10,       // max draw down
                        render: function ( data, type, row ) {           // red > 10 % down
                          var color = (data < -0.09) ? 'red' : (data < -0.05) ? 'blue' : '#32CD32';  
                          var data2 = $.fn.dataTable.render.number('','.',2,'').display(data);                      
                          return '<span style="color:' + color + '">' + data2 + '</span>';
                        }
                      },                                           
        ]
  });        // DataTable
}            // function
//     2nd sector table
function favoritesDataTables(sid) {
  console.log('6) favorite selected:'+sid);
  var table = $('#favoritesTable').DataTable({        // html table with id=sectorsTable
        paging: true,
        destroy: true,                              // destroy before re-initialised since datatable already existed
        ajax: {
          url:'/database/stocksFav.php',                     // load posts datatable
          data: {favorite: sid},                    // pass parameters to ajax
          dataSrc: ""
        },
        columns: [       // title displace as column title
              { data: 'id', name: 'Id', title: 'Id',
                  render: function(data,type,row,meta) {
                     return '<a href='+data+'/edit>'+data+'</a>';
                  }},      
              { data: 'ticker', name: 'Ticker', title: 'Ticker',
                      render: function(data, type, row, meta) {
                        return '<a href=/charts/candlestick?tickerid='+encodeURIComponent(data)+'>'+data+'</a>';
                      }
              },
              { data: 'sector', name: 'Sector', title: 'Sector'},
              { data: 'pe', name: 'PE', title: 'PE Ratio',
                  render: $.fn.dataTable.render.number('','.',2,'') },
              { data: 'earning', name: 'EPS', title: 'Earning'},
              { data: 'dividend', name: 'DPS', title: 'Dividend'},
              { data: 'lastprice', name: 'Price', title: 'Latest Price'},    
              { data: 'retavg', name: 'RetAvg', title: 'Avg Returns'},
              { data: 'stddev', name: 'StdDev', title: 'Std Dev'},
              { data: 'sharpe', name: 'Sharpe', title: 'Sharpe'},
              { data: 'maxdrawdown', name: 'MaxDrawDown', title: 'Max DrawDown'}  
        ],
        columnDefs: [{targets: 6,       // lastprice
                        render: function ( data, type, row ) {
                          var color = (data > 10) ? '#32CD32' : (data > 4.99) ? 'blue' : 'red';                      
                          var data2 = $.fn.dataTable.render.number('','.',2,'$').display(data);
                          return '<span style="color:' + color + '">' + data2 + '</span>'; }},
                      {targets: 7,       // avg returns
                        render: function ( data, type, row ) {
                          var color = (data < 0.005) ? 'red' : '#32CD32';    // red < 0.5%                  
                          return '<span style="color:' + color + '">' + data + '</span>';  }},   
                      {targets: 8,       // std dev
                        render: function ( data, type, row ) {
                          var color = (data > 0.10) ? 'red' : '#32CD32';    // red > 10%                   
                          return '<span style="color:' + color + '">' + data + '</span>'; }},    
                      {targets: 9,       // sharpe
                        render: function ( data, type, row ) {
                          var color = (data < 1) ? 'red' : '#32CD32';    // red < 1
                          var data2 = $.fn.dataTable.render.number('','.',2,'').display(data);                  
                          return '<span style="color:' + color + '">' + data2 + '</span>'; }},                                             
                      {targets: 10,       // max draw down
                        render: function ( data, type, row ) {           // red > 10 % down
                          var color = (data < -0.09) ? 'red' : (data < -0.05) ? 'blue' : '#32CD32';  
                          var data2 = $.fn.dataTable.render.number('','.',2,'').display(data);                      
                          return '<span style="color:' + color + '">' + data2 + '</span>'; }},                                           
               ]
  });  
};
</script>
</html>
