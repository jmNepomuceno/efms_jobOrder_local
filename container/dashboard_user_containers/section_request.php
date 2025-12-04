<div class="request-conent-div">
    <div class="double-date-div">
        <div class="start-date-div">
            <span id="start-date-span">Select Start Date: </span>
            <input id="start-date-input" type="date">
        </div>
        <div class="end-date-div">
            <span id="end-date-span">Select End Date: </span>
            <input id="end-date-input" type="date">
        </div>
        <div class="division-div">
            <select id="division-select">
                <option value="" selected>Select the Division</option>
                <option value="MET">MET</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
            </select>
        </div>

        <div class="section-div">
            <select id="section-select">
                <option value="" selected>Select the Section</option>
                <option value="MET">MET</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
            </select>
        </div>
        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Generate</button>

    </div>
    
    <h1>Requests Per Section: </h1>
    
    <div class="request-graph-div">
        <div class="total-request-div">
            <span>Total Request</span>
            <span id="total-request-value">0</span>
        </div>
        <div class="top-request-div">
            <span>Top Requestor</span>
            <span id="top-request-value">NICU</span>
        </div>
        <div id="requestCategory3DPie"></div>
    </div>
</div>