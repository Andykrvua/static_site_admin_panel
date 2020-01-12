<?php
// сохраняем данные после редактирования

// готовим данные для получения 
$_POST = json_decode(file_get_contents("php://input"), true);

// имя страницы для сохранения данных
$file = "./../../" . $_POST["pageName"];

// данные для сохранения
$newHTML = $_POST["html"];

if ($newHTML && $file) {

    // проверяем существуют ли данные и записываем в файл
    file_put_contents($file, $newHTML);
} else {
    header("HTTP/1.0 400 Bad Request");
}