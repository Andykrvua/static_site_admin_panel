<?php

session_start();
if ($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}
// восстанавливаем файл страницы из бекапа

// готовим данные для получения 
$_POST = json_decode(file_get_contents("php://input"), true);

// имя бекап файла
$file = $_POST["file"];

// страница на которой мы находимся, ее и востанавливаем
$page = $_POST["page"];

if ($page && $file) {
    // копируем файл из папки backups на место заменяемого файла
    copy("./../backups/" . $file, "./../../" . $page);
} else {
    header("HTTP/1.0 400 Bad Request");
}