let request_modal = new bootstrap.Modal(document.getElementById('user-info-modal'));
let clicked_sub_nav = "assigned"

const fetchNotifValue = () =>{
    $.ajax({
        url: '../php/incoming_request_php/fetch_notifValue.php',
        method: "POST",
        dataType : 'json',
        success: function(response) {
            try { 
                console.log(response)
                const pending_value = parseInt(response.count_pending)
                const myJob_value = parseInt(response.count_evaluation) + parseInt(response.count_onProcess)
                const onProcess_value = parseInt(response.count_onProcess)
                const evaluation_value = parseInt(response.count_evaluation)
                
                console.log(356, pending_value)

                if(pending_value > 0){
                    $('#jobOrder-notif-span').text(pending_value)
                    $('#jobOrder-notif-span').css('display' , 'block')

                    $('#notif-value').text(pending_value);
                    $('#notif-value').css('display', 'flex');

                }else{
                    $('#jobOrder-notif-span').css('display' , 'none')
                    
                    $('#notif-value').text(pending_value);
                    $('#notif-value').css('display', 'none');
                }
                
                if(myJob_value > 0){
                    $('#your-job-notif-span').text(myJob_value)
                    $('#your-job-notif-span').css('display' , 'block')

                }else{
                    $('#your-job-notif-span').css('display' , 'none')
                }

                if(onProcess_value > 0){
                    $('#on-process-notif-span').text(onProcess_value)
                    $('#on-process-notif-span').css('display' , 'block')
                }else{
                    $('#on-process-notif-span').css('display' , 'none')
                }

                
                if(evaluation_value > 0){
                    $('#for-evaluation-notif-span').text(evaluation_value)
                    $('#for-evaluation-notif-span').css('display' , 'block')
                }else{
                    $('#for-evaluation-notif-span').css('display' , 'none')
                }

            } catch (innerError) {
                console.error("Error processing response:", innerError);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
}

const dataTable_incoming_request = (status) =>{
    try {
        $.ajax({
            url: '../../php/incoming_request_php/fetch_incoming_req.php',
            method: "POST",
            data : {status: status},
            dataType : "json",
            success: function(response) {
                fetch_requestData = response
                console.log(fetch_requestData)
                try {
                    let dataSet = [];

                    for (let i = 0; i < response.length; i++) {

                        // 🔹 Function to format any date like "11/06/2025 - 09:09:00 AM"
                        function formatDate(dateStr) {
                            if (!dateStr) return "N/A";

                            const dateParts = dateStr.split(" - ");
                            if (dateParts.length < 2) return dateStr; // skip if malformed

                            const [month, day, year] = dateParts[0].split("/");
                            const timePart = dateParts[1];
                            const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);

                            if (isNaN(dateObj)) return dateStr; // fallback if invalid date

                            return dateObj.toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true
                            });
                        }

                        // 🔹 Format all three dates
                        const formattedRequestDate = formatDate(response[i].requestDate);
                        const formattedStartDate = formatDate(response[i].assignTargetStartDate);
                        const formattedEndDate = formatDate(response[i].assignTargetEndDate);
                        const formattedCompletionDate = response[i].requestEvaluationDate ? formatDate(response[i].requestEvaluationDate) : "N/A";

                        // 🔹 Build row data
                        dataSet.push([
                            `<div><span>${response[i].requestNo}</span></div>`,
                            `<div class="request-by-td-div">
                                <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</span>
                            </div>`,
                            `<div class="request-assigned-td-div">
                                <span>${response[i].assignBy}</span>
                                <span><b>Date Requested:</b> ${formattedRequestDate}</span>
                                <span><b>Target Start Date:</b> ${formattedStartDate}</span>
                                <span><b>Target End Date:</b> ${formattedEndDate}</span>
                                <span><b>Completion Date:</b> ${formattedCompletionDate}</span>
                            </div>`,
                            `<div><span class="category-td-span">${response[i].requestSubCategory}</span></div>`,
                            `<div class="request-button-td-div"><button class="request-action-button btn btn-secondary">View Request</button></div>`,
                        ]);
                    }

                    // 🔹 Initialize DataTable
                    if ($.fn.DataTable.isDataTable('#incoming-req-table')) {
                        $('#incoming-req-table').DataTable().destroy();
                        $('#incoming-req-table tbody').empty();
                    }

                    $('#incoming-req-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data: 0 },
                            { title: "NAME OF REQUESTER", data: 1 },
                            { title: "ASSIGNED BY", data: 2 },
                            { title: "CATEGORY", data: 3 },
                            { title: "ACTION", data: 4 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: td => $(td).addClass('item-req-no-td'), width: "10%" },
                            { targets: 1, createdCell: td => $(td).addClass('item-name-td'), width: "25%" },
                            { targets: 2, createdCell: td => $(td).addClass('item-assign-job-info-td'), width: "20%" },
                            { targets: 3, createdCell: td => $(td).addClass('item-category-td'), width: "10%" },
                            { targets: 4, createdCell: td => $(td).addClass('item-action-td'), width: "10%" },
                        ],
                        autoWidth: false,
                        ordering: false,
                        stripeClasses: [],
                        searching: false
                    });

                    // Add custom class per row
                    $('#incoming-req-table tbody tr').each(function () {
                        $(this).addClass('incoming-req-row-class');
                    });

                } 
                catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });

    } catch (ajaxError) {
        console.error("Unexpected error occurred:", ajaxError);
    }
}

