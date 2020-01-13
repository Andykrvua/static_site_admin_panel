<?php
// создаем копию оригинальной страницы для редактирования

// готовим данные для получения 
$_POST = json_decode(file_get_contents("php://input"), true);

$newFile = "./../../f45ds615dsvvds1v5.html";

if ($_POST["html"]) {

    // если данные с ключом html создаем файл
    file_put_contents($newFile, $_POST["html"]);
} else {
    header("HTTP/1.0 400 Bad Request");
}