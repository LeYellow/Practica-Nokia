<?php

require 'config.php';

$input = file_get_contents("php://input");
$ticketData = json_decode($input, true);

$Id=$ticketData['ID'];
$Incident=$ticketData['Incident'];
$StartDate=$ticketData['StartDate'];
$Priority=$ticketData['Priority'];
$Status=$ticketData['Status'];
$LastModifiedDate=$ticketData['LastModifiedDate'];
$AssignedDate=$ticketData['AssignedDate'];
$AssignedPerson=$ticketData['AssignedPerson'];
$Description=$ticketData['Description'];
$Requestor=$ticketData['Requestor'];
$Team=$ticketData['Team'];
$ProjectName=$ticketData['ProjectName'];

$sql = "UPDATE Tickets SET Incident = ?, StartDate = ?, Priority = ?, Status = ?, LastModifiedDate = ?, AssignedDate = ?, AssignedPerson = ? WHERE ID = ?";
$params = array($Incident, $StartDate, $Priority, $Status, $LastModifiedDate, $AssignedDate, $AssignedPerson, $Id);
$stmt = sqlsrv_query($conn, $sql, $params);
if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

$sql = "UPDATE Notes SET Description = ?, Requestor = ?, Team = ?, ProjectName = ? WHERE Incident = ?";
$params = array($Description, $Requestor, $Team, $ProjectName, $Incident);
$stmt = sqlsrv_query($conn, $sql, $params);
if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

echo json_encode(array("message" => "Ticket edited successfully"));
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

?>