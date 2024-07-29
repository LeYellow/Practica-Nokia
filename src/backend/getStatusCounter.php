<?php

require 'config.php';

$sql = "SELECT Tickets.Status, COUNT(*) as TicketCount
FROM Tickets
GROUP BY Status
order by Status DESC";

$stmt=sqlsrv_query($conn, $sql);
if (!$stmt) {
    die(print_r(sqlsrv_errors(),true));
}

$data = array();
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $data[] = $row;
}

sqlsrv_free_stmt($stmt);
echo json_encode($data, JSON_PRETTY_PRINT);
sqlsrv_close($conn);

?>