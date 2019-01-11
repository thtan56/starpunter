<?php
require_once('Game.php');
$obj = new Game();
$id=isset($_GET['orgid']) && !empty($_GET['orgid']) ? $_GET['orgid'] : "NBA";
$ret = $obj->fcgetGames($id);
echo json_encode($ret);
?>
