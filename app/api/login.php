<?php
session_start(); // сесия должна стратовать первой

// готовим данные для получения в формате json
$_POST = json_decode(file_get_contents("php://input"), true);

// достаем пароль
$password = $_POST["password"];

if ($password) {
    
    // если пароль существует читаем пароль с файла настроек
    $settings = json_decode(file_get_contents("./settings.json", ), true);

    if ($password == $settings["password"]){

        // добавляем в сесиию переменню если пароли совпадают
        $_SESSION["auth"] = true;
        echo json_encode(array("auth" => true));
    } else {
        echo json_encode(array("auth" => false));
    }
} else {
    header("HTTP/1.0 400 Bad Request");
}

