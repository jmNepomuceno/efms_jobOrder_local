<?php 
    $section;
    try {
        $sql = "SELECT sectionName FROM pgssection WHERE sectionID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['section']]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $section = $data[0]['sectionName'];
        $_SESSION["sectionName"] = $section;

    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }
?>