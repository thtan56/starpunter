<?php
require_once('User.php');
//------------------------------------------------------
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
//---- start logging from here ----------------------------- 

$data = file_get_contents('php://input');
$json = json_decode($data);

$op = $json->{'op'};
$logger->info('1) apiUser.php', array('op' => $op));
$logger->info('2) apiUser.php', array('op' => $json));
//---- start logging from here ----------------------------- 
if(isset($op)){

    switch($op){
        case "getUsers":
            $obj = new User();
            $ret = $obj->getUsers();
            // $logger->info('1) getusers', $ret);
            $count = count($ret,1);
            $msg = $obj->getMsg();
            if (!empty($msg)) { $resp = array('code' => -1, 'msg' => $msg);
            } else { $resp = array('code' => 1, 'msg' => '','data' => $ret);
            };
            // $logger->info('12) getusers>$resp:', $resp);
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST');
            echo json_encode($resp);
            break;
        case "save":
            $id = $json->{'data'}->{'id'};
            $username = $json->{'data'}->{'username'};
            $password = $json->{'data'}->{'password'};
            $email = $json->{'data'}->{'email'};

            $firstname = $json->{'data'}->{'firstname'};
            $lastname = $json->{'data'}->{'lastname'};
            $role = $json->{'data'}->{'role'};
            $address1 = $json->{'data'}->{'address1'};
            $address2 = $json->{'data'}->{'address2'};
            $town = $json->{'data'}->{'town'};
            $postcode = $json->{'data'}->{'postcode'};
            $country = $json->{'data'}->{'country'};
            $bankbsb = $json->{'data'}->{'bankbsb'};
            $bankaccount = $json->{'data'}->{'bankaccount'};

            $obj = new user();
            $code = -1;
            if(empty($id) || $id=="") {
                $logger->info('3) apiUser.php', array('id' => $id));
                $code = $obj->insertUser($username,$password,$email,$firstname,$lastname, $role, $address1, $address2,$town, $postcode, $country, $bankbsb, $bankaccount);
            }else{
                $logger->info('4) apiUser.php', array('id' => $id));            
                $code = $obj->updateUser($id,$username,$password,$email,$firstname,$lastname, $role, $address1, $address2,$town, $postcode, $country, $bankbsb, $bankaccount);
            }
            $resp = array('code' => $code, 'msg' => $obj->getMsg());

            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST');
            echo json_encode($resp);
            break;

        case "delete":

            $id = $json->{'id'};

            $obj = new user();
            $code = $obj->deleteuser($id);
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