let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));
// modal_notif.show()

// Global listeners map
const socketEventHandlers = [];

const fetchNotifValue = () => {
    $.ajax({
        url: "../../php/job_order_php/fetch_notifValue.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            // console.log(response);

            // Mapping status keys from response to their corresponding spans
            const statusMap = {
                count_pending: "#pending-notif-span",
                count_assigned: "#assigned-job-notif-span",
                count_onProcess: "#process-notif-span",
                count_correction: "#correction-notif-span",
                count_pendingMaterials: "#pending-material-notif-span",
                count_forSchedule: "#for-schedule-notif-span",
                count_returned: "#return-notif-span",
                count_evaluation: "#evaluation-notif-span",
                count_completed: "#completed-notif-span"
            };

            // Iterate over the status map and update the respective spans
            Object.keys(statusMap).forEach(key => {
                let value = response[key] || 0; // Default to 0 if not found
                let spanSelector = statusMap[key];

                if (value > 0) {
                    $(spanSelector).text(value).show();  // Show span and update value
                } else {
                    $(spanSelector).hide(); // Hide if value is 0
                }
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching notification data:", error);
        }
    });
};

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    // console.log("📡 WebSocket received:", data);

    socketEventHandlers.forEach(handler => {
        try {
            handler(data);
        } catch (err) {
            console.error("❌ Error in socket event handler:", err);
        }
    });
};

registerSocketHandler((data) => {
    if (
        data.action === "refreshOnProcessTableUser" || 
        data.action === "refreshEvaluationTableUser" || 
        data.action === "refreshCorrectionTableUser" || 
        data.action === "refreshPendingTableUser" ||
        data.action === "refreshCancelTableUser"
    ) {
        fetchNotifValue();
    }
})

// Function to register listeners
function registerSocketHandler(callback) {
    socketEventHandlers.push(callback);
}

const onLoad = () =>{
    $('.main-container').load('../container/efms_container.php', function(response, status, xhr) {
        if (status === "success") {
            removeAllJS()
            removeAllCSS()

            let version = new Date().getTime(); // Generates a unique timestamp

            $('head').append(`<link rel="stylesheet" href="../css/efms_container.css?v=${version}">`);
            $('body').append(`<script src="../js/request_form_js/requestForm_function.js?v=${version}"><\/script>`);
            $('body').append(`<script src="../js/request_form_js/requestForm_traverse.js?v=${version}"><\/script>`);
        } else {
            console.error("Failed to load EFMS container:", xhr.statusText);
        }
    });
}

function refreshNavBtnStyle() {
    for(let i = 0; i < $('.nav-sub-div').length; i++) {
        $('.nav-sub-div').eq(i).css('background', 'none');
    }
}

function removeAllJS() {
    // Remove all view-related JS files
    $('script[src*="_view_js/"]').remove(); 
    $('script[src*="request_form_js/"]').remove();
}

function removeAllCSS() {
    // Remove all view-related CSS files
    $('link[href*="_view.css"]').remove();
    $('link[href*="efms_container.css"]').remove();
}

function removeAllModals() {
    $('.modal').remove(); // remove all bootstrap modals from DOM
}


$(document).ready(function(){
    onLoad();
    fetchNotifValue()
    $('#login-btn').click(function() {
        handleLogin();
    });
    
    function loadView(buttonId, containerFile, cssFile, jsFiles = []) {
        refreshNavBtnStyle();
        $(buttonId).css('background-color', '#f2f2f2');

        $('.main-container').empty().load(`../container/${containerFile}`, function(response, status, xhr) {
            if (status === "success") {
                removeAllJS();
                removeAllCSS();

                let version = new Date().getTime();
                $('head').append(`<link rel="stylesheet" href="../css/${cssFile}?v=${version}">`);
                jsFiles.forEach(js => {
                    $('body').append(`<script src="../js/${js}?v=${version}"><\/script>`);
                });
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    }

    $('#request-form-nav-btn').click(() => 
        loadView('#request-form-nav-btn', 'efms_container.php', 'efms_container.css', [
            'request_form_js/requestForm_function.js',
            'request_form_js/requestForm_traverse.js'
        ])
    );

    $('#pending-nav-btn').click(() => 
        loadView('#pending-nav-btn', 'pending_view.php', 'pending_view.css', ['pending_view_js/pending_view.js'])
    );

    $('#assigned-job-nav-btn').click(() => 
        loadView('#assigned-job-nav-btn', 'assignedJobs_view.php', 'assignedJobs_view.css', ['assignedJobs_view_js/assignedJobs_view.js'])
    );

    $('#process-nav-btn').click(() => 
        loadView('#process-nav-btn', 'onProcess_view.php', 'onProcess_view.css', ['onProcess_view_js/onProcess_view.js'])
    );

    $('#correction-nav-btn').click(() => 
        loadView('#correction-nav-btn', 'correction_view.php', 'correction_view.css', ['correction_view_js/correction_view.js'])
    );

    $('#pending-material-nav-btn').click(() => 
        loadView('#pending-material-nav-btn', 'pending_material_view.php', 'pending_material_view.css', ['pending_material_view_js/pending_material_view.js'])
    );

    $('#for-schedule-nav-btn').click(() => 
        loadView('#for-schedule-nav-btn', 'for_schedule_view.php', 'for_schedule_view.css', ['for_schedule_view_js/for_schedule_view.js'])
    );

    $('#evaluation-req-nav-btn').click(() => {
        removeAllModals(); // <--- add this
        loadView('#evaluation-req-nav-btn', 'evaluation_view.php', 'evaluation_view.css', ['evaluation_view_js/evaluation_view.js'])
    })

    $('#completed-nav-btn').click(() => {
       removeAllModals();  
        loadView('#completed-nav-btn', 'completed_view.php', 'completed_view.css', ['completed_view_js/completed_view.js'])
    });



    $('#return-btn').click(function() {
        window.location.href = "../views/home.php"; 
    });

    $('#logout-btn').click(function() {
        window.location.href = "http://192.168.42.14"; 
    });
});