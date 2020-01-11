<?php

// получим название файла для удаления
$_POST = json_decode(file_get_contents("php://input"), true);

$file = "./../../" . $_POST["name"];

if (file_exists($file)) {

    // если файл существует удалим
    unlink($file);
} else {
    header("HTTP/1.0 400 Bad Request");
}