<?php 
    $webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";
    $biousername = $_POST['bioID'];

    $param = array("bioID" => $_POST['bioID']);
    
    try {
        $soap = new SOAPClient($webservice);
        $result = $soap->GetEmployee($param)->GetEmployeeResult;
        $account_photo = $result->Photo;

        header('Content-Type: application/json');
        echo json_encode(['photo' => $account_photo]);

    } catch (Exception $e) {
        // Log error (optional)
        // error_log($e->getMessage());
        echo "error";
    }
?>