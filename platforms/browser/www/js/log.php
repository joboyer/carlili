<?php

    define("HOST", "localhost");
define("NAME", "jordan77");
define("PASS", "yomanp34c3");
define("DB", "Carlili");

$con = mysqli_connect(HOST, NAME, PASS, DB);
$result = mysqli_query($con, "select * from users");

$users = array();
while($row = mysqli_fetch_assoc($result))
{
    $user = $row;
}

echo json_encode($user);
    
?>