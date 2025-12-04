<?php
include ('../../session.php');
include('../../assets/connection.php');

header('Content-Type: application/json');

try {
    if (!isset($_POST['techBioID']) || !isset($_POST['role'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
        exit;
    }

    $techBioID = $_POST['techBioID'];
    $role = $_POST['role'];
    $category = isset($_POST['category']) ? $_POST['category'] : null;

    // Validate role
    $validRoles = ['admin', 'super_admin' , 'unit_semi_admin'];
    if (!in_array($role, $validRoles)) {
        echo json_encode(['success' => false, 'message' => 'Invalid role selected.']);
        exit;
    }

    // Update technician to become admin or super_admin
    $sql = "UPDATE efms_technicians 
            SET role = :role, techCategory = CASE WHEN :category IS NOT NULL THEN :category ELSE techCategory END
            WHERE techBioID = :techBioID";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':role' => $role,
        ':category' => $category,
        ':techBioID' => $techBioID
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Admin successfully added.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made or invalid technician.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>
