<?php
    include('../../session.php');
    include('../../assets/connection.php');

    $requetNo = $_POST['requetNo'];

    try {
        $sql = "SELECT requestCategory FROM job_order_request WHERE requestNo = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$requetNo]);
        $category = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT techBioID, firstName, lastName, middle FROM efms_technicians WHERE techCategory = ? and (role='tech' OR role='unit_semi_admin') ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$category['requestCategory']]);
        $sub_category = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($sub_category);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
?>