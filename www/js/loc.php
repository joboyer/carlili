<?php

include 'connect.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);


$con = mysqli_connect($HOST, $NAME, $PASS, $DB);
$result = mysqli_query($con, "select * from location where idclient = '".$request->key."';");

$user = array();

$user = null;
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

$sult = mysqli_query($con, "select * from car where id = '".$user["idvoiture"]."'");
$user['car'] = null;
	while($jojo = mysqli_fetch_assoc($sult))
	{
		$user['car'] = $jojo;
	}

echo json_encode($user);
    
?>
