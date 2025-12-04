let request_modal = new bootstrap.Modal(document.getElementById('user-info-modal'));
// let assign_modal = new bootstrap.Modal(document.getElementById('assign-to-modal'));

let fetch_requestData, fetch_techMyJob;
let clicked_requestNo = 0, clicked_requestNo_myJob = 0;
let clicked_tech_assess_textarea = ""
let clicked_sub_nav = "Assigned"

const dateFormatter = (originalDate) =>{
    const dateParts = originalDate.split(" - ");
    const [month, day, year] = dateParts[0].split("/");
    const timePart = dateParts[1];

    const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);

    // Format the date
    const formattedDate = dateObj.toLocaleString('en-US', {
        month: 'short',      // Mar
        day: '2-digit',      // 11
        year: 'numeric',     // 2025
        hour: '2-digit',     // 9
        minute: '2-digit',   // 04
        second: '2-digit',   // 08
        hour12: true         // AM/PM format
    });

    return formattedDate
}

const dataTable_incoming_request = () =>{
    try {
        $.ajax({
            url: '../../php/incoming_request_php/fetch_incoming_req.php',
            method: "POST",
            dataType : "json",
            success: function(response) {
                fetch_requestData = response
                console.log(fetch_requestData)
                try {
                    let dataSet = [];
                    for(let i = 0; i < response.length; i++){
                        const originalDate = response[i].requestDate;
                        const dateParts = originalDate.split(" - ");
                        const [month, day, year] = dateParts[0].split("/");
                        const timePart = dateParts[1];

                        const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);
                        const now = new Date();

                        // Check if more than 2 hours have passed
                        const diffInMs = now - dateObj;
                        const diffInHours = diffInMs / (1000 * 60 * 60);
                        const isOverdue = diffInHours > 2;

                        const formattedDate = dateObj.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        });

                        // Highlight in red if overdue
                        const formattedDateHTML = `<span style="color: ${isOverdue ? 'red' : 'black'}">${formattedDate}</span>`;

                        dataSet.push([
                            `<div><span>${response[i].requestNo}</span></div>`,
                            `<div class="request-by-td-div">
                                <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</span>
                            </div>`,
                            `<div><span>${response[i].requestNo}</span></div>`,
                            `<div>${formattedDateHTML}</div>`,
                            `<div><span class="unit-td-span">${response[i].requestCategory}</span></div>`,
                            `<div><span class="category-td-span">${response[i].requestSubCategory}</span></div>`,
                            `<div class="request-button-td-div"><button class="request-action-button btn btn-secondary">View Request</button></div>`,
                        ]);
                    }  

                    if ($.fn.DataTable.isDataTable('#incoming-req-table')) {
                        $('#incoming-req-table').DataTable().destroy();
                        $('#incoming-req-table tbody').empty(); // Clear previous table body
                    }

                    $('#incoming-req-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "NAME OF REQUESTER", data:1 },
                            { title: "ASSIGN JOB DETAILS", data:2 },
                            { title: "DATE REQUESTED", data:3 },
                            { title: "UNIT", data:4 },
                            { title: "CATEGORY", data:5 },
                            { title: "ACTION", data:6 },    
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-req-no-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } , width:"35%"},
                            { targets: 2, visible: false },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-date-td'); } },
                            { targets: 4, createdCell: function(td) { $(td).addClass('item-unit-td'); } },
                            { targets: 5, createdCell: function(td) { $(td).addClass('item-category-td'); } },
                            { targets: 6, createdCell: function(td) { $(td).addClass('item-action-td'); } },
                        ],
                        "autoWidth": false, // Prevents auto column sizing
                        // "paging": false,
                        // "info": false,
                        "ordering": false,
                        "stripeClasses": [],
                        "searching": false,
                        
                    });

                    // **Set unique ID for each row after table initialization**
                    $('#incoming-req-table tbody tr').each(function(index) {
                        $(this).attr('class', `incoming-req-row-class`);
                    });

                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });


        //fetch is theres on proncess on your job
        // $.ajax({
        //     url: '../php/incoming_request_php/fetch_myJobs.php',
        //     method: "POST",
        //     data : {what : "On-Process"},
        //     dataType : 'json',
        //     success: function(response) {
        //         // console.log(response)
        //         try { 
        //             if(parseInt(response.length) >= 1){
        //                 $('#on-process-notif-span').text(response.length)
        //                 $('#on-process-notif-span').css('display' , 'flex')
        //             }
        //         } catch (innerError) {
        //             console.error("Error processing response:", innerError);
        //         }
        //     },
        //     error: function(xhr, status, error) {
        //         console.error("AJAX request failed:", error);
        //     }
        // });

        //  //fetch is theres evaluation on your job
        //  $.ajax({
        //     url: '../php/incoming_request_php/fetch_for_evaluation.php',
        //     method: "POST",
        //     data : {what : "both"},
        //     dataType : 'json',
        //     success: function(response) {
        //         console.log(response)
        //         try { 
        //             if(response >= 1){
        //                 $('#for-evaluation-notif-span').text(response)
        //                 $('#for-evaluation-notif-span').css('display' , 'block')
                        
        //                 $('#your-job-notif-span').text(parseInt($('#for-evaluation-notif-span').text()) + parseInt($('#on-process-notif-span').text()))
        //                 $('#your-job-notif-span').css('display' , 'block')
        //             }
        //         } catch (innerError) {
        //             console.error("Error processing response:", innerError);
        //         }
        //     },
        //     error: function(xhr, status, error) {
        //         console.error("AJAX request failed:", error);
        //     }
        // });

        

    } catch (ajaxError) {
        console.error("Unexpected error occurred:", ajaxError);
    }
}

