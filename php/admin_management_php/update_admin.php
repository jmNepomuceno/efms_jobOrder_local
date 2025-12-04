<?php
include('../../session.php');
include('../../assets/connection.php');

// Validate input
if (!isset($_POST['techBioID'], $_POST['role'], $_POST['category'])) {
    echo json_encode(["success" => false, "message" => "Incomplete data provided."]);
    exit;
}

$techBioID = $_POST['techBioID'];
$role = $_POST['role'];
$techCategory = $_POST['category'];

try {
    $pdo->beginTransaction();

    // Update role and category in efms_technicians
    $sql = "
        UPDATE efms_technicians 
        SET role = ?, techCategory = ?
        WHERE techBioID = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$role, $techCategory, $techBioID]);

    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Admin/Technician updated successfully."]);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
