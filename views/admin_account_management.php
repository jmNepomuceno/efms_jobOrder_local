<?php 
    include('../session.php');
    include('../assets/connection.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/admin_account_management.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">
    <?php require "../links/header_link.php" ?>

    <title>Admin Account Management</title>
</head>
<body>

    <?php 
        $view = "admin-management-sub-div";
        $sub_view = "adminacc-admin-sub-down-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <div class="admin-account-container">
            <h3>EFMS Admin & Super Admin Accounts</h3>

            <!-- Add Admin Button -->
            <button class="btn btn-primary mb-3" id="openAddAdminModal" data-bs-toggle="modal" data-bs-target="#addAdminModal">
                <i class="bi bi-person-plus"></i> Add Admin
            </button>

            <!-- search -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="filterCategory" class="form-label fw-bold">Filter by Category</label>
                    <select id="filterCategory" class="form-select">
                        <option value="">All Categories</option>
                        <option value="MU">Mechanical Unit (MU)</option>
                        <option value="EU">Electrical Unit (EU)</option>
                        <option value="IU">Infra/Planning Unit (IU)</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="filterRole" class="form-label fw-bold">Filter by Role</label>
                    <select id="filterRole" class="form-select">
                        <option value="">All Roles</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Unit Admin">Unit Admin</option>
                        <option value="Unit Semi-Admin">Unit Semi-Admin</option>
                    </select>
                </div>
            </div>


            <!-- DataTable -->
            <table id="admin-dataTable" class="display table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Employment Status</th>
                        <th>Category</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <!-- Bootstrap Modal for Add Admin -->
    <div class="modal fade" id="addAdminModal" tabindex="-1" aria-labelledby="addAdminModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addAdminModalLabel">Add New Admin</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <form id="addAdminForm">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="techBioID" class="form-label">Technician</label>
                            <select id="techBioID" name="techBioID" class="form-select" required>
                                <option value="">Select Technician</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="role" class="form-label">Role</label>
                            <select id="role" name="role" class="form-select" required>
                                <option value="">Select Role</option>
                                <option value="unit_semi_admin">Unit Semi Admin</option>
                                <option value="unit_admin">Unit Admin</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>

                        <div class="mb-3" id="categoryDiv" style="display: none;">
                            <label for="category" class="form-label">Category</label>
                            <select id="category" name="category" class="form-select">
                                <option value="">Select Category</option>
                                <option value="MU">Mechanical Unit (MU)</option>
                                <option value="EU">Electrical Unit (EU)</option>
                                <option value="IU">Infra/Planning Unit (IU)</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


    <div class="modal fade" id="editAdminModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <form id="editAdminForm">
                    <div class="modal-header">
                    <h5 class="modal-title">Edit Admin</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                    <input type="hidden" id="editTechBioID">

                    <div class="mb-3">
                        <label for="editRole" class="form-label">Role</label>
                        <select id="editRole" class="form-select">
                        <option value="unit_semi_admin">Unit Semi Admin</option>
                        <option value="unit_admin">Unit Admin</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="tech">Technician</option>
                        </select>
                    </div>

                    <div class="mb-3" id="editCategoryDiv" style="display:none;">
                        <label for="editCategory" class="form-label">Category</label>
                        <select id="editCategory" class="form-select">
                        <option value="">Select Category</option>
                        <option value="IU">INFRA/PLANNING UNIT</option>
                        <option value="EU">ELECTRICAL UNIT</option>
                        <option value="MU">MECHANICAL UNIT</option>
                        </select>
                    </div>
                    </div>

                    <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


    <?php require "../links/script_links.php" ?>
    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/admin_management_js/admin_account_management.js?php echo time(); ?>"></script>

</body>
</html>
