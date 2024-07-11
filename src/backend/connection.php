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

$sql = "SELECT Tickets.ID, Tickets.Incident, CONVERT(VARCHAR, Tickets.StartDate, 23) AS StartDate, Decode.Priority, Decode.SLA, Tickets.Status, CONVERT(VARCHAR, Tickets.LastModifiedDate, 23) AS LastModifiedDate, CONVERT(VARCHAR, Tickets.AssignedDate, 23) AS AssignedDate, Tickets.AssignedPerson From Tickets
left join Decode on Tickets.Priority = Decode.ID";
$stmt=sqlsrv_query($conn, $sql);
if (!$stmt) {
    die(print_r(sqlsrv_errors(),true));
}

$data = array();
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $data[] = $row;
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
echo json_encode($data, JSON_PRETTY_PRINT);
?>