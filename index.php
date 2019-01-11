<?php
require __DIR__.'/php/DBclass.php';

//header("Location: index.html"); /* Redirect browser */
//exit();

//require __DIR__.'/php/configLog.php';

//error_reporting(E_ALL);
//error_log("dddddddddddddddddddddd",0);

//header("Location: index.html"); /* Redirect browser */
//exit();


$dbObj = new DB();
$db = $dbObj->getPDO();
echo "** 1) calling from index.php <br>"; 
echo "** 2) Hello from ".$dbObj->dbServer."** <br>"; 

$stmt = $db->prepare("select * from users");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
$jusers=json_encode($users, TRUE);

print_r($jusers);
//while ($row = $stmt->fetchAll(PDO::FETCH_ASSOC)) { 
//	print_r($row);
//	echo "<br>";
//}
//$logger = getLogger();
//$logger->info('1) index.php', array('json' => $users) );
?>