$(document).ready(function(){
    let adminTable;
    fetch_dataTable();

    $('#addAdminModal').on('show.bs.modal', function() {
        const select = $('#techBioID');
        select.empty().append('<option value="">Select Technician</option>');

        $.ajax({
            url: '../php/admin_management_php/fetch_technicians.php',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.error) {
                    console.error(response.error);
                    return;
                }

                if (response.length === 0) {
                    select.append('<option disabled>No available technicians</option>');
                    return;
                }

                response.forEach(function(tech) {
                    const name = `${tech.lastName.toUpperCase()}, ${tech.firstName.toUpperCase()} ${tech.middle ? tech.middle.charAt(0).toUpperCase() + '.' : ''}`;
                    const details = `(${tech.techCategory} - ${tech.employmentStatus})`;
                    select.append(`<option value="${tech.techBioID}">${name} ${details}</option>`);
                });
            },
            error: function(xhr, status, error) {
                console.error("Error loading technicians:", error);
            }
        });
    });

    // Handle Add Admin form submission
    $('#addAdminForm').on('submit', function(e) {
        e.preventDefault();

        const formData = {
            techBioID: $('#techBioID').val(),
            role: $('#role').val(),
            category: $('#category').val()
        };

        if (!formData.techBioID || !formData.role) {
            alert('Please select both technician and role.');
            return;
        }

        // Validate category when required
        if ((formData.role === 'unit_admin' || formData.role === 'unit_semi_admin') && !formData.category) {
            alert('Please select a category for Unit Admin or Unit Semi Admin.');
            return;
        }

        console.table(formData)

        $.ajax({
            url: '../php/admin_management_php/add_admin.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    $('#addAdminModal').modal('hide');
                    $('#addAdminForm')[0].reset();
                    $('#categoryDiv').hide();
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    fetch_dataTable();
                } else {
                    alert(response.message || 'Failed to add admin.');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error adding admin:", error);
                alert('An error occurred while adding admin.');
            }
        });
    });

    // Toggle category field visibility based on selected role
    $('#role').on('change', function() {
        const selectedRole = $(this).val();

        if (selectedRole === 'unit_admin' || selectedRole === 'unit_semi_admin') {
            $('#categoryDiv').show();
            $('#category').attr('required', true);
        } else {
            $('#categoryDiv').hide();
            $('#category').removeAttr('required');
            $('#category').val('');
        }
    });

    $(document).on('click', '.edit-admin-btn', function() {
        const techBioID = $(this).data('id');
        console.log(techBioID)
        $.ajax({
            url: '../php/admin_management_php/get_admin_details.php',
            method: 'GET',
            data: { techBioID },
            dataType: 'json',
            success: function(response) {
                console.log(response)
                if (response.success) {
                    const data = response.data;
                    $('#editTechBioID').val(data.techBioID);
                    $('#editRole').val(data.role);

                    if (data.role === "unit_semi_admin") {
                        $('#editCategoryDiv').show();
                        $('#editCategory').val(data.techCategory);
                    } else {
                        $('#editCategoryDiv').hide();
                    }

                    $('#editAdminModal').modal('show');
                } else {
                    alert('Failed to fetch admin details.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching details:', error);
            }
        });
    });

    $('#editRole').on('change', function() {
        if ($(this).val() === 'admin') {
            $('#editCategoryDiv').show();
        } else {
            $('#editCategoryDiv').hide();
        }
    });

    $('#editAdminForm').on('submit', function(e) {
        e.preventDefault();

        const formData = {
            techBioID: $('#editTechBioID').val(),
            role: $('#editRole').val(),
            category: $('#editCategory').val()
        };

        $.ajax({
            url: '../php/admin_management_php/update_admin.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Admin updated successfully!');
                    $('#editAdminModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    fetch_dataTable();
                } else {
                    alert(response.message || 'Failed to update admin.');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error updating admin:", error);
            }
        });
    });

    $(document).on('click', '.delete-admin-btn', function() {
        const techBioID = $(this).data('id');

        if (!confirm('Are you sure you want to delete this admin?')) return;
        console.log(techBioID)

        $.ajax({
            url: '../php/admin_management_php/delete_admin.php',
            method: 'POST',
            data: { techBioID },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Admin deleted successfully!');
                    fetch_dataTable();
                } else {
                    alert(response.message || 'Failed to delete admin.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error deleting admin:', error);
            }
        });
    });


});

var fetch_dataTable = () => {
    $.ajax({
        url: '../php/admin_management_php/fetch_admins.php',
        method: "GET",
        dataType: "json",
        success: function(response) {
            console.log(response);

            if ($.fn.DataTable.isDataTable('#admin-dataTable')) {
                $('#admin-dataTable').DataTable().destroy();
                $('#admin-dataTable tbody').empty();
            }

            adminTable = $('#admin-dataTable').DataTable({
                data: response,
                columns: [
                    { data: 'adminID', title: 'ID' },
                    { data: 'fullName', title: 'Full Name' },
                    { data: 'employmentStatus', title: 'Employment Status' },
                    { data: 'techCategory', title: 'Category' },
                    { data: 'role', title: 'Role' },
                    {
                        data: null,
                        title: 'Action',
                        render: function(data) {
                            return `
                                <div class="action-admin-div">
                                    <button class="btn btn-sm btn-warning edit-admin-btn" data-id="${data.adminID}">Edit</button>
                                    <button class="btn btn-sm btn-danger delete-admin-btn" data-id="${data.adminID}">Delete</button>
                                </div>
                            `;
                        }
                    }
                ],
                columnDefs: [
                    { targets: 0, createdCell: td => $(td).addClass('admin-id-td') },
                    { targets: 1, createdCell: td => $(td).addClass('admin-name-td') },
                    { targets: 2, createdCell: td => $(td).addClass('admin-status-td') },
                    { targets: 3, createdCell: td => $(td).addClass('admin-category-td') },
                    { targets: 4, createdCell: td => $(td).addClass('admin-role-td') },
                    { targets: 5, createdCell: td => $(td).addClass('admin-action-td') }
                ],
                responsive: true,
                pageLength: 10
            });

            // Initialize filters after DataTable loads
            initAdminTableFilters();
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
};

// 🔍 Filtering logic
function initAdminTableFilters() {
    $('#filterCategory, #filterRole').off('change').on('change', function() {
        const category = $('#filterCategory').val();
        const role = $('#filterRole').val();

        // Column indexes based on your column order
        adminTable.column(3).search(category, true, false); // Category column
        adminTable.column(4).search(role, true, false);     // Role column
        adminTable.draw();
    });
}

