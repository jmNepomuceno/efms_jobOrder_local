<?php
include('../../session.php');
include('../../assets/connection.php');

$category = $_POST['category'];

try {
    $sql = "SELECT techBioID, firstName, lastName, middle FROM efms_technicians WHERE techCategory = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$category]);
    $sub_category = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($sub_category);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>