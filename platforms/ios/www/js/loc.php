<?php

include 'connect.php';

/*$postdata = file_get_contents("php://input");
$request = json_decode($postdata);*/

$key = 1;

$con = mysqli_connect($HOST, $NAME, $PASS, $DB);
$result = mysqli_query($con, "select * from location where idclient = '".$key."';");

$users = array();

$users = null;
while($row = mysqli_fetch_assoc($result))
{
    $user = $row;
}

$res = mysqli_query($con, "select * from start where locid = '".$user["idcarsistart"]."'");      
$user['start'] = null;
        while($ro = mysqli_fetch_assoc($res))
        {
            $user['start'] = $ro;
        }

$re = mysqli_query($con, "select * from end where locid = '".$user["idcarsiend"]."'");      
$user['end'] = null;
        while($r = mysqli_fetch_assoc($re))
        {
            $user['end'] = $r;
        }

echo json_encode($user);
    
?>