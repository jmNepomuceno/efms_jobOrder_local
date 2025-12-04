<?php 
    include('../session.php');
    include('../assets/connection.php');
    // $sql = "SELECT * FROM job_order_request";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
    // $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // echo "<pre>"; print_r($data); "</pre>";

    // $checkSql = "SHOW COLUMNS FROM job_order_request LIKE 'requestCorrectionDate'";
    // $stmt = $pdo->query($checkSql);
    // $columnExists = $stmt->fetch();

    // if (!$columnExists) {
    //     $sql = "ALTER TABLE job_order_request 
    //             ADD COLUMN requestCorrectionDate VARCHAR(45) NULL, 
    //             ADD COLUMN requestCorrection VARCHAR(200) NULL";
    //     $pdo->exec($sql);
    //     echo "Columns added successfully!";
    // } else {
    //     echo "Columns already exist!";
    // }

    // $sql = "DELETE FROM job_order_request WHERE requestNo = 11";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // get the tech category

    // echo "<pre>"; print_r($_SESSION); "</pre>";
    include('../php/get_section.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS Job Order Request</title>
    <link rel="stylesheet" href="../css/job_order.css">
    <link rel="stylesheet" href="../css/sidebar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>


    
    <div class="sample-container d-flex justify-content-between align-items-center px-4">
        <div class="welcome-text">
            <?php if($_SESSION["role"] === 'tech' || $_SESSION["role"] === 'admin'){?>
                <i class="fa-solid fa-arrow-left" id="return-btn"></i>
            <?php } ?>
            Welcome, <span id="user-name"><?php echo $_SESSION["name"]; ?></span>
        </div>
        <button id="logout-btn" class="btn btn-logout">Logout</button>
    </div>


    <div class="nav-main-div">
        <h2>EFMS JOB ORDER REQUEST FORM</h2>
        <h3><?php echo $section; ?></h3>
        <div class="nav-div">
            <button class="nav-sub-div" id="request-form-nav-btn">Request Form</button>
            <button class="nav-sub-div" id="pending-nav-btn">Pending <span id="pending-notif-span"></button>
            <button class="nav-sub-div" id="assigned-job-nav-btn">Assigned Job <span id="assigned-job-notif-span"></button>
            <button class="nav-sub-div" id="process-nav-btn">On-Process <span id="process-notif-span"></button>
            <button class="nav-sub-div" id="correction-nav-btn">Correction <span id="correction-notif-span"></button>
            <button class="nav-sub-div" id="pending-material-nav-btn">Pending Material <span id="pending-material-notif-span"></button>
            <button class="nav-sub-div" id="for-schedule-nav-btn">For Schedule <span id="for-schedule-notif-span"></button>
            <button class="nav-sub-div" id="evaluation-req-nav-btn">For Evaluation <span id="evaluation-notif-span">0</span></button>
            <button class="nav-sub-div" id="completed-nav-btn">Completed <span id="completed-notif-span"></button>
        </div>
    </div>
    
    <div class="main-container"></div>

    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">NOTIFICATION</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    Successfully Submitted
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                    <!-- <button id="submit-modal-btn" type="button" type="button">SUBMIT</button> -->
                </div>
            </div>
        </div>
    </div>

    
    <?php require "../links/script_links.php" ?>
    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>
    <script src="../js/job_order.js?v=<?php echo time(); ?>"></script>
    
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
        
</body>
</html>
 