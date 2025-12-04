<?php
include('../session.php');
include('../assets/connection.php');

$webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";

if (isset($_POST["username"]) && isset($_POST["password"]) && trim($_POST["username"]) != "" && $_POST["password"] != "") {
    $biousername = $_POST["username"];
    $password = $_POST["password"];
    $param = array("bioUserName" => $biousername, "password" => $password, "accessMode" => 0);
    
    $soap = new SOAPClient($webservice);
    $result = $soap->AuthenticateEmployee($param)->AuthenticateEmployeeResult;

    $code = $result->Code;
    $canAccess = $result->CanAccess;
    $errorMessage = $result->Message;
    $userType = $result->UserType;


    if ($canAccess == 1) {
        if (isset($result->Account)) {
            $account = $result->Account;
            $name = $account->FirstName . " " . substr($account->MiddleName, 0, 1) . ". " . $account->LastName;

            $_SESSION["user"] = $account->BiometricID;          
            $_SESSION["name"] = $account->FullName;
            $_SESSION["section"] = $account->Section;
            $_SESSION["positionName"] = $account->PositionName;
            $_SESSION["sectionName"] = "";
            $_SESSION["divisionName"] = "";
            $_SESSION["division"] = $account->Division; 
            $_SESSION["password"] = $password;     
            $_SESSION["Authorized"] = "Yes";
            $_SESSION["role"] = "";

            try {
                // Fetch Section Name
                $sql = "SELECT sectionName FROM pgssection WHERE sectionID=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$_SESSION['section']]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($data) {
                    $_SESSION["sectionName"] = $data['sectionName'];
                }

                // Fetch Division Name
                $sql = "SELECT PGSDivisionName FROM pgsdivision WHERE PGSDivisionID=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$_SESSION['division']]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($data) {
                    $_SESSION["divisionName"] = $data['PGSDivisionName'];
                }

            } catch (PDOException $e) {
                die("Database error: " . $e->getMessage());
            }

            // 🔍 Fetch user role dynamically
            try {
                $sql = "SELECT role FROM efms_technicians WHERE techBioID = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$_SESSION["user"]]);
                $tech = $stmt->fetch(PDO::FETCH_ASSOC);
                $role = $tech ? $tech['role'] : null;
            } catch (PDOException $e) {
                die("Database error: " . $e->getMessage());
            }

            // 🔐 Role-based session and redirection
            if ($role === 'super_admin') {
                $_SESSION["role"] = 'super_admin';
                echo "/views/home.php";

            } 
            
            else if ($role === 'unit_admin') {
                $_SESSION["role"] = 'unit_admin';
                echo "/views/home.php";

            } 
            else if ($role === 'unit_semi_admin') {
                $_SESSION["role"] = 'unit_semi_admin';
                echo "/views/home.php";

            } 
            else if ($_SESSION['section'] == 23) { 
                // Technicians from section 23
                $_SESSION["role"] = 'tech';
                echo "/views/home.php";

            } else {
                // Default user
                $_SESSION["role"] = "user";
                echo "/views/job_order.php";
            }
        }
    }
    else {
        echo "invalid";
    }

}
else {
    echo "invalid";
}


?>