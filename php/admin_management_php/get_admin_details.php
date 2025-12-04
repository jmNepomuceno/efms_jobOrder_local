<?php
include('../../session.php');
include('../../assets/connection.php');

if (!isset($_GET['techBioID'])) {
    echo json_encode(["error" => "Missing techBioID parameter"]);
    exit;
}

$techBioID = $_GET['techBioID'];

try {
    $sql = "
        SELECT 
            techBioID,
            firstName,
            lastName,
            middle,
            employmentStatus,
            techCategory,
            role,
            CONCAT(lastName, ', ', firstName, ' ', 
                   CASE WHEN middle IS NOT NULL AND middle != '' THEN CONCAT(LEFT(middle, 1), '.') ELSE '' END
            ) AS fullName
        FROM efms_technicians
        WHERE techBioID = ?
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$techBioID]);
    $tech = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($tech) {
        echo json_encode([
            "success" => true,
            "data" => $tech
        ]);
    } else {
        echo json_encode(["error" => "Technician not found"]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
