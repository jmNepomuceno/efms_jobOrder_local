<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $bioID = $_POST['user_bioID'] ?? null;
    $tech_bioID = $_POST['tech_bioID'] ?? null;

    $webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";
    $soap = new SOAPClient($webservice);

    function getPosition($soap, $bioID) {
        try {
            $param = ["bioID" => $bioID];
            $response = $soap->GetEmployee($param);

            // Check if the key exists
            if (isset($response->GetEmployeeResult)) {
                $emp = $response->GetEmployeeResult;

                // PositionName may be nested or direct
                if (isset($emp->PositionName)) {
                    return $emp->PositionName;
                }

                // If nested like GetEmployeeResult->Employee->PositionName
                if (isset($emp->Employee->PositionName)) {
                    return $emp->Employee->PositionName;
                }
            }
        } catch (Exception $e) {
            return null;
        }

        return null;
    }

    $user_position = getPosition($soap, $bioID);
    $tech_position = getPosition($soap, $tech_bioID);

    echo json_encode([
        "user_position" => $user_position,
        "tech_position" => $tech_position
    ]);


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
