<?php
include('../../session.php');
include('../../assets/connection.php');

try {
    // Fetch all active technicians (you can filter by status if needed)
    $stmt = $pdo->query("
        SELECT techBioID, firstName, lastName, techCategory
        FROM efms_technicians
        WHERE (role = 'tech' OR role = 'admin') AND techCategory != 'RESIGNED'
        ORDER BY lastName ASC, firstName ASC
    ");

    $technicians = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($technicians);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
