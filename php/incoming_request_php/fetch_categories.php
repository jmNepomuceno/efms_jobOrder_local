<?php
include('../../session.php');
include('../../assets/connection.php');

try {
    $stmt = $pdo->query("
        SELECT category_code, category_description 
        FROM efms_category 
        ORDER BY category_description ASC
    ");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($categories);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
