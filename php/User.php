<?php

class User {
    private $dbuser = "root";
    private $dbpass = "cancer56";
    private $msg = "";
    private $result = 1;   // -1 if problem
    //---------------------------------------------   
    public $db;
    public function __construct() { $this->db = $this->connect(); }
    public function connect() {
        $dsn = preg_match('/Windows/', getenv('os')) 
                    ? "mysql:dbname=test;host=localhost"
                    : "mysql:dbname=test;unix_socket=/cloudsql/tobisports-2018:us-central1:mysql1956";
        try {
            $db = new PDO($dsn, $this->dbuser, $this->dbpass);
            $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        } 
        catch (PDOException $e){ $this->msg = $e->getMessage();     // report error via msg 
        }   
        return $db;
    }
    //-------------------------------------
    public function getMsg() { return $this->msg; }
    
    public function getUsers() {
        $stmt = $this->db->prepare("select * from user");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$users) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $users;
    }
    public function insertUser($json) { 
       $sql = "insert into user(username,password,email, firstname, lastname, role, address1, address2, town, postcode";
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
        $stmt = $this->db->prepare("delete from user where id=?");
        $stmt->execute([ $id ]);
        return $result;
    }
    public function updateUser($json) {        // object, not array
        $sql = "update user set username=?,password=?, email=?, firstname=?,lastname=?,role=?, ";
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
        $stmt = $this->db->prepare("select * from user where email=?");
        $stmt->execute([ $email ]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$users) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $users;
    }
}