<?php
//require_once('configLog.php');
require_once('Team.php');

$data = file_get_contents('php://input');
$json = json_decode($data);

//$logger = getLogger();
$op = $json->{'op'};
//$logger->info('1) apiUser.php', array('op' => $op));
//$logger->info('2) apiUser.php', array('json' => $json));
//---- start logging from here ----------------------------- 
if(isset($op)){
  switch($op){
    case "getTeams":
      $code = -1;
      $obj = new Team();
      $ret = $obj->getTeams();
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;
    case "getOrgTeams":
      $id = $json->{'id'};
      $code = -1;
      $obj = new Team();
      $ret = $obj->getOrgTeams($id);
      $msg = $obj->getMsg();
      $resp = (!empty($msg)) ? array('code' => -1, 'msg' => $msg) 
                             : array('code' => 1, 'msg' => '', 'data' => $ret); 
      break;   
    case "save":
      $id = $json->{'data'}->{'id'};
      $obj = new Team();
      $code = (empty($id) || $id=="") ? $obj->insertTeam($json) : $obj->updateTeam( $json);                        
      $resp = array('code' => $code, 'msg' => $obj->getMsg());   // empty msg => ok
      break;
    case "delete":
      $code = -1;
      $obj = new Team();
      $obj->deleteTeam($json->{'id'});            
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
