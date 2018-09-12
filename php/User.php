<?php
require __DIR__.'/DBclass.php';

class User {
  private $msg = "";
  private $result = 1;   // -1 if problem
  //---------------------------------------------   
  public $db;
  public function __construct() { 
    $dbObj = new DB();
    $this->db = $dbObj->getPDO(); 
  }
  //-------------------------------------
  public function getMsg() { return $this->msg; }
    
  public function getUsers() {
        $stmt = $this->db->prepare("select * from users");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$users) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $users;
  }
  public function insertUser($json) { 
       $sql = "insert into users(username,password,email, firstname, lastname, role, address1, address2, town, postcode";
       $sql .= ",country, bankbsb, bankaccount, created) values(?,?,?,?,?,?,?,?,?,?,?,?,?,now())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ 
            $json->{'data'}->{'username'}   ,$json->{'data'}->{'password'}  ,$json->{'data'}->{'email'}
            ,$json->{'data'}->{'firstname'} ,$json->{'data'}->{'lastname'}  ,$json->{'data'}->{'role'}
            ,$json->{'data'}->{'address1'}  ,$json->{'data'}->{'address2'}  ,$json->{'data'}->{'town'}
            ,$json->{'data'}->{'postcode'}  ,$json->{'data'}->{'country'}   ,$json->{'data'}->{'bankbsb'}
            ,$json->{'data'}->{'bankaccount'} ]);
        return $result;    // ok,  problem=-1
  }
  public function deleteUser($id) {
        $stmt = $this->db->prepare("delete from users where id=?");
        $stmt->execute([ $id ]);
        return $result;
  }
  public function updateUser($json) {        // object, not array
        $sql = "update users set username=?,password=?, email=?, firstname=?,lastname=?,role=?, ";
        $sql .= " address1=?, address2=?, town=?, postcode=?, country=?, bankbsb=?, bankaccount=? where id=?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ 
            $json->{'data'}->{'username'}   ,$json->{'data'}->{'password'}  ,$json->{'data'}->{'email'}
            ,$json->{'data'}->{'firstname'} ,$json->{'data'}->{'lastname'}  ,$json->{'data'}->{'role'}
            ,$json->{'data'}->{'address1'}  ,$json->{'data'}->{'address2'}  ,$json->{'data'}->{'town'}
            ,$json->{'data'}->{'postcode'}  ,$json->{'data'}->{'country'}   ,$json->{'data'}->{'bankbsb'}
            ,$json->{'data'}->{'bankaccount'},$json->{'data'}->{'id'} ]);
        return $result;
  }
  public function getUser($email) {
        $stmt = $this->db->prepare("select * from users where email=?");
        $stmt->execute([ $email ]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$users) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $users;
  }
}