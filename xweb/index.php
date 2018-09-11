<?php
echo "hello world, this is my first google app with mysql cloud";

try {
	$dsn  = getenv("MYSQL_DSN");
	$user = getenv("MYSQL_USER");
	$pass = getenv("MYSQL_PASSWORD");
	$pdo = new PDO($dsn, $user, $pass);
} catch (PDOException $e) {
	echo "Failed to get DB handle: ". $e->getMessage(). "\n";
	exit;
}
$query = $pdo->prepare('SELECT username, email FROM user');
$query->execute();

for($i=0; $row = $query->fetch(); $i++){
	echo $i." - ".$row['username']."<br/>";
}
echo phpinfo();

unset($pdo);
unset($query);
?>
