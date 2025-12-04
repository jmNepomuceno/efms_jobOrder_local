let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));

let clicked_draggable = {}

// Global variables to track selected employees and multi-select mode
let selectedDraggables = new Set();
let multiSelectEnabled = false;

const drag_function = () => {
    let draggables = document.querySelectorAll(".draggable");
    let containers = document.querySelectorAll(".draggable-container");
    let multiSelectBtn = document.getElementById("multi-select-drag-btn");

    // Toggle Multi-Select Mode
    multiSelectBtn.addEventListener("click", () => {
        $('#multi-select-drag-btn').css('opacity', '1')
        multiSelectEnabled = !multiSelectEnabled;
        multiSelectBtn.style.opacity = multiSelectEnabled ? "1" : "0.5";        
        // multiSelectBtn.textContent = multiSelectEnabled ? "Disable Multi-Select" : "Multi Select";

        // Clear selection when disabling multi-select
        if (!multiSelectEnabled) {
            selectedDraggables.forEach(el => el.classList.remove("selected"));
            selectedDraggables.clear();
        }
    });

    // Ensure all elements are draggable
    draggables.forEach(draggable => {
        draggable.setAttribute("draggable", "true");

        // Handle Click for Multi-Select (No need for Ctrl/Cmd)
        draggable.addEventListener("click", function () {
            if (!multiSelectEnabled) return; // Only allow selection in multi-select mode

            if (selectedDraggables.has(this)) {
                // Deselect if already selected
                selectedDraggables.delete(this);
                this.classList.remove("selected");
            } else {
                // Select the item
                selectedDraggables.add(this);
                this.classList.add("selected");
            }
        });

        // Handle Drag Start
        draggable.addEventListener("dragstart", function (event) {
            if (!multiSelectEnabled || !selectedDraggables.has(this)) {
                // If dragging without multi-select, reset selected items
                selectedDraggables.forEach(el => el.classList.remove("selected"));
                selectedDraggables.clear();
                selectedDraggables.add(this);
            }

            // Store selected items
            event.dataTransfer.setData("text/plain", [...selectedDraggables].map(el => el.id).join(","));
            setTimeout(() => selectedDraggables.forEach(el => el.classList.add("hide")), 0);
        });

        // Handle Drag End
        draggable.addEventListener("dragend", function () {
            selectedDraggables.forEach(el => el.classList.remove("hide"));
        });
    });

    containers.forEach(container => {
        container.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        container.addEventListener("drop", function (event) {
            event.preventDefault();
            let draggedElementIDs = event.dataTransfer.getData("text/plain").split(",");

            draggedElementIDs.forEach(id => {
                let draggedElement = document.getElementById(id);
                if (!draggedElement) return;

                draggedElement.classList.add("draggable-done");
                draggedElement.classList.remove("hide");

                clicked_draggable[draggedElement.id] = container.id.replace("-category", "");
                container.appendChild(draggedElement);
            });

            // Clear selection after dropping
            selectedDraggables.forEach(el => el.classList.remove("selected"));
            selectedDraggables.clear();
        });
    });
};

const reset_styling = () =>{
    $('#refresh-drag-btn').css('opacity', '0.5')
    $('#multi-select-drag-btn').css('display', 'none')
    $('#multi-select-drag-btn').css('opacity', '0.5')

    $('#add-personel-btn').css('opacity', '0.5')
    $('#move-personel-btn').css('opacity', '0.5')

    $('.confirmation-btn').css('display', 'none')   
}

