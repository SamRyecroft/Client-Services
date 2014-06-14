<?php
header('Content-Type: application/json');
	if ($_REQUEST['email'] != null) {
		$name = $_REQUEST['name'];
		$email = $_REQUEST['email'];
		$message = $_REQUEST['message'];
		mail("alandunnen@gmail.com", "Sender: $name", $message, "From: $email");
	}
echo json_encode($_POST);		
?>