<?php
require __DIR__.'/DBclass.php';

class Game {
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
    public function getGames() {
        $stmt = $this->db->prepare("select * from game");
        $stmt->execute();
        $games = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$games) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $games;
    }
    public function getOrgGames($id) {
        $stmt = $this->db->prepare("select * from game where organiser=?");
        $stmt->execute([ $id ]);
        $games = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$games) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $games;
    }
    public function insertGame($json) { 
       $sql = "insert into game(name, organiser,venue, date, odd, home_team, away_team, created)";
       $sql .= " values (?,?,?,?,?,?,?, now())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'name'}  ,$json->{'data'}->{'organiser'}
                         ,$json->{'data'}->{'venue'} ,$json->{'data'}->{'date'} 
                         ,$json->{'data'}->{'odd'} 
                         ,$json->{'data'}->{'home_team'}, $json->{'data'}->{'away_team'} ]);
    }
    public function deleteGame($id) {
        $stmt = $this->db->prepare("delete from game where id=?");
        $stmt->execute([ $id ]);
    }
    public function updateGame($json) {        // object, not array
      $optype=$json->{'type'};
      $optype=isset($optype) ? $optype : "";
      switch($optype){
        case "result":
          $sql = "update game set winner=?, home_score=?, away_score=?, status=? where id=?";
          $stmt = $this->db->prepare($sql);
          $stmt->execute([ $json->{'data'}->{'winner'}    ,$json->{'data'}->{'home_score'}
                          ,$json->{'data'}->{'away_score'},$json->{'data'}->{'status'}
                          ,$json->{'data'}->{'id'} ]);
          break;
        default:
          $sql = "update game set name=?, organiser=?, venue=?, date=?, odd=?, winner=?, home_score=?, away_score=? ";
          $sql .= " where id=?";
          $stmt = $this->db->prepare($sql);
          $stmt->execute([ $json->{'data'}->{'name'}, $json->{'data'}->{'organiser'}
            ,$json->{'data'}->{'venue'},$json->{'data'}->{'date'}
            ,$json->{'data'}->{'odd'}
            ,$json->{'data'}->{'winner'}
            ,$json->{'data'}->{'home_score'}
            ,$json->{'data'}->{'away_score'}       
            ,$json->{'data'}->{'id'} ]);
          break;
      }
    }
}