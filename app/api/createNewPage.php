<?php

// получим название для будущего файла
$_POST = json_decode(file_get_contents("php://input"), true);

$newFile = "./../../" . $_POST["name"] . ".html";

if (file_exists($newFile)) {
    header("HTTP/1.0 400 Bad Request");
} else {

    // если файла не существует создаем
    fopen($newFile, "w");
}