const getTimeDifference = (start, end) => {
    // Convert to Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate difference in milliseconds
    let diffMs = endDate - startDate;

    if (diffMs < 0) return "00:00:00"; // If end is before start, return zero

    // Convert to hh:mm:ss
    const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

const dataTable_my_jobs = (what) =>{ 
    console.log($('#division-select option:selected').text())
    try {
        const filters = {
            what: what,
            job_no: $('#job-no-input').val(),
            division: $('#division-select option:selected').text().trim() === "Select Division" ? null : $('#division-select option:selected').text().trim(),
            section: $('#section-select').val(),
            lastname: $('#lastname-input').val(),
            firstname: $('#firstname-input').val(),
            bioID: $('#bioId-input').val() ? parseInt($('#bioId-input').val()) : $('#bioId-input').val(),
            status: $('#status-select').val(),
            technician: $('#technician-select').val(),
            requestType: $('#requestType-select').val(),
            dateFrom: $('#dateFrom-input').val(),
            dateTo: $('#dateTo-input').val()
        };
        console.log(filters)

        $.ajax({
            url: '../../php/incoming_request_php/fetch_myJobs.php',
            method: "POST",
            data : {filters},
            dataType : "json",
            success: function(response) {
                $('#assign-assess-btn').css('display', 'none'); // cancel-assign-assess-btn
                $('.assign-to-div').css('display', 'none');
                $('#cancel-assign-assess-btn').css('display', 'none');

                console.log(response)
                fetch_techMyJob = response
                try {
                    let dataSet = [];
                    let recept_interval = "", eval_interval = ""
                    

                    for(let i = 0; i < response.length; i++){

                        response[i].requestDate = dateFormatter(response[i].requestDate)
                        response[i].requestEvaluationDate = response[i].requestEvaluationDate ? dateFormatter(response[i].requestEvaluationDate) : null
                        response[i].assignTargetStartDate = response[i].assignTargetStartDate ? dateFormatter(response[i].assignTargetStartDate) : null
                        response[i].assignTargetEndDate = response[i].assignTargetEndDate ? dateFormatter(response[i].assignTargetEndDate) : null
                        let start =
                            response[i].requestStartDate ||
                            response[i].requestPendingMaterialsDate ||
                            response[i].requestForSchedDate ||
                            response[i].requestCorrectionDate ||
                            null;

                        response[i].requestStartDate = start ? dateFormatter(start) : null;
                        fetch_techMyJob[i]['what'] = what
                        console.log(clicked_sub_nav)

                        
                        // update the number of the notif value
                        // $('#your-job-notif-span').text(parseInt(response.length))
                        // $('#your-job-notif-span').css('display' , 'block')

                        let assignedTechs = response[i].assignedTechs || [];
                        let mainTech = assignedTechs.length ? assignedTechs[0].name : "";
                        let extraTechs = assignedTechs.slice(1); // remaining techs

                        // Create expandable dropdown if more than 1 technician
                        let techDropdownHTML = '';
                        if (extraTechs.length > 0) {
                            let extraList = extraTechs.map(t => `<li>${t.name} (Bio ID: ${t.bioID})</li>`).join('');
                            techDropdownHTML = `
                                <div class="assigned-tech-dropdown" style="display:inline-block; margin-left:5px; cursor:pointer; color:#0d6efd;">
                                    <span class="toggle-techs">(+${extraTechs.length} more)</span>
                                    <ul class="tech-list" style="display:none; list-style-type:none; margin:5px 0 0 0; padding-left:10px; border-left: 2px solid #0d6efd;">
                                        ${extraList}
                                    </ul>
                                </div>
                            `;
                        }

                        if(clicked_sub_nav === 'Assigned'){
                            // recept_interval = getTimeDifference(response[i].requestDate, response[i].requestStartDate);
                            // let interval_style = "";
                            // if (recept_interval !== "00:00:00" && getTimeDifference(response[i].requestDate, response[i].requestStartDate) > "02:00:00") {
                            //     interval_style = "color: red;";
                            // } else {
                            //     interval_style = "color: #1a8754;";
                            // }

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</>
                                </div>`,

                                `<div class="request-by-td-div">
                                    <span>Name: ${mainTech}</span>
                                    ${techDropdownHTML}
                                    <span><b>Bio ID</b>: ${assignedTechs.length ? assignedTechs[0].bioID : ''}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy}</span>
                                </div>`,

                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Target Start Date:</b> ${response[i].assignTargetStartDate}</span>
                                    <span><b>Target End Date:</b> ${response[i].assignTargetEndDate}</span>
                                </div>`,
                                `<div><span class="request-category-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="request-subcategory-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div">
                                    <button class="request-action-button-myJob btn btn-secondary">View Request</button>
                                    <button class="request-print-button-myJob btn btn-warning">Print Form</button>
                                </div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'On-Process'){
                            recept_interval = getTimeDifference(response[i].requestDate, response[i].requestStartDate);
                            let interval_style = "";
                            if (recept_interval !== "00:00:00" && getTimeDifference(response[i].requestDate, response[i].requestStartDate) > "02:00:00") {
                                interval_style = "color: red;";
                            } else {
                                interval_style = "color: #1a8754;";
                            }

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</>
                                </div>`,
                                 `<div class="request-by-td-div">
                                    <span>Name: ${mainTech}</span>
                                    ${techDropdownHTML}
                                    <span><b>Bio ID</b>: ${assignedTechs.length ? assignedTechs[0].bioID : ''}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested:</b> ${response[i].requestDate}</span>
                                    <span>
                                        <b>Reception:</b> 
                                        ${response[i].requestStartDate}
                                        <button class="interval-toggle">▼</button>
                                        <h6 class='recept-interval' style='${interval_style}'>+${recept_interval}</h6>
                                    </span>
                                </div>`,
                                `<div><span class="request-category-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="request-subcategory-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div">
                                    <button class="request-action-button-myJob btn btn-secondary">View Request</button>
                                    <button class="request-print-button-myJob btn btn-warning">Print Form</button>
                                </div>`,

                            ])
                        }

                        if(clicked_sub_nav === 'Evaluation'){
                            // console.log(response[i].requestEvaluationDate)
                            // response[i].requestEvaluationDate = dateFormatter(response[i].requestEvaluationDate)
                            let rawStart = response[i].assignTargetStartDate; // "Tue, Nov 04, 2025, 11:34:25 AM"
                            let rawEnd = response[i].requestEvaluationDate; // "11/04/2025 - 11:46:01 AM"

                            // Parse into Date objects
                            const startTime = new Date(rawStart);
                            const endTime = new Date(rawEnd);

                            // Check for invalid dates
                             const diffMs = endTime - startTime;
                            const hours = Math.floor(diffMs / (1000 * 60 * 60));
                            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

                            const formattedTimeDiff = `${hours}h ${minutes}m ${seconds}s`;
                            console.log(formattedTimeDiff);


                            const twoHours = 2 * 60 * 60 * 1000;
                            
                            let style = "";
                            // if (!isNaN(timeDiff) && timeDiff > twoHours) {
                            //     style = "color: red; font-weight: bold;";
                            // }else{
                            //     style = "color: #1a8754; font-weight: bold;";
                            // }

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</span>
                                </div>`,
                                `<div class="request-by-td-div">
                                    <span>Name: ${mainTech}</span>
                                    ${techDropdownHTML}
                                    <span><b>Bio ID</b>: ${assignedTechs.length ? assignedTechs[0].bioID : ''}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy}</span>
                                    <span id="final-completion-time"><b>Completion Time</b>: ${response[i].requestEvaluationDate}</span>
                                    <span style='${style}'><b>Turn-around Time: </b> ${formattedTimeDiff} </span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                                    <span><b>For Evaluation Date:</b> ${response[i].requestEvaluationDate}</span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div">
                                    <button class="request-action-button-myJob btn btn-secondary">View Request</button>
                                    <button class="request-print-button-myJob btn btn-warning">Print Form</button>
                                </div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Completed'){
                            let rawStart = response[i].assignTargetStartDate; // "Tue, Nov 04, 2025, 11:34:25 AM"
                            let rawEnd = response[i].requestEvaluationDate; // "11/04/2025 - 11:46:01 AM"

                            // Parse into Date objects
                            const startTime = new Date(rawStart);
                            const endTime = new Date(rawEnd);

                            // Check for invalid dates
                             const diffMs = endTime - startTime;
                            const hours = Math.floor(diffMs / (1000 * 60 * 60));
                            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

                            const formattedTimeDiff = `${hours}h ${minutes}m ${seconds}s`;
                            console.log(formattedTimeDiff);


                            const twoHours = 2 * 60 * 60 * 1000;
                            
                            let style = "";
                            // if (!isNaN(timeDiff) && timeDiff > twoHours) {
                            //     style = "color: red; font-weight: bold;";
                            // }else{
                            //     style = "color: #1a8754; font-weight: bold;";
                            // }

                            // response[i].requestEvaluationDate = dateFormatter(response[i].requestEvaluationDate)
                            response[i].requestCompletedDate = dateFormatter(response[i].requestCompletedDate)

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                </div>`,
                                 `<div class="request-by-td-div">
                                    <span>Name: ${mainTech}</span>
                                    ${techDropdownHTML}
                                    <span><b>Bio ID</b>: ${assignedTechs.length ? assignedTechs[0].bioID : ''}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy}</span>
                                    <span id="final-completion-time"><b>Completion Time</b>: ${response[i].requestEvaluationDate}</span>
                                    <span style='${style}'><b>Turn-around Time: </b> ${formattedTimeDiff} </span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                                    <span><b>For Evaluation Date:</b> ${response[i].requestEvaluationDate}</span>
                                    <span><b>Completed Date:</b> ${response[i].requestEvaluationDate} </span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div">
                                    <button class="request-action-button-myJob btn btn-secondary">View Request</button>
                                    <button class="request-print-button-myJob btn btn-warning">Print Form</button>

                                </div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Correction'){

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</>
                                </div>`,
                                 `<div class="request-by-td-div">
                                    <span>Name: ${response[i].assignTo}</span>
                                    <span><b>Bio ID</b>: ${response[i].assignToBioID}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Correction Date:</b> ${response[i].requestStartDate}</span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div"><button class="request-action-button-myJob btn btn-secondary">View Request</button></div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Pending Materials'){
                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</>
                                </div>`,
                                 `<div class="request-by-td-div">
                                    <span>Name: ${(response[i].assignTo) ? response[i].assignTo : ''}</span>
                                    <span><b>Bio ID</b>: ${response[i].assignToBioID ? response[i].assignToBioID : ''}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate ? response[i].assignTargetStartDate : ''}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate ? response[i].assignTargetEndDate : ''}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy ? response[i].assignBy : ''}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Correction Date:</b> ${response[i].requestStartDate}</span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div">
                                    <button class="request-action-button-myJob btn btn-secondary">View Request</button>
                                    <button class="request-print-button-myJob btn btn-warning">Print Form</button>
                                </div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'For Schedule'){

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                    <span class="request-by-exactLocation-td-div"><b>Exact Location:</b> ${response[i].requestBy.exact_location}</>
                                </div>`,
                                 `<div class="request-by-td-div">
                                    <span>Name: ${(response[i].assignTo) ? response[i].assignTo : ''}</span>
                                    <span><b>Bio ID</b>: ${response[i].assignToBioID ? response[i].assignToBioID : ''}</span>
                                    <span><b>Target Start Date</b>: ${response[i].assignTargetStartDate ? response[i].assignTargetStartDate : ''}</span>
                                    <span><b>Target End Date</b>: ${response[i].assignTargetEndDate ? response[i].assignTargetEndDate : ''}</span>
                                    <span><b>Assigned By</b>: ${response[i].assignBy ? response[i].assignBy : ''}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Correction Date:</b> ${response[i].requestStartDate}</span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                                `<div class="request-button-td-div">
                                    <button class="request-action-button-myJob btn btn-secondary">View Request</button>
                                    <button class="request-print-button-myJob btn btn-warning">Print Form</button>
                                </div>`,
                            ])
                        }
                       
                    }  

                    if ($.fn.DataTable.isDataTable('#incoming-req-table')) {
                        $('#incoming-req-table').DataTable().destroy();
                        $('#incoming-req-table tbody').empty(); // Clear previous table body
                    }

                    $('#incoming-req-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "NAME OF REQUESTER", data:1 },
                            { title: "ASSIGN TO DETAILS", data:2 },
                            { title: "DATE", data:3 },
                            { title: "UNIT", data:4 },
                            { title: "CATEGORY", data:5 },
                            { title: "ACTION", data:6 },
                        ],
                        columnDefs: [
                            { targets: 0, width: "10%", className: "item-req-no-td text-center" },
                            { targets: 1, width: "25%", className: "item-name-td" },
                            { targets: 2, width: "30%", className: "item-assign-td" },
                            { targets: 3, width: "20%", className: "item-date-td" },
                            { targets: 4, width: "5%", className: "item-unit-td text-center" },
                            { targets: 5, width: "5%", className: "item-category-td text-center" },
                            { targets: 6, width: "5%", className: "item-action-td text-center" },
                        ],
                        "autoWidth": false, // Prevents auto column sizing 
                        // "paging": false,
                        // "info": false,
                        "ordering": false,
                        "stripeClasses": [],
                        "searching": false,
                        
                    });

                    // **Set unique ID for each row after table initialization**
                    $('#incoming-req-table tbody tr').each(function(index) {
                        $(this).attr('class', `my-job-row-class`);
                    });

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
}

