<?php

require 'config.php';

$input = file_get_contents("php://input");
$ticketData = json_decode($input, true);

$Incident=$ticketData['Incident'];
$Status=$ticketData['Status'];

$sql = "UPDATE Tickets SET Status = ? WHERE Incident = ?";
$params = array($Status, $Incident);
$stmt = sqlsrv_query($conn, $sql, $params);
if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

echo json_encode(array("message" => "Ticket closed successfully"));
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

?>