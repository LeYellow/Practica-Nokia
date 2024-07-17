<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE'");

$servername = "LENOVO-LEGION\SQLEXPRESS";
$database = "NOKIA";
$uid = "";
$password = "";

$connection = array(
    "Database" => $database,
    "Uid" => $uid,
    "PWD"=> $password
);

$conn = sqlsrv_connect($servername, $connection);
if (!$conn) {
    die(print_r(sqlsrv_errors(), true));
}
?>