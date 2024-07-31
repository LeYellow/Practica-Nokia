<?php

require 'config.php';

$input = file_get_contents("php://input");
$ticketData = json_decode($input, true);

if (!isset($ticketData['Incident']) || !isset($ticketData['StartDate']) || !isset($ticketData['Priority']) || !isset($ticketData['Status']) || !isset($ticketData['LastModifiedDate']) || !isset($ticketData['AssignedDate']) || !isset($ticketData['AssignedPerson'])) {
    die(json_encode(array("message" => "All fields are required")));
}

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

$sql = "INSERT INTO Tickets (Incident, StartDate, Priority, Status, LastModifiedDate, AssignedDate, AssignedPerson) VALUES (?, ?, ?, ?, ?, ?, ?)";
$params = array($Incident, $StartDate, $Priority, $Status, $LastModifiedDate, $AssignedDate, $AssignedPerson); 
$stmt = sqlsrv_query($conn, $sql, $params);
if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

$sql = "INSERT INTO Notes (Incident, Description, Requestor, Team, ProjectName) VALUES (?, ?, ?, ?, ?)";
$params = array($Incident, $Description, $Requestor, $Team, $ProjectName);
$stmt = sqlsrv_query($conn, $sql, $params);
if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

echo json_encode(array("message" => "Ticket added successfully"));
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

?>