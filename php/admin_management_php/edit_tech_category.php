<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    $updates = json_decode($_POST['updates'], true);
    
    $sql = "UPDATE efms_technicians SET techCategory=? WHERE techBioID=?";
    $stmt = $pdo->prepare($sql);

    foreach ($updates as $bioID => $category) {
        // Ensure bioID is numeric to prevent SQL injection
        if (!is_numeric($bioID)) {
            continue; 
        }

        $success = $stmt->execute([$category, $bioID]);

        if (!$success) {
            echo "Failed to update bioID: $bioID <br>";
        }
    }

    echo "Update successful";

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