const fetchNotifValue = () =>{
    $.ajax({
        url: '../php/incoming_request_php/fetch_notifValue.php',
        method: "POST",
        dataType : 'json',
        success: function(response) {
            try { 
                // console.log(response)
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

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("Received from WebSocket:", data); // Debugging

    // Call fetchNotifValue() on every process update
    switch (data.action) {
        case "refreshIncomingTable":
            fetchNotifValue()
            break;
        default:
            console.log("Unknown action:", data.action);
    }
};



$(document).ready(function(){
    fetchNotifValue(); 
    
    $(document).off('click', '#add-personel-btn').on('click', '#add-personel-btn', function() {  
        $('#move-personel-btn').css('opacity', '')
        $('#add-personel-btn').css('opacity', '1')

        $('.confirmation-btn').css('display', 'flex')
    })      
    
    $(document).off('click', '#move-personel-btn').on('click', '#move-personel-btn', function() {  
        $('#multi-select-drag-btn').css('display', 'block')

        $('#add-personel-btn').css('opacity', '')
        $('#move-personel-btn').css('opacity', '1')

        $('.confirmation-btn').css('display', 'flex')

        $('.delete-btn').css('display', 'flex')


        $('.draft-container-div .free-agents .draggable').css('pointer-events', 'auto')
        $('.category-container .container .draggable-container .draggable-done').css('pointer-events', 'auto')
        drag_function()
    })

    $(document).off('click', '#cancel-btn').on('click', '#cancel-btn', function() {  
        $('#add-personel-btn').css('opacity', '')
        $('#move-personel-btn').css('opacity', '1')
        
        $('.confirmation-btn').css('display', 'none')

        $('.delete-btn').css('display', 'none')
        reset_styling()

    })

    $(document).off('click', '#save-btn').on('click', '#save-btn', function() {  
        try {
            $.ajax({
                url: '../php/admin_management_php/edit_tech_category.php',
                method: "POST",
                data: { updates: JSON.stringify(clicked_draggable) },
                success: function(response) {
                    try { 
                        console.log("Update response:", response);
                        reset_styling()

                        modal_notif.show();
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

    $(document).off('click', '#refresh-drag-btn').on('click', '#refresh-drag-btn', function() {  
        try {
            $.ajax({
                url: '../php/admin_management_php/fetch_dataEmployees.php',
                method: "POST",
                success: function(response) {
                    
                    try { 
                        $('#refresh-drag-btn').css('opacity', '1')
                        if (response == "No new entries") {
                            $('.loader').css('display', 'block'); 
                            $('.free-agents').css('display', 'none');
                            setTimeout(() => {
                                $('.loader').css('display', 'none'); 
                                $('#modal-notif #modal-title-incoming').text("Notification")
                                $('#modal-notif #modal-body-incoming').text("No new entries")
                                $('.free-agents').css('display', 'flex');
                                modal_notif.show()
                                reset_styling()

                            }, 2000); 
                        }
                        else if (response != "error") {
                            $('.loader').css('display', 'block'); // Show loader
                            document.querySelector('.free-agents').textContent = ""
                            setTimeout(() => {
                                $('.loader').css('display', 'none'); // Hide loader after 2 seconds
                                document.querySelector('.free-agents').innerHTML = response;
                                $('#refresh-drag-btn').css('opacity', '0.5')
                            }, 2000); 
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

    $(document).off('click', '#search-btn').on('click', '#search-btn', function () {
        let searchValue = $('#search-input').val().toLowerCase();
        let draggables = document.querySelectorAll(".free-agents span");
    
        draggables.forEach(draggable => {
            // Always show if selected
            if (draggable.classList.contains('selected')) {
                draggable.style.display = "block";
            } else if (draggable.textContent.toLowerCase().includes(searchValue)) {
                draggable.style.display = "block";
            } else {
                draggable.style.display = "none";
            }
        });
    });

    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation(); // prevent drag event
        const id = $(this).data('id');
        console.log(id)
        
        if (confirm('Are you sure you want to delete this personnel?')) {
            $.post('../php/admin_management_php/delete_personnel.php', { id: id }, function(response) {
                const res = JSON.parse(response);
                if (res.status === 'success') {
                    $('#' + id).remove();
                } else {
                    alert('Error deleting personnel.');
                }
            });
        }
    });

    
    // Search filter logic for draggable items
    $(document).off('input', '.title-search-input').on('input', '.title-search-input', function () {
        let searchValue = $(this).val().toLowerCase();
        
        // Get the .draggable-container within the same .container
        let $container = $(this).closest('.container').find('.draggable-container');
        
        // Loop over all .draggable items in that container
        $container.find('.draggable').each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchValue));
        });
    });


})