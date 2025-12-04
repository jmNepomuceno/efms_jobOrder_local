<?php
include ('../../session.php');
include('../../assets/connection.php');

    try {
        $sql = "SELECT role, techCategory
        FROM efms_technicians 
        WHERE techBioID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['user']]);
        $tech_data = $stmt->fetch(PDO::FETCH_ASSOC);

        if($tech_data['role'] == 'super_admin'){
            $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
                SUM(CASE WHEN requestStatus = 'Pending Materials' THEN 1 ELSE 0 END) AS count_pendingMaterials,
                SUM(CASE WHEN requestStatus = 'For Schedule' THEN 1 ELSE 0 END) AS count_forSchedule,
                (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
            FROM job_order_request 
            WHERE processedBy = ? OR processedBy IS NULL";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_SESSION['name']]);
        }
        else if($tech_data['role'] == 'unit_admin'){
            $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
                SUM(CASE WHEN requestStatus = 'Pending Materials' THEN 1 ELSE 0 END) AS count_pendingMaterials,
                SUM(CASE WHEN requestStatus = 'For Schedule' THEN 1 ELSE 0 END) AS count_forSchedule,
                (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
            FROM job_order_request 
            WHERE (processedBy = ? OR processedBy IS NULL) AND requestCategory = ?";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_SESSION['name'], $tech_data['techCategory']]);
        }
        else if($tech_data['role'] == 'unit_semi_admin'){
            $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
                SUM(CASE WHEN requestStatus = 'Pending Materials' THEN 1 ELSE 0 END) AS count_pendingMaterials,
                SUM(CASE WHEN requestStatus = 'For Schedule' THEN 1 ELSE 0 END) AS count_forSchedule,
                (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
            FROM job_order_request 
            WHERE requestCategory = ?";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$tech_data['techCategory']]);
        }
        else if($tech_data['role'] == 'tech'){
            $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Assigned' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
                SUM(CASE WHEN requestStatus = 'Pending Materials' THEN 1 ELSE 0 END) AS count_pendingMaterials,
                SUM(CASE WHEN requestStatus = 'For Schedule' THEN 1 ELSE 0 END) AS count_forSchedule,
                (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Assigned' AND processedBy IS NULL) AS count_incoming
            FROM job_order_request 
            WHERE assignToBioID = ?";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_SESSION['user']]);
        }

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($data); // Send JSON response

    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }

?>
