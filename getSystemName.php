<?php

require __DIR__.'/php/DBclass.php';
//require_once('configLog.php');

class System {
  private $msg = "";
  private $result = 1;   // -1 if problem
  //---------------------------------------------   
  public $db;
  public $dbServer;

  public function __construct() { 
    $dbObj = new DB();
    $this->db = $dbObj->getPDO(); 
    $this->dbServer = $dbObj->dbServer;
  }
}

$obj = new System();
echo $obj->dbServer;
?>
