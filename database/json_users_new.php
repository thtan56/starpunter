<?php
require_once('../php/configDb.php');
//require_once('../php/configLog.php');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

//$logger = getLogger();
//$logger->info('_POST:', $_POST);

$data = file_get_contents('php://input');
$json = json_decode($data);

$pdo = getPdoConnection();
$stmt = $pdo->prepare('INSERT INTO USERS (username, email) VALUES (?, ?)');
$stmt->execute([ $_POST['username'], $_POST['email']	]);
$stmt = null;
$responses=array("message"=>"success");
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
