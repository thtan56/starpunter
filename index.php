<?php
require __DIR__.'/php/DBclass.php';

header("Location: index.html"); /* Redirect browser */
exit();

$dbObj = new DB();
$db = $dbObj->getPDO();
echo "** Hello from ".$dbObj->dbServer."** <br>"; 
//-------------------------------------
$stmt = $db->prepare("select * from users");
$stmt->execute();
while ($row = $stmt->fetchAll(PDO::FETCH_ASSOC)) { 
	print_r($row);
	echo "<br>";
}
?>