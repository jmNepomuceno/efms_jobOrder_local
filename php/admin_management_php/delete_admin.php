<?php
include('../../session.php');
include('../../assets/connection.php');
// include('../../assets/mssql_connection.php');

if (!isset($_POST['techBioID'])) {
    echo json_encode(["success" => false, "message" => "Missing adminID."]);
    exit;
}

$adminID = $_POST['techBioID'];

try {
    $pdo->beginTransaction();

    // Get technician linked to the admin
    $sql = "SELECT techBioID FROM efms_technicians WHERE techBioID = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$adminID]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode(["success" => false, "message" => "Admin not found."]);
        exit;
    }

    $techBioID = $result['techBioID'];

    // Delete from efms_technicians
    $deleteSQL = "DELETE FROM efms_technicians WHERE techBioID = ?";
    $stmt = $pdo->prepare($deleteSQL);
    $stmt->execute([$techBioID]);

    // Revert technician role
    $updateTech = "UPDATE efms_technicians SET role = 'tech' WHERE techBioID = ?";
    $stmt = $pdo->prepare($updateTech);
    $stmt->execute([$techBioID]);

    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Admin deleted and reverted to technician."]);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
