<?php

require 'config.php';

$input = file_get_contents("php://input");
$ticketData = json_decode($input, true);

if (!isset($ticketData['Incident']) || !isset($ticketData['StartDate']) || !isset($ticketData['Priority']) || !isset($ticketData['Status']) || !isset($ticketData['LastModifiedDate']) || !isset($ticketData['AssignedDate']) || !isset($ticketData['AssignedPerson'])) {
    die(json_encode(array("message" => "All fields are required")));
}

$params = array(
    $ticketData['Incident'],
    $ticketData['StartDate'],
    $ticketData['Priority'],
    $ticketData['Status'],
    $ticketData['LastModifiedDate'],
    $ticketData['AssignedDate'],
    $ticketData['AssignedPerson'],
    );

$sql = "INSERT INTO Tickets (Incident, StartDate, Priority, Status, LastModifiedDate, AssignedDate, AssignedPerson) VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = sqlsrv_query($conn, $sql, $params);
if (!$stmt) {
    die(print_r(sqlsrv_errors(), true));
}

echo json_encode(array("message" => "Ticket added successfully"));
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

?>