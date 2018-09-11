<?php
echo "http_host:".$_SERVER['HTTP_HOST']."<br>";
$server_id=$_SERVER['HTTP_HOST'];
if (preg_match('/\bappspot\b/', $server_id)) {
   echo "google";
} else if (preg_match('/\bherokuapp\b/', $server_id)) {
   echo "heroku";
} else {
   echo "localhost";
};
echo "<BR>";
echo phpinfo();
?>
