<?php
header("Access-Control-Allow-Origin: *");


$host = "localhost";
$user = "jordan77";
$pass = "yomanp34c3";
$db = "Carlili";

$conn = new mysqli($host, $user, $pass, $carlili);

$result = $conn->query("SELECT login, pwd  FROM users");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"login":"'  . $rs["login"] . '",';
    $outp .= '"pwd":"'   . $rs["pwd"]        . '",';
}
$outp ='{"records":['.$outp.']}';
$conn->close();

$objData = json_decode($outp);
echo($outp);
?>