import React, { Component } from "react";
import axios from "axios";
import "./../../helpers/iframeLoader.js";
import DOMHelper from "./../../helpers/dom-helper.js";
import EditorText from "./../editor-text";
import UIkit from "uikit";
import Spinner from "./../spinner";

export default class Editor extends Component {
  constructor() {
    super();

    this.currentPage = "index.html";

    this.state = {
      pageList: [],
      newPageName: "",
      loading: true
    };
    this.createNewPage = this.createNewPage.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
  }

  componentDidMount() {
    this.init(this.currentPage);
  }

  init(page) {
    this.iframe = document.querySelector("iframe");
    this.open(page, this.isLoaded);
    this.loadPageList();
  }

  open(page, cb) {
    this.currentPage = page;

    axios
      .get(
        `../${page}?rnd=${Math.random()
          .toString()
          .substring(2)}`
      ) // получаем код страницы в текстовом виде
      .then(res => DOMHelper.parseStrToDom(res.data)) // парсим код преваращая в DOM структуру
      .then(DOMHelper.wrapTextNodes) // передаем DOM в метод, который обернет нужные узлы в text-editor
      .then(dom => {
        this.virtualDom = dom; // создаем чистую копию редактируемого файла
        return dom; // что бы не обрывать цепочку вызовов вернем ранее полученный dom
      })
      .then(DOMHelper.serializeDOMToString) // готовим к отправке в php, переводим в строку
      .then(html => axios.post("./api/saveTempPage.php", { html })) // отправляем в api для сохранения
      .then(() => this.iframe.load("./../temp.html")) // получаем сохраненную копию
      .then(() => this.enableEditing()) // включаем редактирование
      .then(() => this.injectStyles())
      .then(cb);
  }

  save(onSuccess, onError) {
    // сохраняем данные после редактирования

    this.isLoading();

    // создаем копию отредактированного dom дерева
    const newDom = this.virtualDom.cloneNode(this.virtualDom);

    // передаем методу что бы убрать кастомную обертку
    DOMHelper.unwrapTextNodes(newDom);

    // переводим в строку для отправки в php обработчик
    const html = DOMHelper.serializeDOMToString(newDom);
    axios
      .post("./api/savePage.php", { pageName: this.currentPage, html })
      .then(onSuccess)
      .catch(onError)
      .finally(this.isLoaded);
  }

  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach(element => {
        const id = element.getAttribute("nodeid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[nodeid="${id}"]`
        );
        // передаем в констурктор элемент с нашего temp файла и тот же элемент с чистого dom дерева
        new EditorText(element, virtualElement);
      });
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
    text-editor:hover {
      outline: 2px solid coral;
      outline-offset: 5px;
    }
    text-editor:focus {
      outline: 2px solid orange;
      outline-offset: 5px;
    }`;
    this.iframe.contentDocument.head.appendChild(style);
  }

  loadPageList() {
    axios.get("./api").then(res => this.setState({ pageList: res.data }));
  }

  createNewPage() {
    axios
      .post("./api/createNewPage.php", { name: this.state.newPageName })
      .then(res => {
        console.log(res);
        this.setState({ newPageName: "" });
        this.loadPageList();
      })
      .catch(() => alert("Такая страница уже существует"));
  }

  deletePage(page) {
    axios
      .post("./api/deletePage.php", { name: page })
      .then(res => {
        console.log(res);
        this.loadPageList();
      })
      .catch(() => alert("Что-то пошло не так"));
  }

  isLoading() {
    this.setState({
      loading: true
    });
  }

  isLoaded() {
    this.setState({
      loading: false
    });
  }

  render() {
    const modal = true;
    const { loading } = this.state;
    let spinner;
    loading ? (spinner = <Spinner active />) : (spinner = <Spinner />);
    // console.log("render");
    // const { pageList } = this.state;
    // const pages = pageList.map((page, i) => {
    //   return (
    //     <h1 key={i}>
    //       {page}
    //       <a href="#" onClick={() => this.deletePage(page)}>
    //         (x)
    //       </a>
    //     </h1>
    //   );
    // });

    return (
      <>
        {console.log("render")}

        <iframe src={this.currentPage} frameBorder="0"></iframe>

        {spinner}

        <div className="panel">
          <button
            uk-toggle="target: #modal-save"
            className="uk-button uk-button-primary"
          >
            Сохранить
          </button>
        </div>

        <div id="modal-save" uk-modal={modal.toString()}>
          <div className="uk-modal-dialog uk-modal-body">
            <h2 className="uk-modal-title">Сохранение</h2>
            <p>Вы действительно хотите сохранить изменения?</p>
            <p className="uk-text-right">
              <button
                className="uk-button uk-button-default uk-modal-close"
                type="button"
              >
                Отмена
              </button>
              <button
                onClick={() =>
                  this.save(
                    () => {
                      UIkit.notification({
                        message: "Изменения сохранены",
                        status: "success"
                      });
                    },
                    () => {
                      UIkit.notification({
                        message: "Ошибка сохранения",
                        status: "danger"
                      });
                    }
                  )
                } // обернули в анонимную функцию что бы сохранить контекст, иначе нужен bind в конструторе
                className="uk-button uk-button-primary uk-modal-close"
                type="button"
              >
                Сохранить
              </button>
            </p>
          </div>
        </div>
      </>
      // <>
      //   <input
      //     type="text"
      //     value={this.state.newPageName}
      //     onChange={event => this.setState({ newPageName: event.target.value })}
      //   />
      //   <button onClick={this.createNewPage}>Создать страницу</button>
      //   {pages}
      // </>
    );
  }
}
