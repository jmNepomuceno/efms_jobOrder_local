<div class="request-conent-div">

    <div class="filter-category-div">
        <span>Filter Unit: </span>
        <button class="filter-category-active" id="all-filter-btn" data-category="ALL">ALL</button>
        <button id="iu-filter-btn" data-category="IU">INFRA / PLANNING</button>
        <button id="eu-filter-btn" data-category="EU">ELECTRICAL</button>
        <button id="mu-filter-btn" data-category="MU">MECHANICAL</button>
        <div class="vl"></div>
        <select id="sub-infra-select">
            <option value="">-- Select Sub Category --</option>

            <option value="IU">CARPENTRY WORKS</option>
            <option value="IU">FABRICATION</option>
            <option value="IU">MASONRY WORKS</option>
            <option value="IU">WELDING WORKS</option>
            <option value="IU">PAINTING WORKS</option>
            <option value="IU">PLUMBING WORKS</option>
            <option value="IU">ROOFING WORKS</option>
            <option value="IU">CONDEMN/ASSESSMENTS</option>

            <option value="EU">ELECTRICAL WORKS</option>
            <option value="EU">AIRCONDITIONING WORKS</option>
            <option value="EU">REFRIGERATION WORKS (NON MEDICAL)</option>

            <option value="MU">PREVENTIVE MAINTENANCE</option>
            <option value="MU">CALIBRATION</option>
            <option value="MU">REPAIR (MEDICAL & NON MEDICAL)</option>
            <option value="MU">CONDEMN/ASSESSMENT</option>
        </select>
    </div>

    <h1>Total Overall Requests</h1>

    <div class="request-graph-div">
        <canvas id="requestsPerHourChart" ></canvas>
        <div class="request-tally-div">
            <div class="total-request-div">
                <span>Total Request</span>
                <span id="total-request-value">0</span>
            </div>
            <div class="total-request-ot-div">
                <span>Total Overdue Request</span>
                <span id="total-request-ot-value">0</span>
            </div>
            <div class="total-request-cancel-div">
                <span>Total Cancelled Request</span>
                <span id="total-request-cancel-value">0</span>
            </div>
        </div>
    </div>
</div>