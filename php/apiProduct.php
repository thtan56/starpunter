<?php
require_once('Product.php');
//------------------------------------------------------
//require __DIR__ . '/../vendor/autoload.php';   // goto parent first
//use Monolog\Logger;                     // load Monolog library
//use Monolog\Handler\StreamHandler;
//use Monolog\Handler\LogmaticHandler;
//use Monolog\Formatter\JsonFormatter; 

// $logger = new Monolog\Logger('channel_name');       // create a log channel
// $formatter = new JsonFormatter();       // create a Json formatter
// $stream = new StreamHandler(__DIR__.'/application-json.log', Logger::DEBUG);    // create a handler
//$stream->setFormatter($formatter);
// $logger->pushHandler($stream);      // bind
//---- start logging from here ----------------------------- 
// $logger->info('1) api.php', array('username' => 'Seldaek'));
//---- start logging from here ----------------------------- 
$data = file_get_contents('php://input');
//$logger->info('2) api.php', array('data' => $data) );

$json = json_decode($data);

//$logger->info('3) api.php', array('json' => $json) );

$op = $json->{'op'};

//$logger->info('4) api.php', array('op' => $op) );

if(isset($op)){

    switch($op){
        case "getProducts":
            $obj = new Product();
            $ret = $obj->getProducts();
            $count = count($ret,1);
            $msg = $obj->getMsg();
            if (!empty($msg)) { $resp = array('code' => -1, 'msg' => $msg);
            } else { $resp = array('code' => 1, 'msg' => '','data' => $ret);
            };
            // $logger->info('12) getProducts>$resp:', $resp);
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST');
//            header('Access-Control-Allow-Headers: "Content-type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
            echo json_encode($resp);
            break;
        case "save":
            $id = $json->{'data'}->{'id'};
            $name = $json->{'data'}->{'name'};
            $price = $json->{'data'}->{'price'};

            $obj = new Product();
            $code = -1;
            if(empty($id) || $id=="") { $code = $obj->insertProduct($name,$price);
            }else{ $code = $obj->updateProduct($id,$name,$price);
            };
            $resp = array('code' => $code, 'msg' => $obj->getMsg());

            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST');
            echo json_encode($resp);
            break;

        case "delete":

            $id = $json->{'id'};

            $obj = new Product();
            $code = $obj->deleteProduct($id);
            $resp = array('code' => $code, 'msg' => $obj->getMsg());

            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST');
            echo json_encode($resp);
            break;

        default:
            $ret = -999;
            $resp = array('code' => $ret, 'msg' => 'invalid operation');
            echo json_encode($resp);
            break;
    }
}else{
    $ret = -999;
    $resp = array('code' => $ret, 'msg' => 'invalid operation');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    echo json_encode($resp);

}