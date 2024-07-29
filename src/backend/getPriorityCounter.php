<?php

require 'config.php';

$sql = "SELECT *, COUNT(*) AS TicketCount
FROM (
SELECT Decode.Priority
FROM Tickets
LEFT JOIN Decode on Tickets.Priority = Decode.ID
) AS C
GROUP BY Priority
ORDER BY case when Priority = 'Critical' then 1
              when Priority = 'High' then 2
              when Priority = 'Medium' then 3
              when Priority = 'Low' then 4
              else 5
         end asc";

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