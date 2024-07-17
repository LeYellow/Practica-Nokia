<?php

require 'config.php';

$incident = $_GET['incident'];
$sql = "DELETE FROM Tickets WHERE Incident = $incident";
$stmt = sqlsrv_query($conn, $sql);

if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

echo json_encode(array("message"=> "Ticket deleted succesfully!"));
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

?>