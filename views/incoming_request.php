<?php 
    include('../session.php');
    include('../assets/connection.php');

    // echo '<pre>'; print_r($_SESSION); echo '</pre>';
    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=2";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=3";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestJobRemarks=null, requestEvaluation=null WHERE requestID=225";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestCorrectionDate=null, requestCorrection=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=13";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "DELETE FROM job_order_request";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "SELECT * FROM job_order_request";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
    // $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // echo "<pre>"; print_r($data); "</pre>";

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

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestCorrectionDate=null, requestCorrection=null, requestJobRemarks=null, assignTo=NULL, assignBy=NULL, assignToBioID=NULL, assignTargetStartDate=NULL, assignTargetEndDate=NULL, processedByID=NULL, requestStartDate=NULL, requestPendingMaterials=NULL, requestForSched=NULL, requestPendingMaterialsDate=NULL, requestForSchedDate=NULL, requestEvaluationDate=NULL, requestCompletedDate=NULL WHERE requestID=229";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "DELETE FROM job_order_assigned_techs WHERE requestNo='IU-2025-12-001'";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    //     $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestCorrectionDate=null, requestCorrection=null, requestJobRemarks=null, assignTo=NULL, assignBy=NULL, assignToBioID=NULL, assignTargetStartDate=NULL, assignTargetEndDate=NULL, processedByID=NULL, requestStartDate=NULL, requestEvaluationDate=NULL, requestCompletedDate=NULL WHERE requestID=227";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    //     $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestCorrectionDate=null, requestCorrection=null, requestJobRemarks=null, assignTo=NULL, assignBy=NULL, assignToBioID=NULL, assignTargetStartDate=NULL, assignTargetEndDate=NULL, processedByID=NULL, requestStartDate=NULL, requestEvaluationDate=NULL, requestCompletedDate=NULL WHERE requestID=226";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // echo "<pre>"; print_r($_SESSION); echo "</pre>";

    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS Jov Order - Incoming</title>
    <link rel="stylesheet" href="../css/incoming_request.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    
    <?php 
        $view = "incoming-request-sub-div";
        $sub_view = "none";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            // $view = "Incoming Request";
            // include("./navbar.php");
        ?>

        <div class="search-div">

            <div class="top-div">

                <input type="text" class="form-control" id="job-no-input" placeholder="Job Order No." autocomplete="off">

                <select class="form-control" id="division-select">
                    <option value="" disabled selected>Select Division</option>
                    <?php foreach ($division_data as $division): ?>
                        <option value="<?= htmlspecialchars($division['PGSDivisionID']) ?>">
                            <?= htmlspecialchars($division['PGSDivisionName']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                
                <select class="form-control" id="section-select">
                    <option value="" disabled selected>Select Section</option>
                </select>

                <input type="text" class="form-control" id="lastname-input" placeholder="Last Name" autocomplete="off">
                <input type="text" class="form-control" id="firstname-input" placeholder="First Name" autocomplete="off">
                
            </div>

            <div class="bottom-div">
                <input type="number" class="form-control" id="bioId-input" placeholder="Biometric ID" autocomplete="off">

                <select class="form-control" id="technician-select">
                    <option value="" disabled selected>Select EFMS Technician</option>
                </select>

                <select class="form-control" id="status-select">
                    <option value="" disabled selected>Select Unit</option>
                    <option value="pending">Pending</option>
                    <option value="on-process">In-Process</option>
                    <option value="evaluation">For Evaluation</option>
                    <option value="completed">Completed</option>
                </select>

                <select class="form-control" id="requestType-select">
                    <option value="" disabled selected>Select Request Type</option>
                </select>

                <input type="date" class="form-control" id="dateFrom-input">
                <span>to</span>
                <input type="date" class="form-control" id="dateTo-input">

                <button type="button" class="btn btn-success" id="search-btn">Search</button>
            </div>
        </div>

        <div class="table-div">
            <div class="nav-request-div">
                <button class="nav-btn" id="request-list-btn">
                    Job Order List
                    <span id="jobOrder-notif-span"></span>
                </button>
                <div class="my-job-order-div">
                    <button class="nav-btn" id="your-job-btn">
                        My Job Order
                        <span id="your-job-notif-span"></span>
                    </button> 

                    <div id="your-job-sub-btns">
                        <button class="your-job-sub-btn" id="your-job-assigned-btn">
                            Assigned Jobs
                            <span id="assigned-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-on-process-btn">
                            In-Process
                            <span id="on-process-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-pending-material-btn">
                            Pending Material
                            <span id="pending-material-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-for-schedule-btn">
                            For Schedule
                            <span id="for-schedule-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-correction-btn">
                            Correction
                            <span id="correction-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-for-evaluation-btn">
                            For Evaluation
                            <span id="for-evaluation-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-completed-btn">
                            Completed
                            <span id="completed-notif-span">0</span>
                        </button>
                        <button id="your-job-close-btn">Close</button>
                    </div>
                </div>
            </div>

            <!-- <div class="sub-table-nav">
                <button id="on-process-sub-btn">
                    On-Process 
                    <span id="on-process-notif-span">0</span>
                </button>
                <button id="for-evaluation-sub-btn">
                    For Evaluation
                    <span id="for-evaluation-notif-span"></span>
                </button>
                <button id="completed-sub-btn">
                    Completed
                    <span id="completed-notif-span"></span>
                </button>
            </div> -->

            <div class="table-container">
                <table id="incoming-req-table" class="display">
                    <thead>
                        <tr >
                            <th>REQUEST NO.</th>
                            <th>NAME OF REQUESTER</th>
                            <th id="assign-job-details-th">ASSIGN JOB DETAILS</th>
                            <th>DATE REQUESTED</th>
                            <th>UNIT</th>
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
                    <div id="printable-area">
                        <!-- Print Header -->
                        <div class="print-header" style="width: 100%; text-align: center; margin-bottom: 20px;">
                            <table style="width: 100%; border: none;">
                                <tr>
                                    <!-- Left Logo -->
                                    <td style="width: 20%; text-align: left;">
                                        <img src="../source/landing_img/DOH Logo.png" alt="Logo 2" style="height: 80px;">
                                    </td>

                                    <!-- Center Text -->
                                    <td style="width: 60%; text-align: center;">
                                        <div style="font-size: 18px; font-weight: bold;">
                                            BATAAN GENERAL HOSPITAL AND MEDICAL CENTER
                                        </div>
                                        <div style="font-size: 14px;">
                                            Balanga City, Bataan
                                        </div>
                                        <div style="font-size: 14px; font-weight: bold;">
                                            ISO-QMS 9001:2015 Certified
                                        </div>
                                    </td>

                                    <!-- Right Logo -->
                                    <td style="width: 20%; text-align: right;">
                                        <img src="../source/landing_img/BGHMC logo hi-res.png" alt="Logo 1" style="height: 80px;">
                                    </td>
                                </tr>
                            </table>

                            <h2 id="form-text-h2">EFMS JOB ORDER REQUEST FORM</h2>
                        </div>

                        <!-- User Information -->
                        <div class="main-information">

                            <div class="user-info">
                                <i class="" id="user-image"></i>
                                <div class="user-details">
                                    <h5 class="info-heading">Job Order Requestor</h5>
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
                                <p><strong>Request Category:</strong> <span id="request-type">IT Support</span></p>
                                <p><strong>Request Sub Category:</strong> <span id="request-sub-type">IT Support</span></p>
                            </div>
                        </div>

                        <div class="request-description">
                            <h5 class="info-heading">Request Description</h5>
                            <p id="request-description">
                                The workstation in the accounting office has encountered a persistent issue where the system fails to load critical accounting software.
                            </p>
                        </div>

                        <div class="assessment-section">
                            <div class="tech-btns">
                                <button id="diagnosis-btn">Diagnosis</button>
                                <button id="correction-btn">Correction</button>
                                <button id="pending-material-btn">Pending Materials</button>
                                <button id="for-schedule-btn">For Schedule</button>
                            </div>
                            <textarea class="assessment-textarea" placeholder="Enter Diagnosis details..."></textarea>
                        </div>

                        <div class="assigned-details-section">
                            <h5 class="info-heading">Assigned Job Details</h5>
                            <div class="assigned-info-assessment">  
                                <span><b>Assigned By:</b> <i id="assign-by-details-txt"></i></span>
                                <span><b>Assigned To:</b> <i id="assign-to-details-txt"></i></span>
                                <span><b>Target Start Date:</b> <i id="target-start-datetime-details"></i></span>
                                <span><b>Target End Date:</b> <i id="target-end-datetime-details"></i></span>
                            </div>
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
                        
                        <div class="assign-to-div">
                            <h5 class="info-heading">Assign Job Order</h5>

                            <div class="mb-3">
                                <label for="assign-tech-select" class="form-label">Select Technician (ctrl + click to select multiple)</label>
                                <select id="assign-tech-select" class="form-select" multiple size="5">

                                    <option value="">Select Technician</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="assign-to-modal-tech-remarks" class="form-label">Remarks</label>
                                <textarea id="assign-to-modal-tech-remarks" class="form-control" rows="3" placeholder="Enter remarks details. Input at least 10 characters..."></textarea>
                            </div>

                            <!-- Target Start & End DateTime (Flex Row) -->
                            <div class="mb-3 d-flex gap-3 flex-wrap">
                                <div class="flex-fill">
                                    <label for="target-start-datetime" class="form-label">Target Start Date & Time </label>
                                    <span style="font-size:0.7rem; color:green;">The start date/time must be at least 2 minutes from now.</span>
                                    <input type="datetime-local" id="target-start-datetime" class="form-control" />
                                </div>

                                <div class="flex-fill">
                                    <label for="target-end-datetime" class="form-label">Target End Date & Time</label>
                                    <input type="datetime-local" id="target-end-datetime" class="form-control" />
                                </div>
                            </div>
                        </div>

                        <div class="function-btn">
                            <!-- <button id="pending-material-assess-btn" class="btn btn-success">Pending Material Assessment</button> -->
                            <!-- <button id="for-schedule-assess-btn" class="btn btn-success">For Schedule Assessment</button> -->
                            <button id="start-assess-btn" class="btn btn-success">Start Job</button>
                            <?php if ($_SESSION['role'] === 'unit_admin'): ?>
                                <button id="assign-assess-btn" class="btn btn-secondary">Assign To</button>
                                <button id="cancel-assign-assess-btn" class="btn btn-secondary" style="display:none;">Cancel Assignment</button>
                            <?php endif; ?>
                        </div>

                        
                                
                        <!-- Signature Section -->
                        <div class="signature-section" style="margin-top: 10px; text-align: center;">
                            <table style="width: 100%; border: none;">
                                <tr>
                                    <td style="width: 50%; vertical-align: top;">
                                        <br><br><br>
                                        _________________________________<br>
                                        <div>
                                            <span id="signature-tech-position" style="font-size:0.8rem;">(Technician Position)</span> - 
                                            <span id="signature-tech-name" style="font-size:0.8rem;">(Technician Name)</span> - 
                                            <span id="signature-tech-bioID" style="font-size:0.8rem;"></span> 
                                        </div> 
                                        <!-- <br> -->
                                        <strong style="font-size:0.8rem;">EFMS Tech's Signature over Printed Name</strong><br>
                                    </td>

                                    <td style="width: 50%; vertical-align: top;">
                                        <br><br><br>
                                        _________________________________<br>
                                        <div>
                                            <span id="signature-user-position" style="font-size:0.8rem;">(End-User Position)</span> - 
                                            <span id="signature-user-name" style="font-size:0.8rem;">(End-User Name)</span> - 
                                            <span id="signature-user-bioID" style="font-size:0.8rem;"></span> 
                                        </div> 
                                        <!-- <br> -->
                                        <strong style="font-size:0.8rem;">End-User’s Signature over Printed Name</strong><br>
                                    </td>
                                </tr>
                            </table>
                        </div>

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
    <script src="../js/incoming_request_js/incoming_request.js?php echo time(); ?>"></script>
    <script src="../js/incoming_request_js/incoming_request_traverse.js?php echo time(); ?>"></script>

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
 