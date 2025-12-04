<?php
include('../../session.php');
include('../../assets/connection.php');

$category = $_POST['category'];

try {
    $sql = "SELECT sub_category_description FROM efms_sub_category WHERE category_code = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$category]);
    $sub_category = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($sub_category);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
