$(document).ready(function(){

    // Common click handler for all buttons
    $(document).off('click', '.tech-btns button').on('click', '.tech-btns button', function() {
        const id = $(this).attr('id');

        // Reset all buttons’ opacity
        $('.tech-btns button').css('opacity', '0.5');

        // Highlight the active one
        $(this).css('opacity', '1');

        // Default UI resets
        $('#start-assess-btn').css({ 'pointer-events': 'none', 'opacity': '0.5' });
        $('#assign-assess-btn, .assign-to-div, #cancel-assign-assess-btn').css('display', 'none');

        // Handle each button's unique behavior
        switch (id) {
            case 'diagnosis-btn':
                $('.assessment-textarea').attr('placeholder', 'Enter diagnosis details...');
                $('#start-assess-btn').text("Start Job");
                $('#start-assess-btn').css({ 'pointer-events': 'auto', 'opacity': '1' });
                $('#assign-assess-btn').toggleClass('d-none', false).css('display', 'block');
                $('.assign-to-div').toggleClass('d-none', false).css('display', 'none');
                break;

            case 'correction-btn':
                $('.assessment-textarea').attr('placeholder', 'Enter correction details...');
                $('#start-assess-btn').text("Send");
                // start button disabled for correction
                $('#start-assess-btn').css({ 'pointer-events': 'none', 'opacity': '0.5' });
                $('#assign-assess-btn, .assign-to-div, #cancel-assign-assess-btn').css('display', 'none');
                break;

            case 'pending-material-btn':
                $('.assessment-textarea').attr('placeholder', 'Enter pending materials details...');
                $('#start-assess-btn').text("Mark as Pending");
                $('#start-assess-btn').css({ 'pointer-events': 'auto', 'opacity': '1' });
                break;

            case 'for-schedule-btn':
                $('.assessment-textarea').attr('placeholder', 'Enter scheduling details...');
                $('#start-assess-btn').text("Set Schedule");
                $('#start-assess-btn').css({ 'pointer-events': 'auto', 'opacity': '1' });
                break;

            default:
                console.warn("Unhandled button ID:", id);
                break;
        }
    });


    let divisionSelect = document.getElementById("division-select");
    let sectionSelect = document.getElementById("section-select");

    // Clear the section dropdown initially
    sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';

    // Listen for changes in the division select dropdown
    divisionSelect.addEventListener("change", function () {
        let selectedDivisionID = parseInt(this.value); // Get the selected PGSDivisionID
        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>'; // Reset section dropdown

        // Filter sections where the 'division' field (PGSDivisionID) matches
        let filteredSections = section_data.filter(section => parseInt(section.division) === selectedDivisionID);

        // Populate the section dropdown with matching sections
        filteredSections.forEach(section => {
            let option = document.createElement("option");
            option.value = section.sectionName;
            option.textContent = section.sectionName;
            sectionSelect.appendChild(option);
        });
    });

    $('.assessment-textarea').on('input', function() {
        console.log('here')
        if ($(this).val().length > 5) {
            $('#start-assess-btn').css('pointer-events', 'auto');
            $('#start-assess-btn').css('opacity', '1');
        } else {
            $('#start-assess-btn').css('pointer-events', 'none');
            $('#start-assess-btn').css('opacity', '0.5');
        }
    })

    
})

