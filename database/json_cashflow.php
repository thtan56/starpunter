<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$conn = mysqli_connect("localhost", "root", "cancer56", "test");
$sql = "SELECT *  FROM cash_flow where username ='".$_GET['username']."'";

$resultset = mysqli_query($conn, $sql) or die("database error:". mysqli_error($conn));
$data = array();
while( $rows = mysqli_fetch_assoc($resultset) ) {
	$data[] = $rows;
}
mysqli_close($conn);
echo json_encode($data);
?>