<?php
require __DIR__.'/DBclass.php';
class Pool {
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
  public function getPools() {
    $sql = "select t1.name as name, t1.date as date, entry_cost, entry_quorum, entry_count";
    $sql .= ",t1.organiser as organiser, pool_prize";
    $sql .= ",payout, team1_count, team2_count, t1.id as id ";
    $sql .= ",t2.odd as odd ";
    $sql .= ",t3.username as username ";
    $sql .= "from game_pool  t1 ";
    $sql .= "inner join game t2 on t1.name = t2.name and t1.date = t2.date ";
    $sql .= "inner join bet  t3 on t1.name = t3.game_name and t1.date = t3.game_date and t1.id = t3.pool_id ";
    $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $pools = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$pools) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $pools;
    }
  public function getGamePools($name, $date) {
    $stmt = $this->db->prepare("select * from game_pool where name=? and date=?");
    $stmt->execute([ $name, $date ]);
    $pools = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(!$pools) {
      $this->msg = 'No rows'; 
      exit;
    };
    return $pools;
  }
  public function getWeekPools() {
    $sql = "select t1.name as name, t1.date as date, entry_cost, entry_quorum, entry_count";
    $sql .= ",t1.organiser as organiser, pool_prize";
    $sql .= ",payout, team1_count, team2_count, t1.id as id";
    $sql .= ",t2.odd as odd, t2.status as status ";
//    $sql .= ",t3.username as username ";
    $sql .= "from game_pool t1 ";
    $sql .= "inner join game t2 on t1.name = t2.name and t1.date = t2.date ";
//    $sql .= "inner join bet  t3 on t1.id = t3.pool_id ";
    $sql .= " where week(now()) = week(t1.date) ";
    $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $pools = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$pools) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $pools;
  }
    public function insertPool($json) { 
       $sql = "insert into game_pool(name, date, entry_cost, entry_quorum, organiser, pool_prize, payout, created)";
       $sql .= " values (?,?,?,?,?,?,?, now())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'name'}      ,$json->{'data'}->{'date'} 
                        ,$json->{'data'}->{'entry_cost'},$json->{'data'}->{'entry_quorum'}
                        ,$json->{'data'}->{'organiser'} ,$json->{'data'}->{'pool_prize'}
                        ,$json->{'data'}->{'payout'} ]);
    }
    public function deletePool($id) {
        $stmt = $this->db->prepare("delete from game_pool where id=?");
        $stmt->execute([ $id ]);
    }
    public function updatePool($json) {        // object, not array
        $sql = "update game_pool set entry_quorum=?, pool_prize=?, payout=? where id=?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'entry_quorum'}, $json->{'data'}->{'pool_prize'}
                        ,$json->{'data'}->{'payout'}       ,$json->{'data'}->{'id'} ]);
    }
    public function updatePoolCount($json) {        // object, not array
        $sql = "update game_pool set entry_count=entry_count+1";     

        $teams = $json->{'data'}->{'teams'};         
        if ($json->{'data'}->{'bet_winner'} == $teams[0]) { 
            $sql .= ",team1_count=team1_count + 1 ";
        } else {
            $sql .= ",team2_count=team2_count + 1 "; 
        };
        $sql .= " where id=?";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'id'} ]);
    }
}