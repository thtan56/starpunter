<?php
echo "hello world, this is my first google app with mysql cloud";
// use PDO;

try {
	$dsn =getenv("MYSQL_DSN");  // in app.yaml
	$user = "root";
	$pass = "cancer56";
	
	$pdo = new PDO($dsn, $user, $pass);
} catch (PDOException $e) {
	echo "Failed to get DB handle: ". $e->getMessage(). "\n";
	exit;
}
// $statement = $pdo->prepare('SELECT * FROM books WHERE id = :id');
// $statement->bindValue('id', $id, PDO::PARAM_INT);
// $statement->execute();
// $result = $statement->fetch(PDO::FETCH_ASSOC);

$query = $pdo->prepare('SELECT username, email FROM user');
$query->execute();

for($i=0; $row = $query->fetch(); $i++){
	echo $i." - ".$row['username']."<br/>";
}
echo phpinfo();

unset($pdo);
unset($query);
?>
