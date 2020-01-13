<?php

// название файла для удаления

$file = "./../../f45ds615dsvvds1v5.html";

if (file_exists($file)) {

    // если файл существует удалим
    unlink($file);
} else {
    header("HTTP/1.0 400 Bad Request");
}