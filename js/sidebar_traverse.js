let modal_logout = new bootstrap.Modal(document.getElementById('modal-logout'));

const checkNotif_incominRequest = () => {
    if(incoming_request_count > 0){
        $('#notif-value').text(incoming_request_count);
        $('#notif-value').css('display', 'flex');
    }

      // Play sound
    const sound = document.getElementById('notificationSound');
    sound.play().catch(err => {
        console.warn("Audio could not be played automatically. User interaction may be required.", err);
    });
}

const checkNotif_updates = () => {
    if(update_count > 0){
        $('#notif-value-updates').text(update_count);
        $('#notif-value-updates').css('display', 'flex');
    }
}


// // Optional: only run if socket is defined
// if (typeof socket !== 'undefined') {
//     console.log(19)
//     const originalHandler = socket.onmessage;

//     socket.onmessage = function(event) {
//         let data = JSON.parse(event.data);
//         console.log("Sidebar WebSocket handler received:", data);

//         // Forward to original handler (to keep incoming_request.js working)
//         if (originalHandler) originalHandler(event);

//         switch (data.action) {
//             case "refreshNotification":
//                 checkNotif_incominRequest(); // Or your sidebar update logic
//                 break;
//         }
//     };
// }

$(document).ready(function(){
    checkNotif_incominRequest()
    checkNotif_updates()

    // console.log(view)
    $(`#${view}`).css('background','#5a4038')
    $(`#${view}`).css('border-left','3px solid white')
    console.log(sub_view)
    if(view === "dashboard-sub-div"){
        $('#dashboard-arrow')
            .removeClass('fa-caret-down')
            .addClass('fa-caret-up');
        
        $('#dashboard-sub-down-div').css('display', 'flex');
        $(`#${sub_view}`).css('background','#3f2d27')
    }

    if(view === "admin-management-sub-div"){
        $('#adminmanage-arrow')
            .removeClass('fa-caret-down')
            .addClass('fa-caret-up');

        $('#adminmanage-sub-down-div').css('display', 'flex');
        $(`#${sub_view}`).css('background','#3f2d27')
    }

    // dashboard-arrow
    $('#dashboard-arrow, #dashboard-sub-div').click(function(event) {
        event.stopPropagation();
        
        if ($('#dashboard-arrow').hasClass('fa-caret-down')) {
            $('#dashboard-arrow')
                .removeClass('fa-caret-down')
                .addClass('fa-caret-up');
            
            $('#dashboard-sub-down-div').css('display', 'flex');
        } else {
            $('#dashboard-arrow')
                .removeClass('fa-caret-up')
                .addClass('fa-caret-down');
            
            $('#dashboard-sub-down-div').css('display', 'none');
        }
    });

    $('#adminmanage-arrow, #admin-management-sub-div').click(function(event) {
        event.stopPropagation();

        if ($('#adminmanage-arrow').hasClass('fa-caret-down')) {
            $('#adminmanage-arrow')
                .removeClass('fa-caret-down')
                .addClass('fa-caret-up');

            $('#adminmanage-sub-down-div').css('display', 'flex');
        } else {
            $('#adminmanage-arrow')
                .removeClass('fa-caret-up')
                .addClass('fa-caret-down');

            $('#adminmanage-sub-down-div').css('display', 'none');
        }
    });

    $('#request-form-sub-div').click(function(){
        window.location.href = "../views/job_order.php";
    });

    $('#incoming-request-sub-div').click(function(){
        window.location.href = "../views/incoming_request.php";
    });

    $('#assigned-request-sub-div').click(function(){
        window.location.href = "../views/assigned_request.php";
    });

    $('#employee-admin-sub-down-div').click(function(){
        window.location.href = "../views/admin_management.php";
    });

    $('#adminacc-admin-sub-down-div').click(function(){
        window.location.href = "../views/admin_account_management.php";
    });

    $('#req-dashboard-sub-down-div').click(function(){
        window.location.href = "../views/dashboard_request.php";
    });

    $('#tech-dashboard-sub-down-div').click(function(){
        window.location.href = "../views/dashboard_technicians.php";
    });

    $('#user-dashboard-sub-down-div').click(function(){
        window.location.href = "../views/dashboard_user.php";
    });

    $('#concerns-sub-div').click(function(){
        window.location.href = "../views/concerns.php";
    });

    $('#update-sub-div').click(function(){
        window.location.href = "../views/updates.php";
    });


    $('#logout-btn').click(function(){
        modal_logout.show()

        $(document).off('click', '#yes-modal-btn-logout').on('click', '#yes-modal-btn-logout', function() {
            $.ajax({
                url: '../php/logout.php',
                method: "GET",
                
                success: function(response) {
                    window.location.href = response;
                }
            });
        })
    });

    $(document).off('click', '#burger-icon').on('click', '#burger-icon', function() {
        if($('#burger-icon').css('color') != 'rgb(255, 85, 33)'){
            $('body .left-container').css('display', 'none');
            $('#burger-icon').css('color', '#ff5521');
        }else{
            $('body .left-container').css('display', 'flex');
            $('#burger-icon').css('color', 'white');
        }
    });


})