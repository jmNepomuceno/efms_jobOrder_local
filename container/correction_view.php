<div class="correction-view">
    <h1>Integrated Hospital Operations and Management Program</h1>
    <div class="table-container">
        <table id="correction-dataTable">
            <thead>
                <tr>
                    <th>JOB ORDER NO.</th>
                    <th>NAME OF END USER</th>
                    <th>DATE</th>
                    <th>REQUEST TYPE</th>
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

<div class="modal fade" id="modal-view-correction-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                            <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-name">John Marvin Nepomuceno</span></p>
                            <p><strong>BioID:</strong> <span id="user-bioid">4497</span></p>
                            <p><strong>Division:</strong> <span id="user-division">Finance Division</span></p>
                            <p><strong>Section:</strong> <span id="user-section">Accounting Section</span></p>
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

                <div class="tech-assessment-section">
                    <h5 class="info-heading">Technician Correction Details</h5>

                    <div class="tech-assessment-partition">
                        <div class="tech-photo-container">
                            <img id="tech-photo" src="" alt="Technician Photo">
                            <div class="tech-info-assessment">
                                <span><b>Technician Name: </b> <p id="tech-name-i">Dell Waje</p></span>
                                <span><b>BioID: </b> <p id="tech-bioID-i">1234</p></span>
                                <span><b>Division: </b> <p id="tech-division-i">HOPSS Division</p></span>
                                <span><b>Section: </b> <p id="tech-section-i">Engineering Facilities Management Section </p></span>
                            </div>
                        </div>

                        <div class="tech-info-assessment-div">
                            <textarea class="tech-remarks-textarea" placeholder="Currently assessing..."></textarea>
                        </div>
                    </div>

                </div>

            <!-- <div class="tech-assessment-partition">
                    <div class="tech-photo-container">
                        <img id="tech-photo" src="" alt="Technician Photo">
                        <div class="tech-info-assessment">
                            <span><b>Technician Name: </b> <p id="tech-name-i">Dell Waje</p></span>
                            <span><b>BioID: </b> <p id="tech-bioID-i">1234</p></span>
                            <span><b>Division: </b> <p id="tech-division-i">HOPSS Division</p></span>
                            <span><b>Section: </b> <p id="tech-section-i">Engineering Facilities Management Section </p></span>
                        </div>
                    </div>

                    <div class="tech-info-assessment-div">
                        <textarea class="tech-remarks-textarea" placeholder="Currently assessing..."></textarea>
                    </div>
                </div> -->


            </div>
            <div class="modal-footer">
                <button id="cancel-modal-btn" type="button" type="button" data-bs-dismiss="modal">CANCEL REQUEST</button>
                <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
            </div>
        </div>
    </div>
</div>
