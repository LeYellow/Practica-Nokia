<?php

require 'config.php';

$incident = $_GET['incident'];
$sql = "SELECT Description, Requestor, Team, ProjectName FROM Notes WHERE Incident = ?";
$params = array($incident);
$stmt = sqlsrv_query($conn, $sql, $params);

if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

$data = array();
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $data[] = $row;
}

sqlsrv_free_stmt($stmt);
echo json_encode($data, JSON_PRETTY_PRINT);
sqlsrv_close($conn);

?>