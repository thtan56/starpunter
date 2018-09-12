<?php
require __DIR__.'/DBclass.php';
class Team {
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
    public function getTeams() {
        $stmt = $this->db->prepare("select * from team");
        $stmt->execute();
        $teams = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$teams) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $teams;
    }
    public function getOrgTeams($id) {
        $stmt = $this->db->prepare("select * from team where organiser=?");
        $stmt->execute([$id ]);
        $teams = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$teams) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $teams;
    }
    public function insertTeam($json) { 
       $sql = "insert into team(name,organiser,venue, created) values(?,?,?,now())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'name'}   ,$json->{'data'}->{'organiser'}  ,$json->{'data'}->{'venue'} ]);
    }
    public function deleteTeam($id) {
        $stmt = $this->db->prepare("delete from team where id=?");
        $stmt->execute([ $id ]);
    }
    public function updateTeam($json) {        // object, not array
        $sql = "update team set name=?, organiser=?, venue=? where id=?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'name'}   ,$json->{'data'}->{'organiser'}  ,$json->{'data'}->{'venue'},
                         $json->{'data'}->{'id'} ]);
    }
}