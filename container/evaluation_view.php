<div class="evaluation-view">
    <h1>Integrated Hospital Operations and Management Program</h1>
    <div class="table-container">
        <table id="evaluation-dataTable">
            <thead>
                <tr>
                    <th>JOB ORDER NO.</th>
                    <th>TECHNICIAN NAME</th>
                    <th>DATE</th>
                    <th>REQUEST TYPE</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="modal-view-eval-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                            <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-nameTxt"></span></p>
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
                       
                    </p>
                </div>

                <div class="tech-assessment-section">
                    <h5 class="info-heading">Technician Remarks Details</h5>

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

            </div>
            <div class="modal-footer">
                <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
            </div>
        </div>
    </div>
</div>

<!-- <div class="modal fade" id="modal-eval-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false"> -->
<div class="modal fade" id="modal-eval-form-evaluated" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header custom-header">
                <h5 id="modal-title-incoming" class="modal-title-incoming">Evaluation Form</h5>
            </div>

            <!-- Modal Body -->
            <div id="modal-body-incoming" class="modal-body-incoming p-4">
                <form id="evaluation-form">
                    <p class="text-muted">Please rate the service based on the following criteria:</p>

                    <div class="table-responsive">
                        <table class="table table-bordered text-center evaluation-table">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-start">Criteria</th>
                                    <th>Very Satisfactory</th>
                                    <th>Satisfactory</th>
                                    <th>Unsatisfactory</th>
                                    <th>Poor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-start">1. Requested troubleshooting/repairs attended within prescribed schedule. (2 hours Turn-around time)</td>
                                    <td><input type="radio" name="q1" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q1" value="Satisfactory"></td>
                                    <td><input type="radio" name="q1" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q1" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">2. EFMS staff gives updates on the status of the job request.</td>
                                    <td><input type="radio" name="q2" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q2" value="Satisfactory"></td>
                                    <td><input type="radio" name="q2" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q2" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">3. Accomplished service job request with high levels of quality.</td>
                                    <td><input type="radio" name="q3" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q3" value="Satisfactory"></td>
                                    <td><input type="radio" name="q3" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q3" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">4. EFMS staff are courteous and helpful.</td>
                                    <td><input type="radio" name="q4" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q4" value="Satisfactory"></td>
                                    <td><input type="radio" name="q4" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q4" value="Poor"></td>
                                </tr>
                                <tr>
                                    <td class="text-start">5. Timely response from EFMS staff was given.</td>
                                    <td><input type="radio" name="q5" value="Very Satisfactory" required></td>
                                    <td><input type="radio" name="q5" value="Satisfactory"></td>
                                    <td><input type="radio" name="q5" value="Unsatisfactory"></td>
                                    <td><input type="radio" name="q5" value="Poor"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mb-3">
                        <label for="comment" class="form-label">Comments/Suggestions for Improvement (Optional):</label>
                        <textarea class="form-control custom-textarea" id="comment" name="comment" rows="3"></textarea>
                    </div>

                    <!-- Modal Footer -->
                    <div class="modal-footer custom-footer">
                        <button id="close-modal-btn" type="button" class="btn btn-secondary yawa-btn" data-bs-dismiss="modal">Close</button>
                        <button id="submit-eval-modal-btn" type="submit" class="btn btn-primary">Submit Evaluation</button>
                    </div>
                </form>
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