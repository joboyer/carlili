<?php

include 'connect.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);


$con = mysqli_connect($HOST, $NAME, $PASS, $DB);
$result = mysqli_query($con, "select * from carsitter where id = '".$request->key."';");

$user = array();

$user[carsitter] = null;

while($row = mysqli_fetch_assoc($result))
{
    $user[carsitter] = $row;
}


echo json_encode($user);
    
?>
