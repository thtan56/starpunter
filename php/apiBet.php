<?php
require_once('Bet.php');
//require_once('configLog.php');

$data = file_get_contents('php://input');
$json = json_decode($data);
$op = $json->{'op'};

//$logger = getLogger();
//$logger->info('1) apiBet.php', array('op' => $op));
//$logger->info('2) apiBet.php', array('json' => $json));

if(isset($op)){
  switch($op){
    case "getUserBets":
      $code = -1;
      $obj = new Bet();
      $ret = $obj->getUserBets($json);
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "getPoolUsers":
      $id = $json->{'data'}->{'id'};  
      $code = -1;
      $obj = new Bet();
      $ret = $obj->getPoolUsers($id);
//      $logger->info('3) apiBet.php', array('ret' => $ret));
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "getBets":
      $code = -1;
      $obj = new Bet();
      $ret = $obj->getBets();
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "save":
      $id = $json->{'data'}->{'id'};   
      $obj = new Bet();
      $code = (empty($id) || $id=="") ? $obj->insertBet($json) : $obj->updateBet( $json);     
      $resp = array('code' => $code, 'msg' => $obj->getMsg());   // empty msg => ok
      break;
    case "delete":
      $code = -1;
      $obj = new Bet();
      $obj->deleteBet($json->{'id'});            
      $resp = array('code' => $code, 'msg' => $obj->getMsg());
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
