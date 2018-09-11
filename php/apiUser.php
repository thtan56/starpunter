<?php
//require_once('configLog.php');
require_once('User.php');

$data = file_get_contents('php://input');
$json = json_decode($data);

//$logger = getLogger();
$op = $json->{'op'};
//$logger->info('1) apiUser.php', array('op' => $op));
//$logger->info('2) apiUser.php', array('json' => $json));
//---- start logging from here ----------------------------- 
if(isset($op)){
  switch($op){
    case "getUsers":
      $code = -1;
      $obj = new User();
      $ret = $obj->getUsers();
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "save":
      $id = $json->{'data'}->{'id'};
      $obj = new user();
      $code = (empty($id) || $id=="") ? $obj->insertUser($json) : $obj->updateUser( $json);                        
      $resp = array('code' => $code, 'msg' => $obj->getMsg());   // empty msg => ok
      break;
    case "delete":
      $code = -1;
      $obj = new user();
      $obj->deleteuser($json->{'id'});            
      $resp = array('code' => $code, 'msg' => $obj->getMsg());
      break;
    case "getUser":
      $code = -1;
      $obj = new User();
      $ret = $obj->getUser($json->{'email'});
//      $logger->info('3) getUser', array('ret' => $ret));
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    default:
      $ret = -999;
      $resp = array('code' => $ret, 'msg' => 'invalid operation');
      echo json_encode($resp);
      break;
  }
} else {
  $ret = -999;
  $resp = array('code' => $ret, 'msg' => 'invalid operation');
};
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
echo json_encode($resp);
