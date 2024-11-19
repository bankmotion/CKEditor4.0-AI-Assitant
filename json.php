<?php

    header('Content-Type: application/json');

	if (isset($_GET['action']) && ($_GET['action'] == 'getcredits')) {
		echo '{"aicredits":100}';
	} else {
		$arrayValues = array();
		$arrayValues['error'] = 'Error message here';
		$arrayValues['aicredits'] = 100;
		$arrayValues['airesponse'] = 'Data goes here from OpenAI';
		echo json_encode($arrayValues);
	}
