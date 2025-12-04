var modal_completed_form, modal_eval_form_completed
var clicked_requestID;
var fetch_viewRequestData;
var clicked_requestNo = 0;


if (!modal_completed_form) {
    modal_completed_form = new bootstrap.Modal(document.getElementById('modal-view-completed-form'));
}

if (!modal_eval_form_completed) {
    modal_eval_form_completed = new bootstrap.Modal(document.getElementById('modal-eval-form-completed'));
}

function addRefreshButton() {
    // Wait until DataTables is initialized
    let searchWrapper = $('#completed-dataTable_filter'); // DataTables search div

    if (searchWrapper.find('.refresh-btn').length === 0) {
        searchWrapper.append(`
            <button class="btn btn-secondary btn-sm refresh-btn" style="margin-left: 10px;">
                Refresh
            </button>
        `);

        // Add click event
        searchWrapper.on('click', '.refresh-btn', function () {
            fetch_dataTable();
        });
    }
}

var fetch_dataTable = () =>{
    $.ajax({
        url: '../php/completed_view_php/fetch_completed_req.php',
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            fetch_viewRequestData = response

            $('#completed-notif-span').text(fetch_viewRequestData.length)
            if(fetch_viewRequestData.length === 0){
                $('#completed-notif-span').css('display','none')
            }
            
            try {
                //enable notif div
                let dataSet = [];
                for (let i = 0; i < response.length; i++) {
                    dataSet.push([
                        `<span class="requestNo-span">${response[i].requestNo}</span>`,
                        `<span>${response[i].requestBy.name}</span>`,
                        `<div class="date-request-td"> 
                            <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                            <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                            <span><b>Evaluation Date:</b> ${response[i].requestEvaluationDate}</span>
                            <span><b>Completed Date:</b> ${response[i].requestCompletedDate}</span>
                        </div>`,
                        `<span>${response[i].requestCategory}</span>`,
                        `<div class="action-completed-div">
                            <button type="button" class="btn btn-primary view-completed-req-btn">View</button>
                            <button type="button" class="btn btn-success view-eval-form-btn">Evaluation</button>
                        </div>`
                    ]);
                }

                console.log(dataSet)
                
                if ($.fn.DataTable.isDataTable('#completed-dataTable')) {
                    $('#completed-dataTable').DataTable().destroy();
                    $('#completed-dataTable tbody').empty(); // Clear previous table body
                }

                $('#completed-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "JOB ORDER NO." },
                        { title: "NAME OF END USER" },
                        { title: "DATE" },
                        { title: "REQUEST TYPE" },
                        { title: "ACTION" }
                        
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('request-no-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('request-tech-name-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('request-date-td'); },width:"30%"},
                        { targets: 3, createdCell: function(td) { $(td).addClass('request-req-type-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('request-action-td'); } },
                    ],
                    // "paging": false,
                    // "info": false,
                    "ordering": false,
                    // "stripeClasses": [],
                    // "search": false,
                    // autoWidth: false,
                });
                // Add refresh button beside search bar
                addRefreshButton();
            } catch (innerError) {
                console.error("Error processing response:", innerError);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
}

// modal_eval_form.show()
$(document).ready(function(){
    fetch_dataTable() 
    console.log($('#submit-eval-modal-btn'))

    $(document).off('click', '.view-completed-req-btn').on('click', '.view-completed-req-btn', function() {
        const index = $('.view-completed-req-btn').index(this);
        const data = fetch_viewRequestData[index]
        clicked_requestNo = data.requestNo

        
        $.ajax({
            url: '../php/incoming_request_php/fetch_account_photo.php',
            method: "POST",
            data: {bioID : (data.assignToBioID ? data.assignToBioID : data.processedByID)},
            success: function(response) {
                console.log(response);

                const base64Data = (response.photo || "").trim();
                $('#tech-photo').attr('src', `data:image/bmp;base64,${base64Data}`);
            },

            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('#tech-name-i').text((data.assignTo ? data.assignTo : data.processedBy))
        $('#tech-bioID-i').text((data.assignToBioID ? data.assignToBioID : data.processedByID))

        $('#reception-date-i').text(data.requestStartDate)
        $('.tech-remarks-textarea').val(`Assessmet: ` + data.requestJobRemarks)
        modal_completed_form.show()

        // read correction details, deduct the notif value bar

    })

    $(document).off('click', '.view-eval-form-btn').on('click', '.view-eval-form-btn', function() {
        $('#submit-eval-modal-btn').css('display' , 'none !important')
        const index = $('.view-eval-form-btn').index(this);
        const data = fetch_viewRequestData[index];
        clicked_requestNo = data.requestNo;
        console.log(data);
        

        // Parse the evaluation data if it exists
        if (data.requestEvaluation) {
            let evaluation = JSON.parse(data.requestEvaluation); // Convert JSON string to an object
            
            // Loop through the evaluation data and set the radio buttons
            for (const [key, value] of Object.entries(evaluation)) {
                if (key.startsWith("q")) { // Ensure it matches the question fields (q1, q2, q3, etc.)
                    $(`input[name=${key}][value="${value}"]`).prop("checked", true);
                } else if (key === "comments") {
                    $("#comment").val((value) ? value : "No Comment/Suggestion."); // Set the comment textarea value
                }
            }

            // Disable all radio buttons after setting values
            $('input[type="radio"]').prop('disabled', true);
            $('.custom-textarea').css('pointer-events' , 'none')
        }
    
        // Show the modal
        modal_eval_form_completed.show();
    });
    
})