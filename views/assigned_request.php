<?php 
    include('../session.php');
    include('../assets/connection.php');

    $sql = "SELECT PGSDivisionName, PGSDivisionID FROM pgsdivision";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $division_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT sectionName, division FROM pgssection";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $section_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo $_SESSION['name'];

    // $sql = "DELETE FROM job_order_request WHERE requestNo='EU-2025-06-002'";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "DELETE FROM job_order_request WHERE requestNo='MU-2025-10-001'";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestCorrectionDate=null, requestCorrection=null, requestJobRemarks=null, assignTo=NULL, assignBy=NULL, assignToBioID=NULL, assignTargetStartDate=NULL, assignTargetEndDate=NULL, processedByID=NULL, requestStartDate=NULL, requestEvaluationDate=NULL, requestCompletedDate=NULL WHERE requestID=225";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // echo "<pre>"; print_r($_SESSION); echo "</pre>";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS Job Order - Assigned</title>
    <link rel="stylesheet" href="../css/assigned_job_request.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    
    <?php 
        $view = "assigned-request-sub-div";
        $sub_view = "none";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            // $view = "Incoming Request";
            // include("./navbar.php");
        ?>

        <div class="table-div">
            <div class="nav-request-div">
                <button class="nav-btn active" id="request-list-btn" data-status="Assigned">
                    Assigned Job
                    <span id="jobOrder-notif-span"></span>
                </button>
                <button class="nav-btn" id="on-process-btn" data-status="On-Process">
                    On-Process
                    <span id="your-job-notif-span"></span>
                </button> 
                <button class="nav-btn" id="completed-job-btn" data-status="Completed">
                    Completed
                    <span id="your-job-notif-span"></span>
                </button> 
            </div>

            <div class="table-container">
                <table id="incoming-req-table" class="display">
                    <thead>
                        <tr >
                            <th>REQUEST NO.</th>
                            <th>NAME OF REQUESTER</th>
                            <th>Assign By</th>
                            <!-- <th>DATE REQUESTED</th> -->
                            <!-- <th>UNIT</th> -->
                            <th>CATEGORY</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>

                    <tbody>
                    
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <div class="modal fade custom-modal-size" id="user-info-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered"> <!-- Smaller Modal Size -->
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h5 class="modal-title" id="user-info-modal-label">User & Job Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- User Information -->
                    <div class="main-information">

                        <div class="user-info">
                            <i class="" id="user-image"></i>

                            <div class="user-details">
                                <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-name">John Marvin Nepomuceno</span></p>
                                <p><strong>BioID:</strong> <span id="user-bioid">4497</span></p>
                                <p><strong>Division:</strong> <span id="user-division">Finance Division</span></p>
                                <p><strong>Section:</strong> <span id="user-section">Accounting Section</span></p>
                                <p><strong>Exact Location:</strong> <span id="user-exactLocation">Accounting Section</span></p>
                            </div>
                        </div>

                        <!-- Job Order Information -->
                        <div class="job-order-info">
                            <h5 class="info-heading">Job Order Request Information</h5>
                            <p><strong>Job Order ID:</strong> <span id="job-order-id">JO-2025-001</span></p>
                            <p><strong>Date Requested:</strong> <span id="date-requested">March 11, 2025</span></p>
                            <p><strong>Request Type:</strong> <span id="request-type">IT Support</span></p>
                        </div>
                    </div>

                    <div class="request-description">
                        <h5 class="info-heading">Request Description</h5>
                        <p id="request-description">
                            The workstation in the accounting office has encountered a persistent issue where the system fails to load critical accounting software.
                        </p>
                    </div>

                    <div class="assigned-request-description">
                        <h5 class="info-heading">Assigned Job Description</h5>
                        <p id="assigned-request-description">
                            The workstation in the accounting office has encountered a persistent issue where the system fails to load critical accounting software.
                        </p>
                    </div>

                    <div class="tech-assessment-section">
                        <h5 class="info-heading">Technician Remarks Details</h5>
                        <div class="tech-info-assessment">
                            <span><b>Technician Name:</b> <i id="tech-name-i"></i></span>
                            <span><b>Reception Date:</b> <i id="reception-date-i"></i></span>
                        </div>
                        <textarea class="tech-remarks-textarea" placeholder="Enter remarks details...">
                        </textarea>
                    </div>

                     <div class="function-btn">
                        <button id="finish-assess-btn" class="btn btn-success">Finish Job</button>
                    </div>
                </div>

               

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Your Cart</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>


    <?php require "../links/script_links.php" ?>

    

    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>

    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/assigned_request_js/assigned_request.js?v=<?php echo time(); ?>"></script>

    <!-- <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script> -->
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
                
    <script>
        var section_data = <?php echo json_encode($section_data); ?>;
        var division_data = <?php echo json_encode($division_data); ?>;
        var _user_role = "<?php echo $_SESSION['role']; ?>";
        var _user_bioID = "<?php echo $_SESSION['user']; ?>";
    </script>
</body>
</html>
 