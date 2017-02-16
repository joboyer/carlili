<?php

include 'connect.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);



$con = mysqli_connect($HOST, $NAME, $PASS, $DB);
$result = mysqli_query($con, "select * from users where login = '".$request->email."' AND pwd = '".$request->pass."';");

$users = array();
$i = 0;
$users[$i] = null;
while($row = mysqli_fetch_assoc($result))
{
    $user[$i] = $row;
    $i++;
}

echo json_encode($user);
    
?>
