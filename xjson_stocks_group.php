<?php
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "cancer56", "test");

if ($_GET['type']=='F') {
	$condition="stocks.isfavorite ='".$_GET['groupid']."'";	
} else {
	$condition="stocks.sector ='".$_GET['groupid']."'";
};

$sql = "SELECT  ticker2 as ticker, lastprice as price".
	" FROM stocks ".
    " WHERE ".$condition;

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