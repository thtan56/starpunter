<?php

class Product {

    private $dbuser = "root";
    private $dbpass = "cancer56";
    private $msg = "";
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
    
    public function getProducts() {
        $stmt = $this->db->prepare("select * from product");
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$products) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $products;
    }
    public function insertProduct($json) { 
        $sql = "insert into product(name,price,created) values(?,?,now())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'name'}, $json->{'data'}->{'price'} ]);
        if($stmt->errorCode() != 0) { $this->msg = $stmt->errorInfo(); };
    }
    public function updateProduct($json) {        // object, not array
        $sql = "update product set name=?,price=? where id=?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ 
            $json->{'data'}->{'name'}, 
            $json->{'data'}->{'price'},
            $json->{'data'}->{'id'},
             ]);
        if($stmt->errorCode() != 0) { $this->msg = $stmt->errorInfo(); };
    }
    public function deleteProduct($id) {
        $stmt = $this->db->prepare("delete from product where id=?");
        $stmt->execute([ $id ]);
        if($stmt->errorCode() != 0) { $this->msg = $stmt->errorInfo(); };
    }
}