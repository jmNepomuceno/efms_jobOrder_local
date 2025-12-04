$(document).ready(function () {

    let concerns = []; // store fetched concerns globally
    let concernsTable; // global reference to DataTable

    // Submit concern (USER ONLY)
    $("#submit-concern-btn").on("click", function () {

        let title = $("#concern-title").val().trim();
        let desc  = $("#concern-description").val().trim();

        if (title === "" || desc === "") {
            alert("Please fill in all fields.");
            return;
        }

        $.ajax({
            url: '../../php/concerns_php/add_concerns.php',
            method: "POST",
            data: {
                concernTitle: title,
                concernDescription: desc
            },
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    alert("Concern submitted!");
                    renderConcerns();
                    $("#concern-title").val("");
                    $("#concern-description").val("");
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function () {
                alert("AJAX Error.");
            }
        });

    });


    // Load concerns into table
    function renderConcerns() {
        $.ajax({
            url: isAdmin 
                ? '../../php/concerns_php/fetch_concerns_admin.php'
                : '../../php/concerns_php/fetch_concerns_per_user.php',
            method: "GET",
            dataType: "json",
            success: function (response) {
                // Destroy existing DataTable if initialized
                if ($.fn.DataTable.isDataTable('.concern-table')) {
                    $('.concern-table').DataTable().destroy();
                }

                $("#concern-list").empty();

                if (!response.success || response.data.length === 0) {
                    $("#concern-list").append("<tr><td colspan='4'>No concerns found.</td></tr>");
                } else {
                    concerns = response.data; // store globally

                    concerns.forEach(c => {
                        let badge = `
                            <span class="status-badge status-${c.concernStatus.toLowerCase()}">
                                ${c.concernStatus}
                            </span>
                        `;

                        let submittedBy = isAdmin 
                            ? `<br><small><b>By:</b> ${c.userName ?? 'Unknown'} (ID: ${c.userID})</small>`
                            : "";

                        $("#concern-list").append(`
                            <tr data-id="${c.concernID}" class="concern-row">
                                <td>${c.concernTitle} ${submittedBy}</td>
                                <td>${badge}</td>
                                <td>${c.dateSubmitted}</td>
                                <td><button class="view-details-btn">View</button></td>
                            </tr>
                        `);
                    });
                }

                // Initialize DataTable after rows are appended
                concernsTable = $('.concern-table').DataTable({
                    order: [[2, 'desc']], // default sort by date descending
                    columnDefs: [
                        { orderable: false, targets: 3 } // make Action column not sortable
                    ],
                    pageLength: 10,
                    lengthMenu: [5, 10, 25, 50],
                    language: {
                        emptyTable: "No concerns available"
                    }
                });
            },
            error: function () {
                $("#concern-list").html("<tr><td colspan='4'>Error loading concerns.</td></tr>");
            }
        });
    }


    // Expand details
    $(document).on("click", ".view-details-btn", function () {
        let row = $(this).closest("tr");
        let concernID = row.data("id");

        $(".concern-details-row").remove(); // remove existing

        let concern = concerns.find(x => x.concernID == concernID);

        let template = $("#concern-detail-template").html()
            .replace("__DESCRIPTION__", concern.concernDescription)
            .replace("__RESPONSE__", concern.adminResponse || "No response yet.");

        row.after(template);

        // Hide admin response box for normal users
        if (!isAdmin) {
            row.next().find(".admin-response-box").remove();
        }
    });


    // Admin sending a response
    $(document).on("click", ".send-response-btn", function () {

        let row = $(this).closest("tr").prev(); 
        let concernID = row.data("id");
        let responseText = $(this).closest(".admin-response-box").find(".response-input").val().trim();

        if (responseText === "") {
            alert("Response cannot be empty.");
            return;
        }

        $.ajax({
            url: '../../php/concerns_php/admin_response.php',
            method: "POST",
            data: {
                concernID: concernID,
                responseText: responseText
            },
            dataType: "json",

            success: function (res) {
                if (res.success) {
                    alert("Response sent!");
                    renderConcerns();
                } else {
                    alert("Error: " + res.message);
                }
            },

            error: function () {
                alert("AJAX Error.");
            }
        });

    });

    // Close details section
    $(document).on("click", ".close-details-btn", function () {
        $(this).closest("tr.concern-details-row").remove();
    });


    renderConcerns();
});
