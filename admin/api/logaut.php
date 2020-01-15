<?php

session_start();

if ($_SESSION["auth"] == true) {
    
    $_SESSION["auth"] = false;

    session_destroy();

    echo json_encode(array("auth" => false));
}