var modal_assigned_form
var clicked_requestID;
var fetch_viewRequestData;
var clicked_requestNo = 0;


if (!modal_assigned_form) {
    modal_assigned_form = new bootstrap.Modal(document.getElementById('modal-view-assigned-form'));
}

function addRefreshButton() {
    // Wait until DataTables is initialized
    let searchWrapper = $('#assigned-dataTable_filter'); // DataTables search div

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
        url: '../php/assignedJobs_view_php/fetch_assignedJobs_req.php',
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            fetch_viewRequestData = response

            $('#assigned-notif-span').text(fetch_viewRequestData.length)
            if(fetch_viewRequestData.length === 0){
                $('#assigned-notif-span').css('display','none')
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
                            <span><b>Assigned To:</b> ${response[i].assignTo}</span>
                            <span><b>Target Start Date:</b> ${response[i].assignTargetStartDate}</span>
                            <span><b>Target End Date:</b> ${response[i].assignTargetEndDate}</span>
                        </div>`,
                        `<span>${response[i].requestCategory}</span>`,
                        `<div class="action-correction-div">
                            <button type="button" class="btn btn-primary view-assigned-req-btn">View</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#assigned-dataTable')) {
                    $('#assigned-dataTable').DataTable().destroy();
                    $('#assigned-dataTable tbody').empty(); // Clear previous table body
                }

                $('#assigned-dataTable').DataTable({
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
                    // "ordering": false,
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

    $(document).off('click', '.view-assigned-req-btn').on('click', '.view-assigned-req-btn', function() {
        const index = $('.view-assigned-req-btn').index(this);
        const data = fetch_viewRequestData[index]
        clicked_requestNo = data.requestNo

        console.log(data)

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
        $('#user-bioid').text(data.requestBy.bioID);1
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('#tech-name-i').text((data.assignTo ? data.assignTo : data.processedBy))
        $('#tech-bioID-i').text((data.assignToBioID ? data.assignToBioID : data.processedByID))

        $('#reception-date-i').text(data.requestCorrectionDate)
        $('.tech-remarks-textarea').val(`Assessment: ` + "")
        modal_assigned_form.show()

        // read correction details, deduct the notif value bar

    })

    $(document).off('click', '#cancel-modal-btn').on('click', '#cancel-modal-btn', function() {
        try {
            $.ajax({
                url: '../../php/pending_view_php/cancel_request.php',
                data : { 
                    requestNo: clicked_requestNo, 
                    cancelRequest : "from_correction"
                },
                method: "POST",
                success: function(response) {
                    console.log(response)
                    try {
                        if(response === "success"){
                            modal_assigned_form.hide()
                            fetch_dataTable()                  
                        }
                    } catch (innerError) {
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
    })
})