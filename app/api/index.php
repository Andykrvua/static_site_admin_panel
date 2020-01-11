<?php
// получаем список страниц с корневой папки сервера

$htmlfiles = glob("./../../*.html");

$responce = [];
foreach ($htmlfiles as $file) {
    array_push($responce, basename($file));
}

// возвращаем обратно в axios в json формате
echo json_encode($responce);