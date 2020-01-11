import React, { Component } from "react";
import axios from "axios";
import "./../../helpers/iframeLoader.js";

export default class Editor extends Component {
  constructor() {
    super();

    this.currentPage = "index.html";

    this.state = {
      pageList: [],
      newPageName: ""
    };
    this.createNewPage = this.createNewPage.bind(this);
  }

  componentDidMount() {
    this.init(this.currentPage);
  }

  init(page) {
    this.iframe = document.querySelector("iframe");
    this.open(page);
    this.loadPageList();
  }

  open(page) {
    this.currentPage = `../${page}?rnd=${Math.random()
      .toString()
      .substring(2)}`;

    axios
      .get(`../${page}`) // получаем код страницы в текстовом виде
      .then(res => this.parseStrToDom(res.data)) // парсим код преваращая в DOM структуру
      .then(this.wrapTextNodes) // передаем DOM в метод, который обернет нужные узлы в text-editor
      .then(dom => {
        this.virtualDom = dom; // создаем чистую копию редактируемого файла
        return dom; // что бы не обрывать цепочку вызовов вернем ранее полученный dom
      })
      .then(this.serializeDOMToString) // готовим к отправке в php, переводим в строку
      .then(html => axios.post("./api/saveTempPage.php", { html })) // отправляем в api для сохранения
      .then(() => this.iframe.load("./../temp.html")) // получаем сохраненную копию
      .then(() => this.enableEditing()); // включаем редактирование
  }

  save() {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
  }

  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach(element => {
        element.contentEditable = "true";
        element.addEventListener("input", () => {
          this.onTextEdit(element); // вешаем обработчик на каждый редактируемый элемент
        });
      });
  }

  onTextEdit(element) {
    const id = element.getAttribute("nodeid");
    this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML =
      element.innerHTML;
    console.log(this.virtualDom);
    console.log(`[nodeid="${id}"]`);
  }

  parseStrToDom(str) {
    // превращаем страницу в dom элементы, может быть ошибка с svg! проверить
    const parser = new DOMParser();
    return parser.parseFromString(str, "text/html");
  }

  wrapTextNodes(dom) {
    // метод оборачивающий все нужные узлы в кастомный компонент
    const body = dom.body;
    let textNodes = [];

    function recursy(element) {
      element.childNodes.forEach(node => {
        if (
          node.nodeName === "#text" &&
          node.nodeValue.replace(/\s+/g, "").length > 0
        ) {
          textNodes.push(node);
        } else {
          recursy(node);
        }
      });
    }

    recursy(body);
    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement("text-editor");
      node.parentNode.replaceChild(wrapper, node);
      wrapper.appendChild(node);
      wrapper.setAttribute("nodeid", i); // установим id для каждой ноды
    });

    return dom;
  }

  serializeDOMToString(dom) {
    // метод переводит dom в строку для обработки в php
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
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

  render() {
    console.log("render");
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
        <iframe src={this.currentPage} frameBorder="0"></iframe>
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
