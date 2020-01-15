<?php

session_start();
if ($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}
// сохраняем данные после редактирования и создаем файл бекапа

// готовим данные для получения в формате json
$_POST = json_decode(file_get_contents("php://input"), true);

// имя страницы для сохранения данных
$file = $_POST["pageName"];

// данные для сохранения
$newHTML = $_POST["html"];

// проверим, если нет папки backups создадим
if (!is_dir("./../backups/")) {
    mkdir("./../backups/");
}

// если это не первое изменение, дописываем в массив, а если файла backups.json не существует...
$backups = json_decode(file_get_contents("./../backups/backups.json"));

// проверяем есть ли массив в переменной
if (!is_array($backups)) {

    // и если нет создаем переменную для хранения параметров бекапа
    $backups = [];
}

if ($newHTML && $file) {

    // создаем уникальное имя файла
    $backupFN = uniqid() . ".html";

    // копируем оригинальный файл в папку backups
    copy("./../../" . $file, "./../backups/" . $backupFN);

    // ассоциативный массив с данными бекапа, оригинальное название файла и название бекап файла
    array_push($backups, ["page" => $file, "file" => $backupFN, "time" => date("H:i:s d-m-y")]);
    // записываем в json параметры нашего бекапа
    file_put_contents("./../backups/backups.json", json_encode($backups));

    // проверяем существуют ли данные и записываем в файл
    file_put_contents("./../../" . $file, $newHTML);
} else {
    header("HTTP/1.0 400 Bad Request");
}