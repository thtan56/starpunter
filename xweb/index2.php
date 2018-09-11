<?php
echo "hello world, this is my first google app with mysql cloud";

try {
	$dsn ="mysql:host=35.224.92.137;port=3306;dbname=test";  // mysql:unix_socket="/tmp/mysql.sock;dbname=test";
	$user = "root";
	$pass = "cancer56";
	
	$pdo = new PDO($dsn, $user, $pass);
} catch {PDOException $e) {
	echo "Failed to get DB handle: ". $e->getMessage(). "\n";
	exit;
}
$query = $pdo->prepare('SELECT username, email FROM user');
$query->execute();

for($i=0; $row = $query->fetch(); $i++){
	echo $i." - ".$row['username']."<br/>";
}

unset($pdo);
unset($query);

/*
$host = null;
$socket = ":/cloudsql/tobisports-2018:us-central1:mysql1956";

$port = null;


$conn = mysqli_connect($host, $user, $pass, 'test', $port, $socket );
if (!$conn) {
	die('Could not connect:'.mysqli_error());
};
echo 'Connected successfully<br>';
$sql = 'SELECT id, username, password, email from user';
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
  while($row = mysqli_fetch_assoc($result)) {
  	echo "UserName: " . $row["username"]. "<br>";
  };
} else {
	echo "0 results";
};
mysqli_close($conn);
*/

// require_once __DIR__ . '/../vendor/autoload.php';

/** @var Silex\Application $app */

// $app = require __DIR__ . '/../src/app.php';
// require __DIR__ . '/../src/controllers.php';
// $app->run();
?>