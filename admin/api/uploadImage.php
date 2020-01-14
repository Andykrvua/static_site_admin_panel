<?php

// проверяем есть ли файл и проверяем загружен ли он
if (file_exists($_FILES["image"]["tmp_name"]) && is_uploaded_file($_FILES["image"]["tmp_name"])) {

    // получаем тип изображения, строка на выходе $_FILES["image"]["type"] будет image/png таким образом explode разбивает массив по симовлу / и возвращает второй элемент
    $fileExt = explode("/", $_FILES["image"]["type"])[1];

    $fileName = uniqid() . "." . $fileExt;

    // функция перемещает полученный файл, файлы всегда лежат в массиве _FILES
    // первый аргумент что за данные и имя файла, в данном случае tmp_name, второй аргумент это путь
    move_uploaded_file($_FILES["image"]["tmp_name"], "./../../img/" . $fileName);

    // вернем данные о новом файле
    echo json_encode(array("src" => $fileName));
}