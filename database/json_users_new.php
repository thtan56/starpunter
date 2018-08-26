<?php

require __DIR__ . '/../vendor/autoload.php';   // goto parent first
use Monolog\Logger;						// load Monolog library
use Monolog\Handler\StreamHandler;
use Monolog\Handler\LogmaticHandler;
use Monolog\Formatter\JsonFormatter; 

$logger = new Monolog\Logger('channel_name');		// create a log channel
$formatter = new JsonFormatter();		// create a Json formatter
$stream = new StreamHandler(__DIR__.'/application-json.log', Logger::DEBUG);	// create a handler
$stream->setFormatter($formatter);
$logger->pushHandler($stream);		// bind
//---- start logging from here ----------------------------- 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

$conn = mysqli_connect("localhost", "root", "cancer56", "test");

$logger->info('_POST:', $_POST);

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query  = 'INSERT INTO USERS (username, email) VALUES (?, ?)';

$stmt = mysqli_prepare($conn, $query);

mysqli_stmt_bind_param($stmt, "ss", $_POST['username'], $_POST['email']);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

$responses=array("message"=>"success");
//$results=json_encode($data_points, JSON_PRETTY_PRINT); JSON_NUMERIC_CHECK
//echo($results);
//die();

mysqli_close($conn);
echo json_encode($responses, JSON_PRETTY_PRINT);



//	var values = [ req.body['username'], req.body['email'], req.body['password'], req.body['role'], req.body['bankbsb'], req.body['bankaccount'],
//	req.body['firstname'], req.body['lastname'], req.body['address1'], req.body['address2'], req.body['town'], req.body['postcode'], req.body['country'] ];
//	res.locals.connection.query(qry1+qry2, values, 
//		function(err,result) {
//			if (err) throw err;
//			res.send('User added to database with ID:');
//		}
//	);
//
//	" fintable.dividend as dividend, fintable.profit_margin as pm, ".
//	" fintable.unit_price as price, fintable.date_announced as date ".
//switch ($_GET['type']) {
//	case 'F': $cond = "stocks.isfavorite='".$_GET['groupid']."'"; break;
//	case 'S': $cond = "stocks.sector='"    .$_GET['groupid']."'"; break;


//		  ' (username, email, password, role, bankbsb, bankaccount, firstname, lastname, address1, address2, town, postcode, country)'.
//		  ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';	
?>
