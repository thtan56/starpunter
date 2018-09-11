<?php
require_once('php/configDb.php');

echo "hello world, this is my first google app with mysql cloud";

$email = "thtan56@gmail.com";
$pdo = getPdoConnection();

$query = $pdo->prepare('SELECT username, email FROM user');
$query->execute();


echo "<table><tr><th>Seq</th><th>User Name</th><th>Email Address</th></tr>";
for($i=0; $row = $query->fetch(); $i++){
	echo "<tr>";
	echo "<td>".$i."</td>";
	echo "<td>".$row['username']."</td>";
	echo "<td>".$row['email']."</td>";
	echo "</tr>";
}
echo "</table>";

echo phpinfo();

unset($pdo);
unset($query);
/*
function getConnection(){
	try {
		$dsn  = getenv("MYSQL_DSN");
		$user = getenv("MYSQL_USER");
		$pass = getenv("MYSQL_PASSWORD");
		$connection = new PDO($dsn, $user, $pass);
	} catch (PDOException $e) {
		echo "Failed to get DB handle: ". $e->getMessage(). "\n";
		exit;
	}	
  return $connection;
}
*/
?>
