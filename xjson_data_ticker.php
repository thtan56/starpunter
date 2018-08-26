<?php
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "cancer56", "test");
$sql = "SELECT  stocks.ticker2 as ticker, daily_prices.date as date, daily_prices.close as price".
	" FROM stocks, daily_prices ".
    " where stocks.ticker = daily_prices.ticker ".
    " AND stocks.ticker2 ='".$_GET['tickerid']."'";
$resultset = mysqli_query($conn, $sql) or die("database error:". mysqli_error($conn));
$data_points = array();
while( $rows = mysqli_fetch_assoc($resultset) ) {
//    $point = array("date" => $rows['date'] , "price" => $rows['price']);
//    array_push($data_points, $point); 
	$data_points[] = $rows;
}
mysqli_close($conn);
echo json_encode($data_points, JSON_NUMERIC_CHECK);
?>