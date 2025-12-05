<?php 
    include('./session.php');
    include('./assets/connection.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS-APP</title>
    <link rel="stylesheet" href="./index.css">

    <?php require "./links/header_link.php" ?>
</head>
<body>
    <div class="left-container">
        <div class="logo-imgs">
            <img src="./source/landing_img/DOH Logo.png" alt="">
            <img src="./source/landing_img/BGHMC logo hi-res.png" alt="">
            <img src="./source/landing_img/Bagong_Pilipinas_logo.png" alt="">
        </div>

        <div class="login-div steel-bronze-theme">
            <span>USER LOGIN</span>
            <div class="credential-div" id="username-div">
                <div class="credential-icon-div">
                    <i class="fa-solid fa-user"></i>
                </div>
                <input type="text" class="credential-inputs" id="username-txt" placeholder="Username" autocomplete="off">
            </div>

            <div class="credential-div" id="password-div">
                <div class="credential-icon-div">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <input type="password" class="credential-inputs" id="password-txt" placeholder="Password" autocomplete="off">
            </div>

            <h6 id="temp-h6">You can use your portal's account to login.</h6>
            <h6>No account yet? <a id="sign-up-a" href="http://192.168.42.245:8085/Default.aspx">Sign Up</a></h6>

            <button id="login-btn">LOGIN</button>
        </div>  
    </div>


    <div class="right-container">
        <img id="landing-img" src="./source/landing_img/efms-bg_2.jpg" alt="logo-img">

        <div class="title-div">
            <h1>ENGINEERING FACILITIES MANAGEMENT SECTION</h1>
            <h2>Job Order Request System</h2>
            <h2>LOCALLLLLLLL</h2>
        </div>
    </div>

    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Successfully Updated</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <?php require "./links/script_links.php" ?>
    <script type="text/javascript" src="./index.js?v=<?php echo time(); ?>"></script>
</body>
</html>