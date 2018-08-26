<?php
// previous - json_fav_data.php
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "cancer56", "test");

if ($_GET['type']=='F') {
	$condition="stocks.isfavorite ='".$_GET['groupid']."'";	
} else {
	$condition="stocks.sector ='".$_GET['groupid']."'";
};

$condition2  = "1";
if(isset($_GET['price_range'])){
	$condition2  = " daily_prices.close < ".$_GET['price_range'];
}

$sql = "SELECT  stocks.ticker2 as ticker, daily_prices.date as date, daily_prices.close as price".
	" FROM stocks, daily_prices ".
    " where stocks.ticker = daily_prices.ticker AND ". $condition . " and " . $condition2 ;

//$sql2 = "SELECT  stocks.ticker2 as ticker, daily_prices.date as date, daily_prices.close as price".
//	" FROM stocks, daily_prices ".
 //   " where stocks.ticker = daily_prices.ticker ".
 //   " AND stocks.ticker2='SUNCON'";


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