const _init = () =>{
    document.querySelectorAll('.nav-request-div .nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' from all buttons
            document.querySelectorAll('.nav-request-div .nav-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add 'active' to the clicked button
            button.classList.add('active');
            clicked_sub_nav = button.getAttribute('data-status');
            // Get the data-status attribute value
            let status = button.getAttribute('data-status');
            if(status === 'Completed'){
                status = "Evaluation"
            }
            // Call your function with that status
            dataTable_incoming_request(status);
        });
    });
}


socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("Received from WebSocket:", data); // Debugging

    // Call fetchNotifValue() on every process update
    switch (data.action) {
        case "refreshIncomingTable":
            console.log(468)
            fetchNotifValue()
            dataTable_incoming_request();  
            break;
        case "refreshDoneEvaluationTableUser":
            fetchNotifValue()
            dataTable_my_jobs("Evaluation");  
            break;
        case "refreshPendingTableTech":
            fetchNotifValue()
            dataTable_incoming_request()
            break;
        case "refreshCancelTableUser":
            fetchNotifValue()
            dataTable_incoming_request()
            break;
        default:
            console.log("Unknown action:", data.action);
    }
};

$(document).ready(function(){
    // assigned, on-process, completed
    dataTable_incoming_request("assigned")
    fetchNotifValue()
    _init()

    $(document).off('click', '.request-action-button').on('click', '.request-action-button', function() {        
        // fetch data-photo
        console.log(491)
        const index = $('.request-action-button').index(this);
        console.log(index)
        const data = fetch_requestData[index];
        clicked_requestNo = data.requestNo
        console.log(data)
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        // $('#user-section').text(data.requestBy.section);
        // $('#user-exactLocation').text(data.requestBy.exact_location);

        let sectionName = data.requestBy.section;
        let exactLocation = data.requestBy.exact_location;
        // Shorten the long section name if it matches
        if (sectionName === 'Integrated Hospital Operations and Management Program') {
            sectionName = 'IHOMP';
        }
        if (exactLocation === 'Integrated Hospital Operations and Management Program') {
            exactLocation = 'IHOMP';
        }

        $('#user-section').text(sectionName);
        $('#user-exactLocation').text(exactLocation);
    
        $('#job-order-id').text(`${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);
        $('#assigned-request-description').text(data.assignDescription);

        $('.modal-title').text("User & Job Order Details")
        $('#user-what').text("Requester")
        $('.assessment-section').css('display' , 'flex')

        if(clicked_sub_nav === "On-Process"){
            $('.tech-assessment-section').css('display' , 'flex')
            $('.tech-remarks-textarea').val("")
            $('#finish-assess-btn').css('display' , 'block')
        }
        else if(clicked_sub_nav === "Completed"){
            $('.tech-assessment-section').css('display' , 'none')
            $('#finish-assess-btn').css('display' , 'none')
        }
        else{
            $('.tech-assessment-section').css('display' , 'none')
        }

        $('#start-assess-btn').text("Start Job")
        $('#start-assess-btn').css('display' , 'flex')
        $('#rtr-assess-btn').css('display' , 'flex')

        $.ajax({
            url: '../php/incoming_request_php/fetch_account_photo.php',
            method: "POST",
            data: {bioID : data.requestBy.bioID},
            success: function(response) {
                console.log(response);
                const base64Data = (response.photo || "").trim();
                const $userImage = $('#user-image');
                $userImage.css('background-image', `url('data:image/bmp;base64,${base64Data}')`);
                $userImage.removeClass('fa-solid fa-user');
            },

            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });

        request_modal.show();
    });

    $(document).off('click', '#finish-assess-btn').on('click', '#finish-assess-btn', function() {
        console.log(clicked_requestNo)
        try {
            $.ajax({
                url: '../php/incoming_request_php/edit_toEvaluation_req.php',
                method: "POST",
                data: {
                    requestNo: clicked_requestNo,
                    requestJobRemarks: $('.tech-remarks-textarea').val()
                },
                dataType: "json",
                success: function(response) {
                    try { 
                        // Update table and modal
                        dataTable_incoming_request("On-Process");
                        request_modal.hide();

                        console.log(response);

                        // ✅ Show success Swal
                        Swal.fire({
                            icon: 'success',
                            title: 'Request Updated!',
                            text: 'The job has been successfully moved to Evaluation.',
                            timer: 2000,
                            showConfirmButton: false
                        });

                        // Update notification counts
                        if (response.count_yourJob > 0) {
                            $('#your-job-notif-span').text(response.count_yourJob).show();
                        } else {
                            $('#your-job-notif-span').text(0).hide();
                        }

                        if (response.count_onProcess > 0) {
                            $('#on-process-notif-span').text(response.count_onProcess).show();
                        } else {
                            $('#on-process-notif-span').text(0).hide();
                        }

                        if (response.count_evaluation > 0) {
                            $('#for-evaluation-notif-span').text(response.count_evaluation).show();
                        } else {
                            $('#for-evaluation-notif-span').text(0).hide();
                        }

                    } catch (innerError) {
                        console.error("Error processing response:", innerError);
                        Swal.fire({
                            icon: 'error',
                            title: 'Processing Error',
                            text: 'Something went wrong while updating the UI.'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX request failed:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: 'Unable to move request to Evaluation. Please try again.'
                    });
                }
            });
        } catch (ajaxError) {
            console.error("Unexpected error occurred:", ajaxError);
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'An unexpected error occurred. Please refresh and try again.'
            });
        }
    })

})