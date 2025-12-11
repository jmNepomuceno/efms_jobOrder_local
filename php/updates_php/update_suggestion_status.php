<?php
include('../../session.php');
include('../../assets/connection.php');

header("Content-Type: application/json");

try {

    // Get POST values
    $id = $_POST['id'] ?? null;
    $action = $_POST['action'] ?? null; // major, minor, reject

    if (!$id || !$action) {
        echo json_encode([
            "success" => false,
            "message" => "Missing parameters."
        ]);
        exit;
    }

    // Fetch suggestion details first
    $stmt = $pdo->prepare("SELECT * FROM suggestions WHERE id = ?");
    $stmt->execute([$id]);
    $suggestion = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$suggestion) {
        echo json_encode([
            "success" => false,
            "message" => "Suggestion not found."
        ]);
        exit;
    }

    // If action = reject → delete ONLY
    if ($action === "reject") {
        $delete = $pdo->prepare("DELETE FROM suggestions WHERE id = ?");
        $delete->execute([$id]);

        echo json_encode([
            "success" => true,
            "message" => "Suggestion rejected and removed."
        ]);
        exit;
    }

    // For major / minor → Insert into updates table
    if ($action === "major" || $action === "minor") {

        $insert = $pdo->prepare("
            INSERT INTO updates (description, status, created_at, updated_at)
            VALUES (?, ?, NOW(), NOW())
        ");

        $insert->execute([
            $suggestion['details'],   // description
            $action                   // status = major OR minor
        ]);

        // Remove from suggestions table
        $delete = $pdo->prepare("DELETE FROM suggestions WHERE id = ?");
        $delete->execute([$id]);

        echo json_encode([
            "success" => true,
            "message" => "Suggestion moved to updates as $action."
        ]);
        exit;
    }

    echo json_encode([
        "success" => false,
        "message" => "Invalid action."
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>
