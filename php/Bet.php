<?php
require __DIR__.'/DBclass.php';

class Bet {
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
    public function getBets() {
        $stmt = $this->db->prepare("select * from bet");
        $stmt->execute();
        $bets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$bets) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $bets;
    }
    public function getUserBets($json) {
        $stmt = $this->db->prepare("select * from bet where username=? and status=?");
        $stmt->execute([ $json->{'data'}->{'username'}, $json->{'data'}->{'status'} ]);
        $bets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$bets) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $bets;
    }
    public function getPoolUsers($id) {
        $stmt = $this->db->prepare("select username, pool_id from bet where pool_id=?");
        $stmt->execute([ $id ]);
        $bets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!$bets) {
            $this->msg = 'No rows'; 
            exit;
        };
        return $bets;
    }
    public function insertBet($json) { 
        //                       1             2       3        4        5           6         7        8           9  10        11       12
       $sql = "insert into bet (game_name, organiser,venue, game_date, game_winner, home_score, away_score, bet_type, pool_id, bet_odd, bet_winner";
       $sql .= ", username, bet_amount, bet_score1, week_no, created) ";
       $sql .= "values(?,?,?, ?,?,?, ?,?,?, ?,?,?,?,?, week(?), now())";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([ $json->{'data'}->{'game_name'}     ,$json->{'data'}->{'organiser'}
                         ,$json->{'data'}->{'venue'}        ,$json->{'data'}->{'game_date'}
                         ,$json->{'data'}->{'game_winner'}  
                         ,$json->{'data'}->{'home_score'},  $json->{'data'}->{'away_score'}                          
                         ,$json->{'data'}->{'bet_type'}
                         ,$json->{'data'}->{'pool_id'}
                         ,$json->{'data'}->{'bet_odd'},     $json->{'data'}->{'bet_winner'} 
                         ,$json->{'data'}->{'username'},    $json->{'data'}->{'bet_amount'} 
                         ,$json->{'data'}->{'bet_score1'},  $json->{'data'}->{'game_date'}      // date to cal week #
        ]);
    }
    public function deleteBet($id) {
        $stmt = $this->db->prepare("delete from bet where id=?");
        $stmt->execute([ $id ]);
    }
    public function updateBet($json) {        // object, not array
        $sql = "update bet set organiser=?, venue=?,  game_name=?, game_date=?, game_winner=?, home_score=?, away_score=?";
        $sql .= ",bet_type=?,pool_id=?,bet_odd=?, bet_winner=?, username=?, bet_amount=?, bet_score1=?,status=?"; 
        $sql .= ",week_no=week(game_date) ";
        $sql .= "where id=?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $json->{'data'}->{'organiser'}            ,$json->{'data'}->{'venue'}
            ,$json->{'data'}->{'game_name'}           ,$json->{'data'}->{'game_date'}
            ,$json->{'data'}->{'game_winner'}         ,$json->{'data'}->{'home_score'}
            ,$json->{'data'}->{'away_score'}          ,$json->{'data'}->{'bet_type'}
            ,$json->{'data'}->{'pool_id'}             ,$json->{'data'}->{'bet_odd'}
            ,$json->{'data'}->{'bet_winner'}          ,$json->{'data'}->{'username'}
            ,$json->{'data'}->{'bet_amount'}          ,$json->{'data'}->{'bet_score1'}
            ,$json->{'data'}->{'status'}          
            ,$json->{'data'}->{'id'} ]);
    }
}