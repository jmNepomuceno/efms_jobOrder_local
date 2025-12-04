var modal_cancel_form, modal_view_form;
var clicked_requestID;
var fetch_viewRequestData;

if (!modal_cancel_form) {
    modal_cancel_form = new bootstrap.Modal(document.getElementById('modal-cancel-form'));
}

if (!modal_view_form) {
    modal_view_form = new bootstrap.Modal(document.getElementById('modal-view-form'));
}


function addRefreshButton() {
    // Wait until DataTables is initialized
    let searchWrapper = $('#pending-dataTable_filter'); // DataTables search div

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
        url: '../php/pending_view_php/fetch_pending.php',
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            fetch_viewRequestData = response
            try {
                let dataSet = [];
                for (let i = 0; i < response.length; i++) {
                    dataSet.push([
                        `<span class="requestNo-span">${response[i].requestNo}</span>`,
                        `<span>${response[i].requestDate}</span>`,
                        `<span>${response[i].requestBy.name}</span>`,
                        `<div class="action-pending-div">
                            <button type="button" class="btn btn-primary view-request-btn">View</button>
                            <button type="button" class="btn btn-danger cancel-request-btn">Cancel</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#pending-dataTable')) {
                    $('#pending-dataTable').DataTable().destroy();
                    $('#pending-dataTable tbody').empty(); // Clear previous table body
                }

                $('#pending-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "JOB ORDER NO." },
                        { title: "REQUESTED DATE" },
                        { title: "REQUESTED BY" },
                        { title: "ACTION" }
                        
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('request-id-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('request-date-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('request-name-td'); } },
                        { targets: 3, createdCell: function(td) { $(td).addClass('request-action-td'); } },
                        
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

registerSocketHandler((data) => {
    if (data.action === "refreshPendingTableUser") {
        fetch_dataTable();  // Refresh the table
    }
});

$(document).ready(function(){
    // pending_view
    fetch_dataTable()
    
    $(document).off('click', '.cancel-request-btn').on('click', '.cancel-request-btn', function() {        
        const index = $('.cancel-request-btn').index(this);
        const requestNo = $('.requestNo-span').eq(index).text()
        clicked_requestNo = requestNo
        modal_cancel_form.show()
    });

    $(document).off('click', '#submit-modal-btn').on('click', '#submit-modal-btn', function() {        
        try {
            $.ajax({
                url: '../../php/pending_view_php/cancel_request.php',
                data : { 
                    requestNo: clicked_requestNo, 
                    cancelRequest : $('#cancel-input-id').val() 
                },
                method: "POST",
                success: function(response) {
                    console.log(response)
                    try {
                        if(response === "success"){
                            modal_cancel_form.hide()
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
    });

    $(document).off('click', '.view-request-btn').on('click', '.view-request-btn', function() {
        const index = $('.view-request-btn').index(this);
        const data = fetch_viewRequestData[index]
        console.log(data)
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('#tech-name-i').text(data.processedBy ? data.processedBy : "No data yet.")
        $('#reception-date-i').text(data.requestStartDate ? data.requestStartDate : "No data yet.")
        $('.tech-remarks-textarea').attr('placeholder', 'No Data yet');

        modal_view_form.show()
    })
})