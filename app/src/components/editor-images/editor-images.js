import axios from "axios";

export default class EditorImages {
  constructor(element, virtualElement) {
    this.element = element;
    this.virtualElement = virtualElement;
    this.element.addEventListener("click", () => this.onClick());
    this.imgUploader = document.querySelector("#img-upload");
  }

  onClick() {
    this.imgUploader.click(); // симмуляция клика на элементе инпута
    this.imgUploader.addEventListener("change", () => {
      // когда пользователь выбрал изображение
      if (this.imgUploader.files && this.imgUploader.files[0]) {
        // проверим есть ли оно на самом деле
        let formData = new FormData();
        formData.append("image", this.imgUploader.files[0]); // поместим изображение в объект
        axios
          .post("./api/uploadImage.php", formData, {
            headers: {
              "Content-Type": "multipart/form-data" // установим нужный заголовок, иначе сервер не поймет
            }
          })
          .then(res => {
            // значение сразу двум переменным
            this.virtualElement.src = this.element.src = `./img/${res.data.src}`;
            // сбрасываем данные в инпуте иначе после загрузки первого изображения, скрипт до перезагрузки не будет реагировать на новые значения
            this.imgUploader.value = "";
          });
      }
    });
  }
}
