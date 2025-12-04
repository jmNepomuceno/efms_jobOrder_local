<?php
include('../../session.php');
include('../../assets/connection.php');

try {
    if (!isset($_GET['category_code']) || empty($_GET['category_code'])) {
        echo json_encode([]);
        exit;
    }

    $category_code = $_GET['category_code'];

    $stmt = $pdo->prepare("
        SELECT sub_category_description 
        FROM efms_sub_category 
        WHERE category_code = ? 
        ORDER BY sub_category_description ASC
    ");
    $stmt->execute([$category_code]);
    $subcategories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($subcategories);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
