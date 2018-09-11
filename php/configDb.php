<?php
define("DSN_LOCAL", "mysql:dbname=test;host=localhost");
define("DSN_REMOTE", "mysql:dbname=test;unix_socket=/cloudsql/tobisports-2018:us-central1:mysql1956");
define("USER", "root");
define("PASSWORD", "cancer56");
define("DATABASE", "test");

function getMyConnection() {
	$host="localhost";
	$conn = mysqli_connect($host, USER, PASSWORD, DATABASE);
	return $conn;
}
function getPdoConnection(){
	$options = [
  	PDO::ATTR_EMULATE_PREPARES   => false, // turn off emulation mode for "real" prepared statements
  	PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, //turn on errors in the form of exceptions
  	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //make the default fetch be an associative array
	];
	try {
		$dsn=preg_match('/Windows/', getenv('os')) ? DSN_LOCAL : DSN_REMOTE;
		$pdo = new PDO($dsn, USER, PASSWORD, $options);
	} catch (PDOException $e) {
		echo "Failed to get DB handle: ". $e->getMessage(). "\n";
		exit('Something weird happened');
	}	
  return $pdo;
}
?>