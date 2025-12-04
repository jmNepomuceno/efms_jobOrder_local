<?php 
    include('../session.php');
    include('../assets/connection.php');

    $current_date = date('m/d/Y - h:i:s A');

    include('../php/get_section.php');
?>

<div class="pending-view">
    <h1><?php echo $section ?></h1>
    <div class="table-container">
        <table id="pending-dataTable">
            <thead>
                <tr>
                    <th>JOB ORDER NO.</th>
                    <th>REQUESTED DATE</th>
                    <th>REQUESTED BY</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="modal-cancel-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-top" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Cancellation Form</h5>
            </div>
            <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                <h3>Reason for Cancellation</h3>
                <textarea class="form-control" id="cancel-input-id"></textarea>
            </div>
            <div class="modal-footer">
                <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                <button id="submit-modal-btn" type="button" type="button">SUBMIT</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-view-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-top modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">View Request Form</h5>
            </div>
            <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                <div class="main-information">

                    <div class="user-info">
                        <i class="fa-solid fa-user"></i>
                        <div class="user-details">
                            <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-name"></span></p>
                            <p><strong>BioID:</strong> <span id="user-bioid"></span></p>
                            <p><strong>Division:</strong> <span id="user-division"></span></p>
                            <p><strong>Section:</strong> <span id="user-section"></span></p>
                        </div>
                    </div>

                    <!-- Job Order Information -->
                    <div class="job-order-info">
                        <h5 class="info-heading">Job Order Request Information</h5>
                        <p><strong>Job Order ID:</strong> <span id="job-order-id"></span></p>
                        <p><strong>Date Requested:</strong> <span id="date-requested"></span></p>
                        <p><strong>Request Type:</strong> <span id="request-type"></span></p>
                    </div>
                </div>

                <div class="request-description">
                    <h5 class="info-heading">Request Description</h5>
                    <p id="request-description">
                        The workstation in the accounting office has encountered a persistent issue where the system fails to load critical accounting software.
                    </p>
                </div>

                <div class="tech-assessment-section">
                    <h5 class="info-heading">Technician Remarks Details</h5>
                    <div class="tech-info-assessment">
                        <span><b>Technician Name:</b> <i id="tech-name-i"></i></span>
                        <span><b>Reception Date:</b> <i id="reception-date-i"></i></span>
                    </div>
                    <textarea class="tech-remarks-textarea" placeholder="Currently assessing..."></textarea>
                </div>


            </div>
            <div class="modal-footer">
                <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
            </div>
        </div>
    </div>
</div>
