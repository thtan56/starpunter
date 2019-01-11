<?php
header('Content-Type: application/json');

$condition = "1";
if(isset($_GET['tickerid'])){
   $condition = " ticker=".$_GET['tickerid'];
}

$conn = mysqli_connect("localhost", "root", "cancer56", "test");
$sql = "SELECT  stocks.ticker2 as ticker, daily_prices.date as date, daily_prices.close as price".
	" FROM stocks, daily_prices ".
    " WHERE stocks.ticker = daily_prices.ticker ".
    " AND ". $condition ;
$resultset = mysqli_query($conn, $sql) or die( mysqli_error($conn) );
$data_points = array();
while( $rows = mysqli_fetch_assoc($resultset) ) {
	$data_points[] = $rows;
}
mysqli_close($conn);
echo json_encode($data_points, JSON_NUMERIC_CHECK);
?>