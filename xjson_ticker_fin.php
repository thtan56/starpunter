<?php
//header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "cancer56", "test");

$condition="stocks.ticker2 ='".$_GET['ticker']."'";

$sql = "SELECT  stocks.ticker2 as ticker, concat(fintable.year,'q',fintable.quarter) as qtr, fintable.eps as eps, ".
	" fintable.dividend as dividend, fintable.profit_margin as pm, ".
	" fintable.unit_price as price ".
	" FROM stocks ". 
	" INNER JOIN fintable ON stocks.ticker2 = fintable.ticker ".
    " WHERE ". $condition .
    " ORDER BY fintable.date_announced ";

//$sql = "SELECT  ticker2 as label, lastprice as y".
//	" FROM stocks ".
//    " WHERE ".$condition;

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
