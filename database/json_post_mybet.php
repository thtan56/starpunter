<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

require __DIR__ . '/../vendor/autoload.php';   // goto parent first
use Monolog\Logger;                     // load Monolog library
use Monolog\Handler\StreamHandler;
use Monolog\Handler\LogmaticHandler;
use Monolog\Formatter\JsonFormatter; 

$logger = new Monolog\Logger('channel_name');       // create a log channel
$formatter = new JsonFormatter();       // create a Json formatter
$stream = new StreamHandler(__DIR__.'/application-json.log', Logger::DEBUG);    // create a handler
$stream->setFormatter($formatter);
$logger->pushHandler($stream);      // bind

$data = file_get_contents('php://input');
$json = json_decode($data);

$conn = mysqli_connect("localhost", "root", "cancer56", "test");
$sql = "update mybet set ";
$sql .= " bet_score1 = ". $json->{'data'}->{'bet_score1'};
$sql .= " ,bet_amount = ". $json->{'data'}->{'bet_amount'};
$sql .= " ,bet_type = '". $json->{'data'}->{'bet_type'}."'";    // quote for string
$sql .= " ,bet_odd_type = '". $json->{'data'}->{'bet_odd_type'}."'";
$sql .= " where id = ".$json->{'data'}->{'id'};

$logger->info('1) json_post_mybetr.php', array('op' => $sql) );

$resultset = mysqli_query($conn, $sql) or die("database error:". mysqli_error($conn));
mysqli_close($conn);

//$sql .= " ,bet_score2 = ". $json->{'data'}->{'bet_score2'};   // skip for null

//Populate POST variable with incoming JSON from Axios.
//if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)):
//	$_POST = (array) json_decode(file_get_contents('php://input'), true);
//endif;

// print_r($_POST);
//    $array = $obj->search($_POST['query']);

//    echo json_encode(array_values($array));
?>
