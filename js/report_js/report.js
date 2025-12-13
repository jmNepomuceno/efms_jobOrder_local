function parseCustomDate(dateStr) {
    if (!dateStr) return null;

    // Example: 12/10/2025 - 09:04:58 AM
    const [datePart, timePart, meridian] = dateStr.replace(' - ', ' ').split(' ');

    const [month, day, year] = datePart.split('/').map(Number);
    let [hours, minutes, seconds] = timePart.split(':').map(Number);

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes, seconds);
}


function computeTAT(startDate, endDate) {
    if (!startDate || !endDate) return '';

    const start = parseCustomDate(startDate);
    const end   = parseCustomDate(endDate);

    if (!start || !end || isNaN(start) || isNaN(end)) return '';

    const diffMs = end - start;
    if (diffMs < 0) return '';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (diffDays > 0) {
        return `${diffDays} day(s) ${diffHours} hr(s) ${diffMinutes} min(s)`;
    }
    if (diffHours > 0) {
        return `${diffHours} hr(s) ${diffMinutes} min(s)`;
    }
    return `${diffMinutes} min(s)`;
}



const jobOrderSummaryTable = (startDate, endDate, category, techBioID) => {
    $.ajax({
        url: '../php/report_php/fetch_jobOrderSummary.php',
        method: 'POST',
        data: { startDate, endDate, category, techBioID },
        dataType: 'json',
        success: function (response) {
            console.log(response);

            let dataSet = [];

            for (let i = 0; i < response.length; i++) {

                // Convert Evaluation → Completed
                let status = response[i].requestStatus;
                if (status === "Evaluation") {
                    status = "Completed";
                }

                // Compute TAT
                let tat = computeTAT(
                    response[i].requestStartDate,
                    response[i].requestEvaluationDate
                );

                console.log(tat);

                dataSet.push([
                    `<span class="requestNo-span">${response[i].requestNo}</span>`,
                    `<span>${response[i].requestDate}</span>`,
                    `<div class="location-wrap">${response[i].requestBy?.exact_location || ''}</div>`,
                    `<span class="category-span">${response[i].requestCategory}</span>`,
                    `<span class="status-span">${status}</span>`,
                    `<span>${response[i].requestStartDate ?? ''}</span>`,
                    `<span>${response[i].requestEvaluationDate ?? ''}</span>`,
                    `<span class="tat-span">${tat}</span>`
                ]);
            }

            if ($.fn.DataTable.isDataTable('#job-order-summary-table')) {
                $('#job-order-summary-table').DataTable().destroy();
                $('#job-order-summary-table tbody').empty();
            }

           $('#job-order-summary-table').DataTable({
                data: dataSet,
                autoWidth: false,
                ordering: false,
                stripeClasses: [],
                columns: [
                    { title: "JOB ORDER NO" },
                    { title: "DATE REQUESTED" },
                    { title: "LOCATION" },
                    { title: "CATEGORY" },
                    { title: "JOB STATUS" },
                    { title: "DATE STARTED" },
                    { title: "DATE COMPLETED" },
                    { title: "TURN AROUND TIME" }
                ],
                columnDefs: [
                    { targets: 0, width: "120px", className: "job-no-td" },
                    { targets: 1, width: "140px", className: "job-date-req-td" },
                    { targets: 2, width: "180px", className: "job-location-td" }, // 🔑 controlled
                    { targets: 3, width: "110px", className: "job-category-td" },
                    { targets: 4, width: "110px", className: "job-status-td" },
                    { targets: 5, width: "140px", className: "job-date-started-td" },
                    { targets: 6, width: "150px", className: "job-date-completed-td" },
                    { targets: 7, width: "160px", className: "tat-td" }
                ]
            });

                    },
                    error: function (xhr, status, error) {
                        console.error("Job Order Summary fetch failed:", error);
                    }
                });
            };



$(document).ready(function () {

    // Initial load (no filters)
    jobOrderSummaryTable('', '', 'ALL', null);

    // APPLY FILTER
    $('#filter-apply-btn').on('click', function () {

        const startDate = $('#filter-start-date').val();
        const endDate   = $('#filter-end-date').val();
        const category  = $('#filter-category').val();
        const techBioID = $('#filter-techBioID').val() || null;

        jobOrderSummaryTable(startDate, endDate, category, techBioID);
    });

    // RESET FILTER
    $('#filter-reset-btn').on('click', function () {

        $('#filter-start-date').val('');
        $('#filter-end-date').val('');
        $('#filter-category').val('ALL');
        $('#filter-techBioID').val('');

        jobOrderSummaryTable('', '', 'ALL', null);
    });

});

