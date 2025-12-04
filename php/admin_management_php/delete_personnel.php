<?php
    include ('../../session.php');
    include('../../assets/connection.php');

    if (isset($_POST['id'])) {
        $id = (int) $_POST['id'];

        $sql = "UPDATE efms_technicians SET techCategory='RESIGNED' WHERE techBioID=?";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$id])) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error"]);
        }
    }
?>
