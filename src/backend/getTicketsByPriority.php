<?php

require 'config.php';

$priority = $_GET['priority'];

$sql = "SELECT Tickets.ID, Tickets.Incident, CONVERT(VARCHAR, Tickets.StartDate, 23) AS StartDate, Decode.Priority, Decode.SLA, Tickets.Status, CONVERT(VARCHAR, Tickets.LastModifiedDate, 23) AS LastModifiedDate, CONVERT(VARCHAR, Tickets.AssignedDate, 23) AS AssignedDate, Tickets.AssignedPerson From Tickets
left join Decode on Tickets.Priority = Decode.ID
WHERE Decode.Priority = ?";

$params = array($priority);
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