const fetchNotifValue = () =>{
    $.ajax({
        url: '../php/incoming_request_php/fetch_notifValue.php',
        method: "POST",
        dataType : 'json',
        success: function(response) {
            try { 
                console.log(response)
                const pending_value = parseInt(response.count_pending)
                const myJob_value = parseInt(response.count_evaluation) + parseInt(response.count_onProcess) + parseInt(response.count_pendingMaterials) + parseInt(response.count_forSchedule)
                const onProcess_value = parseInt(response.count_onProcess)
                const evaluation_value = parseInt(response.count_evaluation)
                const pendingMaterials_value = parseInt(response.count_pendingMaterials)
                const forSchedule_value = parseInt(response.count_forSchedule)
                
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

                if(pendingMaterials_value > 0){
                    $('#pending-materials-notif-span').text(pendingMaterials_value)
                    $('#pending-materials-notif-span').css('display' , 'block')
                }else{
                    $('#pending-materials-notif-span').css('display' , 'none')
                }

                if(forSchedule_value > 0){
                    $('#for-schedule-notif-span').text(forSchedule_value)
                    $('#for-schedule-notif-span').css('display' , 'block')
                }else{
                    $('#for-schedule-notif-span').css('display' , 'none')
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

const convertDate = (rawDate) =>{
    let date = new Date(rawDate);

    // Extract parts
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    hours = String(hours).padStart(2, '0');

    return `${month}/${day}/${year} - ${hours}:${minutes}:${seconds} ${ampm}`;
}

function printRequestForm() {
    const printContents = document.getElementById("printable-area").innerHTML;
    const printWindow = window.open('', '', 'width=900,height=700');

    printWindow.document.write(`
        <html>
            <head>
                <title>EFMS Job Order Printout</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 25px;
                        color: #333;
                    }

                    /* Header Title */

                    h5.info-heading {
                        background: #5a362d;
                        color: black;
                        border-radius: 5px;
                        font-size: 1.2rem;
                        margin-top:0;
                    }

                    .main-information {
                        display: flex;
                        justify-content: space-between;
                        gap: 20px;
                        margin-bottom: 15px;
                    }

                    .user-info, .job-order-info {
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        padding: 10px;
                        width: 48%;
                        box-sizing: border-box;
                    }

                    .user-details p,
                    .job-order-info p {
                        margin: 5px 0;
                    }

                    .request-description,
                    .tech-assessment-section,
                    .assigned-details-section,
                    .assign-to-div {
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        margin-top: 15px;
                        height:100px;
                        padding:5px;

                        display:flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                    }

                    .assigned-details-section{
                        height:150px;
                    }

                    .assigned-info-assessment{
                        display:flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        gap:5px;

                        font-size:0.8rem;
                    }


                    .request-description h5{
                        padding:0 !important;
                        margin:0 !important;
                    }

                    .user-details, .job-order-info, .request-description, .tech-assessment-section {
                        font-size: 14px;
                    }

                    .assign-to-div{
                        display:none;
                    }

                    /* Hide technician name & reception date row */
                    .tech-info-assessment {
                        display: none !important;
                    }

                    /* Hide all interactive elements */
                    textarea, select, input[type=datetime-local], button {
                        display: none !important;
                    }

                    .tech-assessment-section h5{
                        padding:0 !important;
                        margin:0 !important;
                    }

                    .tech-remarks-textarea{
                        display:flex !important;
                        width:100%;
                        height:auto !important;
                        font-size:14px;
                        font-family: Arial, sans-serif;
                        border:none;
                        resize: none;
                    }

                    textarea::placeholder {
                        color: transparent !important;
                    }

                    .function-btn,
                    .assessment-section,
                    .tech-btns {
                        display: none !important;
                    }

                    @media print {
                        .signature-section {
                            margin-top: 10px;
                            font-size: 14px;
                        }

                        .signature-section table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        .signature-section td {
                            padding-top: 40px;
                        }
                        .print-header img {
                            height: 80px;
                        }

                        .print-header {
                            margin-bottom: 30px;
                        }
                    }  
                </style>
            </head>
            <body>
                ${printContents}
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}



const _init = () =>{
    const technicianSelect = $('#technician-select');
    $.ajax({
        url: '../php/incoming_request_php/fetch_technicians.php',
        method: 'GET',
        dataType: 'json',
        success: function (technicians) {
            technicianSelect.find('option:not(:first)').remove();

            technicians.forEach(tech => {
                const fullName = `${tech.firstName} ${tech.lastName}`;
                technicianSelect.append(
                    `<option value="${tech.techBioID}">${tech.techBioID} - ${fullName} (${tech.techCategory})</option>`
                );
            });
        },
        error: function (xhr) {
            console.error('Error loading technicians:', xhr.responseText);
        }
    });


    const statusSelect = $('#status-select');
    const requestTypeSelect = $('#requestType-select');

    // 1️⃣ Load all categories first
    $.ajax({
        url: '../php/incoming_request_php/fetch_categories.php',
        method: 'GET',
        dataType: 'json',
        success: function (categories) {
            statusSelect.find('option:not(:first)').remove();
            categories.forEach(cat => {
                statusSelect.append(
                    `<option value="${cat.category_code}">${cat.category_description}</option>`
                );
            });
        },
        error: function (xhr) {
            console.error('Error loading categories:', xhr.responseText);
        }
    });

    // 2️⃣ When user selects a category, fetch subcategories
    statusSelect.on('change', function () {
        const selectedCategory = $(this).val();

        // Clear old subcategories
        requestTypeSelect.find('option:not(:first)').remove();

        if (!selectedCategory) return;

        $.ajax({
            url: '../php/incoming_request_php/fetch_sub_categories.php',
            method: 'GET',
            data: { category_code: selectedCategory },
            dataType: 'json',
            success: function (subcategories) {
                console.log(subcategories)
                subcategories.forEach(sub => {
                    requestTypeSelect.append(
                        `<option value="${sub}">${sub}</option>`
                    );
                });
            },
            error: function (xhr) {
                console.error('Error loading subcategories:', xhr.responseText);
            }
        });
    });

    $('#technician-select').select2({
        placeholder: "Select EFMS Technician",
        allowClear: true,
    });

    $(document).on('click', '.toggle-techs', function () {
        $(this).siblings('.tech-list').slideToggle(150);
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
    dataTable_incoming_request()
    fetchNotifValue()
    _init()

    // Set interval to fetch data every 10 seconds
    // setInterval(function() {
    //     dataTable_incoming_request();
    // }, 10000); // 10 seconds (10000ms)


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

        $('.modal-title').text("User & Job Order Details")
        $('#user-what').text("Requester")
        $('.assessment-section').css('display' , 'flex')
        $('.tech-assessment-section').css('display' , 'none')
        $('#start-assess-btn').text("Start Job")
        // hide the immeditiate assess button
        $('#start-assess-btn').css('display' , 'block')
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
    

    $(document).off('click', '.request-action-button-myJob').on('click', '.request-action-button-myJob', function() {
        const index = $('.request-action-button-myJob').index(this);     
        const data = fetch_techMyJob[index];
        clicked_requestNo_myJob = data.requestNo
        console.log(fetch_techMyJob) 
 
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);

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
        $('#request-sub-type').text(data.requestSubCategory);
    
        $('#request-description').text(data.requestDescription);
        // $('#user-exactLocation').text(data.requestBy.exact_location);
        // Populate signature section dynamically

        $('#signature-tech-name').text(data.assignTo ? data.assignTo : data.processedBy);
        $('#signature-user-name').text(data.requestBy.name);


        $('.modal-title').text("Job Order Technician Assessment Details || " + clicked_sub_nav)
        // $('#user-what').text("Technician")
        $('.assessment-section').css('display' , 'none')
        $('.tech-assessment-section').css('display' , 'flex')
        $('.tech-remarks-textarea').val("")
        $('.tech-remarks-textarea').attr('placeholder', 'Enter remarks details. Input at least 10 characters...')
        $('#start-assess-btn').text("Finish Job")

        if($('.tech-remarks-textarea').val().length >= 10){
            $('#start-assess-btn').css('opacity' , '1')
            $('#start-assess-btn').css('pointer-events' , 'auto')
        }else{
            $('#start-assess-btn').css('opacity' , '0.5')
            $('#start-assess-btn').css('pointer-events' , 'none')
        }

        $('#tech-name-i').text((data.assignTo ? data.assignTo : data.processedBy))
        $('#reception-date-i').text(data.requestStartDate)
        $('#rtr-assess-btn').css('display' , 'flex')
        $('#start-assess-btn').css('display' , 'flex')

        if(clicked_sub_nav === "Evaluation"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('opacity' , '0.7')
            $('#start-assess-btn').css('pointer-events' , 'none')
            $('#start-assess-btn').text("Waiting for User's Evaluation...")
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "Correction"){
            $('.tech-remarks-textarea').val(data.requestCorrection)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "Pending Materials"){
            console.log(data)
            $('.tech-remarks-textarea').val(data.requestPendingMaterials)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "For Schedule"){
            $('.tech-remarks-textarea').val(data.requestForSched)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "Completed"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')

        }

        $.ajax({
            url: '../php/incoming_request_php/fetch_account_photo.php',
            method: "POST",
            data: {bioID : data.requestBy.bioID},
            success: function(response) {
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

    $(document).off('click', '.request-print-button-myJob').on('click', '.request-print-button-myJob', function() {
        const index = $('.request-print-button-myJob').index(this);     
        const data = fetch_techMyJob[index];
        clicked_requestNo_myJob = data.requestNo
        console.log(fetch_techMyJob) 
 
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);

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
         $('#request-sub-type').text(data.requestSubCategory);

        $('#request-description').text(data.requestDescription);
        // $('#user-exactLocation').text(data.requestBy.exact_location);
        // Populate signature section dynamically
        console.log(data)
        
        $('.modal-title').text("Job Order Technician Assessment Details || " + clicked_sub_nav)
        // $('#user-what').text("Technician")
        $('.assessment-section').css('display' , 'none')
        $('.tech-assessment-section').css('display' , 'flex')
        $('.tech-remarks-textarea').val("")
        $('.tech-remarks-textarea').attr('placeholder', 'Enter remarks details. Input at least 10 characters...')
        $('#start-assess-btn').text("Finish Job")

        if($('.tech-remarks-textarea').val().length >= 10){
            $('#start-assess-btn').css('opacity' , '1')
            $('#start-assess-btn').css('pointer-events' , 'auto')
        }else{
            $('#start-assess-btn').css('opacity' , '0.5')
            $('#start-assess-btn').css('pointer-events' , 'none')
        }

        $('#tech-name-i').text((data.assignTo ? data.assignTo : data.processedBy))
        $('#reception-date-i').text(data.requestStartDate)
        $('#rtr-assess-btn').css('display' , 'flex')
        $('#start-assess-btn').css('display' , 'flex')

        if(clicked_sub_nav === "Evaluation"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('opacity' , '0.7')
            $('#start-assess-btn').css('pointer-events' , 'none')
            $('#start-assess-btn').text("Waiting for User's Evaluation...")
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "Correction"){
            $('.tech-remarks-textarea').val(data.requestCorrection)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')

        }

        else if(clicked_sub_nav === "Completed"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "Pending Materials"){
            $('.tech-remarks-textarea').val(data.requestPendingMaterials)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "For Schedule"){
            $('.tech-remarks-textarea').val(data.requestForSched)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')
        }

        $.ajax({
            url: '../php/incoming_request_php/fetch_position_myJobs.php',
            method: "POST",
            data: {
                user_bioID : data.requestBy.bioID,
                tech_bioID : data.assignToBioID ? data.assignToBioID : data.processedByID
            },
            dataType : 'json',
            success: function(response) {
                console.log(response)
                try { 
                    $('#signature-tech-position').text(response.tech_position);
                    $('#signature-tech-name').text(data.assignTo ? data.assignTo : data.processedBy);
                    $('#signature-tech-bioID').text(data.assignToBioID ? data.assignToBioID : data.processedByID);
                    
                    $('#signature-user-position').text(response.user_position);
                    $('#signature-user-name').text(data.requestBy.name);
                    $('#signature-user-bioID').text(data.requestBy.bioID);

                    $('#assign-by-details-txt').text(data.assignBy)
                    // $('#assign-to-details-txt').text(data.assignTo)
                    // Assuming 'data' contains the job info including 'assignedTechs'
                    let assignedTechs = data.assignedTechs || [];

                    // Create a string of all technician names, separated by commas
                    let techNames = assignedTechs.map(t => t.name).join(', ');

                    // Set it as the text of the element
                    $('#assign-to-details-txt').text(techNames);

                    $('#target-start-datetime-details').text(data.assignTargetStartDate)
                    $('#target-end-datetime-details').text(data.assignTargetEndDate)

                    if(clicked_sub_nav === "Evaluation" || clicked_sub_nav === "Completed"){
                        console.log($('.tech-remarks-textarea'))
                        $('.tech-remarks-textarea').text(data.requestJobRemarks);
                    }else{
                        $('.tech-remarks-textarea').text(data.requestForSched ? data.requestForSched : data.requestPendingMaterials);
                    }
                    printRequestForm();

                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });

        // $.ajax({
        //     url: '../php/incoming_request_php/fetch_account_photo.php',
        //     method: "POST",
        //     data: {bioID : data.requestBy.bioID},
        //     success: function(response) {
        //         const base64Data = (response.photo || "").trim();
        //         const $userImage = $('#user-image');
        //         $userImage.css('background-image', `url('data:image/bmp;base64,${base64Data}')`);
        //         $userImage.removeClass('fa-solid fa-user');
        //     },

        //     error: function(xhr, status, error) {
        //         console.error("AJAX request failed:", error);
        //     }
        // });
    });


    // requestCompletedDate
    $(document).off('click', '#start-assess-btn').on('click', '#start-assess-btn', function() {     
        console.log()
        if($('#start-assess-btn').text() === 'Start Job'){
            console.log(data = {
                requestNo : clicked_requestNo,
                assignTo : null,
                assignToBioID : null,
                assignStartDate : null,
                assignEndDate : null,
            })
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toOnProcess_req.php',
                    method: "POST",
                    data: {
                        requestNo : clicked_requestNo,
                        assignTo : null,
                        assignToBioID : 0,
                        assignStartDate : null,
                        assignEndDate : null,
                        
                    },
                    success: function(response) {
                        try { 
                            console.log(response)
                            dataTable_incoming_request()
                            fetchNotifValue()
                            request_modal.hide()
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
        }
        else  if($('#start-assess-btn').text() === 'Finish Job'){
            console.log(clicked_requestNo_myJob)
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toEvaluation_req.php',
                    method: "POST",
                    data: {
                        requestNo: clicked_requestNo_myJob,
                        requestJobRemarks: $('.tech-remarks-textarea').val()
                    },
                    dataType: "json",
                    success: function(response) {
                        try { 
                            // Update table and modal
                            dataTable_my_jobs("On-Process");
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

        }
        else  if($('#start-assess-btn').text() === 'Send'){
            console.log('here')
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toCorrection_req.php',
                    method: "POST",
                    data: {
                        requestNo : clicked_requestNo,
                        requestJobRemarks : $('.assessment-textarea').val()
                    },
                    success: function(response) {
                        try { 
                            dataTable_incoming_request()
                            request_modal.hide()
                            fetchNotifValue()
                            
                            console.log(response)
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
        }

        else  if($('#start-assess-btn').text() === 'Mark as Pending'){
            console.log('here')
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_pendingMaterials.php',
                    method: "POST",
                    data: {
                        requestNo : clicked_requestNo,
                        requestJobRemarks : $('.assessment-textarea').val()
                    },
                    success: function(response) {
                        try { 
                            dataTable_incoming_request()
                            request_modal.hide()
                            fetchNotifValue()
                            
                            console.log(response)
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
        }

        else  if($('#start-assess-btn').text() === 'Set Schedule'){
            console.log('here')
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_forSchedule.php',
                    method: "POST",
                    data: {
                        requestNo : clicked_requestNo,
                        requestJobRemarks : $('.assessment-textarea').val()
                    },
                    success: function(response) {
                        try { 
                            dataTable_incoming_request()
                            request_modal.hide()
                            fetchNotifValue()
                            
                            console.log(response)
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
        }
        
        // else  if($('#start-assess-btn').text() === 'Assign Now'){
        //     let selectedTechs = $("#assign-tech-select option:selected").map(function () {
        //         return {
        //             name: $(this).val(),
        //             bioID: $(this).data("techbioid")
        //         };
        //     }).get();
            
        //     try {
        //         // console.log(
        //         //     {
        //         //         requestNo : clicked_requestNo,
        //         //         assignToBioID : $('#assign-tech-select option:selected').data('techbioid'),
        //         //         assignStartDate : $('#target-start-datetime').val(),
        //         //         assignEndDate : $('#target-start-datetime').val(),
        //         //     }
        //         // )

        //         console.log(
        //             data = {
        //                 requestNo : clicked_requestNo,
        //                 assignTo : $('#assign-tech-select').val(),
        //                 assignDescription: $('#assign-to-modal-tech-remarks').val(),
        //                 assignToBioID : $('#assign-tech-select option:selected').data('techbioid'),
        //                 assignStartDate : convertDate($('#target-start-datetime').val()),
        //                 assignEndDate : convertDate($('#target-end-datetime').val()),
        //             }
        //         )

        //         // $.ajax({
        //         //     url: '../php/incoming_request_php/edit_toAssignedJobs.php',
        //         //     method: "POST",
        //         //     data: {
        //         //         requestNo : clicked_requestNo,
        //         //         assignTo : $('#assign-tech-select').val(),
        //         //         assignDescription: $('#assign-to-modal-tech-remarks').val(),

        //         //         assignToBioID : $('#assign-tech-select option:selected').data('techbioid'),
        //         //         assignStartDate : convertDate($('#target-start-datetime').val()),
        //         //         assignEndDate : convertDate($('#target-end-datetime').val()),
        //         //     },
        //         //     success: function(response) {
        //         //         try { 
        //         //             console.log(response)
        //         //             dataTable_incoming_request()
        //         //             fetchNotifValue()
        //         //             request_modal.hide()
        //         //         } catch (innerError) {
        //         //             console.error("Error processing response:", innerError);
        //         //         }
        //         //     },
        //         //     error: function(xhr, status, error) {
        //         //         console.error("AJAX request failed:", error);
        //         //     }
        //         // });
        //     } catch (ajaxError) {
        //         console.error("Unexpected error occurred:", ajaxError);
        //     }
        // }

        // else if ($('#start-assess-btn').text() === 'Assign Now') {

        //     // Collect all selected technicians
        //     let selectedTechs = $("#assign-tech-select option:selected").map(function () {

        //         return {
        //             name: $(this).val(),                   // FULL NAME is in value=""
        //             bioID: $(this).data("techbioid")
        //         };
        //     }).get();

        //     if (selectedTechs.length === 0) {
        //         alert("Please select at least 1 technician.");
        //         return;
        //     }

        //     let postData = {
        //         requestNo: clicked_requestNo,
        //         assignDescription: $('#assign-to-modal-tech-remarks').val(),

        //         // FIRST technician is stored in old columns
        //         assignTo: selectedTechs[0].name,           
        //         assignToBioID: selectedTechs[0].bioID,

        //         assignStartDate: convertDate($('#target-start-datetime').val()),
        //         assignEndDate: convertDate($('#target-end-datetime').val()),

        //         // Send ALL techs for your new table
        //         technicians: JSON.stringify(selectedTechs)
        //     };

        //     console.log(postData);

        //     $.ajax({
        //         url: '../php/incoming_request_php/edit_toAssignedJobs.php',
        //         method: "POST",
        //         data: postData,
        //         success: function (response) {
        //             console.log(response);
        //             dataTable_incoming_request();
        //             fetchNotifValue();
        //             request_modal.hide();
        //         },
        //         error: function (xhr, status, error) {
        //             console.error("AJAX request failed:", error);
        //         }
        //     });
        // }

        else if ($('#start-assess-btn').text() === 'Assign Now') {

            // Validate fields
            let assignDesc = $('#assign-to-modal-tech-remarks').val().trim();
            let startDate = $('#target-start-datetime').val().trim();
            let endDate   = $('#target-end-datetime').val().trim();

            if (!assignDesc || !startDate || !endDate) {
                alert("Please fill in all required fields: description, start date, and end date.");
                return;
            }

            // Convert start date to JS Date object
            let startDateObj = new Date(startDate);
            let now = new Date();
            let minAllowed = new Date(now.getTime() + 2 * 60 * 1000); // now + 2 minutes

            if (startDateObj < minAllowed) {
                alert("The start date/time must be at least 2 minutes from now.");
                return;
            }

            // Collect all selected technicians
            let selectedTechs = $("#assign-tech-select option:selected").map(function () {
                return {
                    name: $(this).val(),       // FULL NAME is in value=""
                    bioID: $(this).data("techbioid")
                };
            }).get();

            if (selectedTechs.length === 0) {
                alert("Please select at least 1 technician.");
                return;
            }

            let postData = {
                requestNo: clicked_requestNo,
                assignDescription: assignDesc,

                // FIRST technician is stored in old columns
                assignTo: selectedTechs[0].name,
                assignToBioID: selectedTechs[0].bioID,

                assignStartDate: convertDate(startDate),
                assignEndDate: convertDate(endDate),

                // Send ALL techs for your new table
                technicians: JSON.stringify(selectedTechs)
            };

            console.log(postData);

            $.ajax({
                url: '../php/incoming_request_php/edit_toAssignedJobs.php',
                method: "POST",
                data: postData,
                success: function (response) {
                    console.log(response);
                    dataTable_incoming_request();
                    fetchNotifValue();
                    request_modal.hide();
                },
                error: function (xhr, status, error) {
                    console.error("AJAX request failed:", error);
                }
            });
        }




    })   

    // assign-assess-btn
    if ($('#assign-assess-btn').length) {
        $(document).off('click', '#assign-assess-btn').on('click', '#assign-assess-btn', function() {
            // assign_modal.show();
            console.log(clicked_requestNo)

            $.ajax({
                url: '../php/incoming_request_php/fetch_assign_technicians.php',
                method: "POST",
                data: {requetNo : clicked_requestNo},
                dataType: "json",
                success: function(response) {
                    response.sort((a, b) => a.lastName.localeCompare(b.lastName));
                    try { 
                        const $select = $('#assign-tech-select');
                        $select.empty(); // Clear existing options

                        // Add default option
                        $select.append('<option value="">Select Technician</option>');

                        // Loop through the technician list
                        response.forEach(function(tech) {
                            const fullName = `${tech.firstName} ${tech.middle} ${tech.lastName}`;
                            $select.append(`<option value="${fullName}" data-techBioID="${tech.techBioID}">${fullName} - ${tech.techBioID}</option>`);
                        });
                    } catch (innerError) {
                        console.error("Error processing response:", innerError);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX request failed:", error);
                }
            });

            $('.assign-to-div').css('display', 'block');
            // $('#assign-to-div').toggle()

            // change its class
            $('#assign-assess-btn').css('display', 'none');
            $('#cancel-assign-assess-btn').css('display', 'flex');

            $('#start-assess-btn').text("Assign Now")

            // $('#assign-assess-btn').text('Submit Assignment');
        });

         $(document).off('click', '#cancel-assign-assess-btn').on('click', '#cancel-assign-assess-btn', function() {
            $('#assign-assess-btn').css('display', 'flex');
            $('#cancel-assign-assess-btn').css('display', 'none');

            $('.assign-to-div')?.css('display', 'none');


            $('#assign-assess-btn').text('Assign To');

            $('#start-assess-btn').text("Start Job")

         })
    }

    // $(document).off('click', '#your-job-btn').on('click', '#your-job-btn', function() {
    //     dataTable_my_jobs("On-Process")

    //     $('#your-job-btn').css('opacity' , '1')
    //     $('#request-list-btn').css('opacity' , '0.5')

    //     $('.sub-table-nav').css('display' , 'flex')

    //     // reset the css for the sub buttons
    //     $("#for-evaluation-sub-btn, #on-process-sub-btn, #completed-sub-btn").css({
    //         "opacity": "0.5",
    //         "background": "none",
    //         "color": "white"
    //     });
    //     // Highlight the "On-Process" button
    //     $("#on-process-sub-btn").css({
    //         "opacity": "1",
    //         "background": "white",
    //         "color": "black"
    //     });
    // })     

    $('#your-job-btn').on('click', function () {
        const $container = $('.my-job-order-div');
        const $subBtns = $('#your-job-sub-btns');

        let winHeight = $(window).height();
        let winWidth = $(window).width();

        console.log("Height: " + winHeight, "Width: " + winWidth);

        if (winHeight <= 800) {
            console.log('here')
            $('body .right-container .table-div .table-container').css({
                width: '100%',
                height: '400px',
                'overflow-y': 'scroll',
                'overflow-x': 'hidden',
            });
        }

        $('#your-job-btn').css('opacity', '1');
        $('#request-list-btn').css('opacity', '0.5');

        // Remove active class from all sub buttons
        $(".your-job-sub-btn").removeClass("active");

        // Add active to "On-Process" button
        $("#your-job-assigned-btn").addClass("active");


        // Reset the sub-table navigation display
        $('.search-div').css('display', 'block');
        $('.table-div').css('height', '70%');

        $container.toggleClass('active');
        $subBtns.toggleClass('show');

        dataTable_my_jobs("Assigned");
    });


    $('#your-job-close-btn').on('click', function () {
        const $container = $('.my-job-order-div');
        const $subBtns = $('#your-job-sub-btns');

        $container.removeClass('active');
        $subBtns.removeClass('show');
    });
    
    $(document).off('click', '#request-list-btn').on('click', '#request-list-btn', function() {
        dataTable_incoming_request()

        let winHeight = $(window).height();
        let winWidth = $(window).width();

        console.log("Height: " + winHeight, "Width: " + winWidth);

        if (winHeight <= 800) {
            console.log('here')
            $('body .right-container .table-div .table-container').css({
                width: '100%',
                height: '',
                'overflow-y': 'scroll',
                'overflow-x': 'hidden',
            });
        }

        $('#your-job-btn').css('opacity' , '0.5')
        $('#request-list-btn').css('opacity' , '1')

        $('.sub-table-nav').css('display' , 'none')

        const $container = $('.my-job-order-div');
        const $subBtns = $('#your-job-sub-btns');

        // Reset the sub-table navigation display
        $('.search-div').css('display', 'none');
        $('.table-div').css('height', '90%');

        // $('#assign-assess-btn')?.toggleClass('d-none', false);
        // $('#cancel-assign-assess-btn')?.toggleClass('d-none', true);
        // $('#assign-to-div')?.toggleClass('d-none', true);
        
        $('#assign-assess-btn').css('display', 'block');
        $('.assign-to-div').css('display', 'none');

        $container.removeClass('active');
        $subBtns.removeClass('show');

        clicked_sub_nav = ""
    })  

    $(document).off("click", "#your-job-on-process-btn, #your-job-for-evaluation-btn, #your-job-completed-btn, #your-job-correction-btn, #your-job-assigned-btn ,#your-job-pending-material-btn, #your-job-for-schedule-btn").on("click", "#your-job-on-process-btn, #your-job-for-evaluation-btn, #your-job-completed-btn, #your-job-correction-btn, #your-job-assigned-btn , #your-job-pending-material-btn, #your-job-for-schedule-btn", function () {
        console.log('here')
        let status = { 
            "your-job-for-evaluation-btn": "Evaluation",
            "your-job-on-process-btn": "On-Process",
            "your-job-assigned-btn": "Assigned",
            "your-job-completed-btn": "Completed",
            "your-job-correction-btn": "Correction",
            "your-job-pending-material-btn": "Pending Materials",
            "your-job-for-schedule-btn": "For Schedule",

        }[this.id];
    
        dataTable_my_jobs(status);
        clicked_sub_nav = status
    
        // Reset all buttons
        $(".your-job-sub-btn").removeClass("active");
    
        // Highlight the clicked button
        $(this).addClass("active");
    });

    $('.tech-remarks-textarea').on('input', function() {
        if ($(this).val().length >= 10) {
            $('#start-assess-btn').css({
                'opacity': '1',
                'pointer-events': 'auto'
            });
        } else {
            $('#start-assess-btn').css({
                'opacity': '0.5',
                'pointer-events': 'none'
            });
        }
    });

    $(document).on('click', '.interval-toggle', function() {
        const intervalText = $(this).siblings('.recept-interval');
        intervalText.toggleClass('show');
        $(this).toggleClass('active');
    });

    $(document).on('click', '.interval-complete-toggle', function() {
        console.log('here')
        const intervalText = $(this).siblings('.complete-interval');
        intervalText.toggleClass('show');
        $(this).toggleClass('active');
    });

    $(document).on('click', '#search-btn', function() {
        // Re-run the datatable with filters applied
        dataTable_my_jobs(clicked_sub_nav);
    });

    // $('.search-div input, .search-div select').on('change keyup', function() {
    //     // Optional debounce can be added
    //     dataTable_my_jobs(clicked_sub_nav);
    // });
})