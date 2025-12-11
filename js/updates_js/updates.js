$(document).ready(function () {

    function fetchUpdates() {
        $.ajax({
            url: '../../php/updates_php/fetch_updates.php',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log(response)
                // Clear existing tables
                $('#ongoing-updates-body').empty();
                $('#major-concerns-body').empty();
                $('#minor-concerns-body').empty();
                $('#completed-updates-body').empty();

                // Loop through each update
                response.data.forEach((update, index) => {
                    let row = `<tr>
                        <td>${index + 1}</td>
                        <td>${update.description}</td>
                        <td>
                            <span class="status-badge status-${update.status}" 
                                data-id="${update.id}"
                                data-status="${update.status}">
                                ${capitalize(update.status)}
                            </span>
                        </td>
                        <td>${update.updated_at}</td>
                    </tr>`;

                    switch(update.status) {
                        case 'ongoing':
                            $('#ongoing-updates-body').append(row);
                            break;
                        case 'major':
                            $('#major-concerns-body').append(row);
                            break;
                        case 'minor':
                            $('#minor-concerns-body').append(row);
                            break;
                        case 'completed':
                            $('#completed-updates-body').append(row);
                            break;
                    }
                });
            },
            error: function(err) {
                console.error('Failed to fetch updates:', err);
            }
        });
    }

    // Helper function to capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Fetch updates on page load
    fetchUpdates();
    // Example: check if current user is admin
    let columns = [
        { data: 'req_no' },
        { data: 'user_name' },
        { data: 'created_at' },
        {
            data: 'details',
            render: function(data) {
                return `<details><summary>View</summary><div>${data}</div></details>`;
            }
        }
    ];

    // If NOT admin → add STATUS column
    if (!isAdmin) {
        columns.push({
            data: 'status',
            orderable: false,
            render: function(data) {
                if (!data) return ""; // avoid undefined errors

                let color = {
                    pending: "#ffc107",
                    major: "#b30000",
                    minor: "#005fb3",
                    rejected: "#6c757d"
                }[data] || "gray";

                return `<span style="
                    font-weight:600;
                    color:white;
                    padding:4px 8px;
                    border-radius:5px;
                    background-color:${color};
                ">${data.toUpperCase()}</span>`;
            }
        });
    }

    // If admin → add action buttons instead
    if (isAdmin) {
        columns.push(
            {
                data: null,
                orderable: false,
                render: () => `<button class="action-btn approve-btn major-btn">Major</button>`
            },
            {
                data: null,
                orderable: false,
                render: () => `<button class="action-btn approve-btn minor-btn">Minor</button>`
            },
            {
                data: null,
                orderable: false,
                render: () => `<button class="action-btn decline-btn reject-btn">Reject</button>`
            }
        );
    }

    let table = $('#admin-suggestions-table').DataTable({
        ajax: {
            url: '../../php/updates_php/fetch_suggestions.php',
            dataSrc: 'data'
        },
        columns: columns,
        order: [[2, "desc"]]
    });



    // Open modal
    $('#add-suggestion-btn').click(function() {
        const modal = new bootstrap.Modal(document.getElementById('modal-suggestion'));
        modal.show();
    });

    // Save suggestion
    $('#save-suggestion-btn').click(function() {
        let details = $('#suggestion-details').val().trim();

        if (!details) {
            alert("Please fill in all fields.");
            return;
        }

        $.ajax({
            url: '../../php/updates_php/save_suggestion.php',
            method: 'POST',
            data: { details },
            success: function(res) {
                if (res.success) {
                    alert("Suggestion added!");
                    table.ajax.reload();
                    $('#suggestion-name').val('');
                    $('#suggestion-details').val('');
                    const modalEl = document.getElementById('modal-suggestion');
                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                    modalInstance.hide();
                } else {
                    alert("Failed: " + res.message);
                }
            },
            error: function() {
                alert("Server error.");
            }
        });
    });

    $(document).on('click', '.status-badge', function () {
        let id = $(this).data('id');
        let currentStatus = $(this).data('status');

        // Status sequence
        let nextStatus = {
            ongoing: "completed",
            completed: "ongoing",
            major: "completed",
            minor: "completed"
        };

        if (!nextStatus[currentStatus]) {
            alert("Status cannot be changed.");
            return;
        }

        let newStatus = nextStatus[currentStatus];

        if (!confirm(`Change status from ${currentStatus.toUpperCase()} → ${newStatus.toUpperCase()}?`)) {
            return;
        }

        $.ajax({
            url: '../../php/updates_php/update_status.php',
            method: 'POST',
            data: { id, status: newStatus },
            dataType: 'json',
            success: (response) => {
                console.log(response)
                try {
                    if (response.success) {
                        alert("Status updated!");
                        fetchUpdates(); // refresh UI
                    } else {
                        alert("Failed: " + response.message);
                    }
                } catch (e) {
                    console.error("Invalid response:", res);
                    alert("Server error.");
                }
            },
            error: () => alert("Server connection error.")
        });
    });

    // Handle Major / Minor / Reject actions
    $(document).on("click", ".major-btn, .minor-btn, .reject-btn", function () {
        let rowData = table.row($(this).closest("tr")).data();
        let id = rowData.id;

        let action = $(this).hasClass("major-btn") ? "major"
                : $(this).hasClass("minor-btn") ? "minor"
                : "reject";

        if (!confirm(`Are you sure you want to mark this as ${action.toUpperCase()}?`)) return;

        $.ajax({
            url: '../../php/updates_php/update_suggestion_status.php',
            method: 'POST',
            data: { id, action },
            dataType: 'json',
            success: function(res) {
                alert(res.message);
                table.ajax.reload();
                fetchUpdates(); // refresh major/minor sections
            },
            error: function() {
                alert("Server error.");
            }
        });
    });


});
