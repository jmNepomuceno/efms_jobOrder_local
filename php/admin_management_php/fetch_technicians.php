<?php
include('../../session.php');
include('../../assets/connection.php');
include('../../assets/mssql_connection.php');

try {
    // Fetch only technicians with role = 'tech'
    $sql = "
        SELECT techBioID, firstName, middle, lastName, employmentStatus, techCategory, role
        FROM efms_technicians
        WHERE role = 'tech' AND techCategory != 'RESIGNED'
        ORDER BY lastName ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $technicians = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($technicians);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
