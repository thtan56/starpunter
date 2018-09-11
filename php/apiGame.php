<?php
//require_once('configLog.php');
require_once('Game.php');

$data = file_get_contents('php://input');
$json = json_decode($data);

//$logger = getLogger();
$op = $json->{'op'};
//$logger->info('1) apiGame.php', array('op' => $op));
//$logger->info('2) apiGame.php', array('json' => $json));

if(isset($op)){
  switch($op){
    case "getGames":
      $code = -1;
      $obj = new Game();
      $ret = $obj->getGames();
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "getOrgGames":
      $code = -1;
      $obj = new Game();
      $ret = $obj->getOrgGames($json->{'id'});
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "save":
      $id = $json->{'data'}->{'id'};
   
      $obj = new Game();
      if (empty($id) || $id=="") {
//$logger->info('3) apiGame: save-insert', array('json' => $json));   
         $code = $obj->insertGame($json);
      } else {
//$logger->info('4) apiGame: save-update', array('json' => $json)); 
         $code = $obj->updateGame( $json);     
      };                        
      $resp = array('code' => $code, 'msg' => $obj->getMsg());   // empty msg => ok
      break;
    case "delete":
      $code = -1;
      $obj = new Game();
      $obj->deleteGame($json->{'id'});            
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
