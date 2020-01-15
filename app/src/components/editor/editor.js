import React, { Component } from "react";
import axios from "axios";
import "./../../helpers/iframeLoader.js";
import DOMHelper from "./../../helpers/dom-helper.js";
import EditorText from "./../editor-text";
import UIkit from "uikit";
import Spinner from "./../spinner";
import ConfirmModal from "./../confirm-modal";
import ChooseModal from "./../choose-modal";
import Panel from "./../panel";
import EditorMeta from "./../editor-meta";
import EditorImages from "./../editor-images";
import Login from "./../login";

export default class Editor extends Component {
  constructor() {
    super();

    this.currentPage = "index.html";

    this.state = {
      pageList: [],
      backupsList: [],
      newPageName: "",
      loading: true,
      auth: false,
      loginError: false
    };
    // this.createNewPage = this.createNewPage.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
    this.restoreBackup = this.restoreBackup.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.checkAuth();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.auth !== prevState.auth) {
      this.init(null, this.currentPage);
    }
  }

  checkAuth() {
    axios.get("./api/checkAuth.php").then(res => {
      this.setState({
        auth: res.data.auth
      });
    });
  }

  login(pass) {
    axios.post("./api/login.php", { password: pass }).then(res => {
      this.setState({
        auth: res.data.auth,
        loginError: !res.data.auth
      });
    });
  }

  logout() {
    axios.get("./api/logout.php").then(() => {
      window.location.replace("/admin/");
    });
  }

  init(e, page) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.auth) {
      this.isLoading();
      this.iframe = document.querySelector("iframe");
      this.open(page, this.isLoaded);
      this.loadPageList();
      this.loadBackupsList();
    }
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
      .then(DOMHelper.wrapImages) // передаем DOM в метод, который добавит изображениям атрибут
      .then(dom => {
        this.virtualDom = dom; // создаем чистую копию редактируемого файла
        return dom; // что бы не обрывать цепочку вызовов вернем ранее полученный dom
      })
      .then(DOMHelper.serializeDOMToString) // готовим к отправке в php, переводим в строку
      .then(html => axios.post("./api/saveTempPage.php", { html })) // отправляем в api для сохранения
      .then(() => this.iframe.load("./../f45ds615dsvvds1v5.html")) // получаем сохраненную копию
      .then(() => axios.post("./api/deleteTempPage.php")) // удаляем копию файла
      .then(() => this.enableEditing()) // включаем редактирование
      .then(() => this.injectStyles())
      .then(cb);

    this.loadBackupsList();
  }

  async save() {
    // async говорит что внутри асинхронные операции
    // сохраняем данные после редактирования

    this.isLoading();

    // создаем копию отредактированного dom дерева
    const newDom = this.virtualDom.cloneNode(this.virtualDom);

    DOMHelper.unwrapTextNodes(newDom); // передаем методу что бы убрать кастомную обертку
    DOMHelper.unwrapImages(newDom); // передаем методу что бы убрать атрибут с изображений

    // переводим в строку для отправки в php обработчик
    const html = DOMHelper.serializeDOMToString(newDom);
    await axios // await говорит, дождаться окончания запроса прежде чем выполнить this.loadBackupsList();
      .post("./api/savePage.php", { pageName: this.currentPage, html })
      .then(() => this.showNotifications("Изменения сохранены", "success"))
      .catch(() => this.showNotifications("Ошибка сохранения", "danger"))
      .finally(this.isLoaded);

    this.loadBackupsList();
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

    this.iframe.contentDocument.body
      .querySelectorAll("[editableimgid]")
      .forEach(element => {
        const id = element.getAttribute("editableimgid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[editableimgid="${id}"]`
        );
        new EditorImages(
          element,
          virtualElement,
          this.isLoading,
          this.isLoaded,
          this.showNotifications
        );
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
    }
    [editableimgid]:hover {
      outline: 2px solid coral;
      outline-offset: 5px;
    }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }

  showNotifications(message, status) {
    UIkit.notification({ message, status });
  }

  loadPageList() {
    axios
      .get("./api/pageList.php")
      .then(res => this.setState({ pageList: res.data }));
  }

  loadBackupsList() {
    axios.get("./backups/backups.json").then(res =>
      this.setState({
        backupsList: res.data.filter(backup => {
          return backup.page === this.currentPage;
        })
      })
    );
  }

  restoreBackup(e, backup) {
    if (e) {
      e.preventDefault();
    }
    UIkit.modal
      .confirm(
        "Вы действительно хотите восстановить страницу из резервной копии? Все внесенные изменения будут утеряны!",
        { labels: { ok: "Восстановить", cancel: "Отмена" } }
      )
      .then(() => {
        this.isLoading();
        return axios.post("./api/restoreBackup.php", {
          page: this.currentPage,
          file: backup
        });
      })
      .then(() => {
        this.open(this.currentPage, this.isLoaded);
      });
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
    const { loading, pageList, backupsList, auth, loginError } = this.state;
    let spinner;

    loading ? (spinner = <Spinner active />) : (spinner = <Spinner />);

    if (!auth) {
      return <Login login={this.login} loginError={loginError} />;
    }

    return (
      <>
        {console.log("render")}

        <iframe src="" frameBorder="0"></iframe>
        <input
          id="img-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />

        {spinner}

        <Panel />

        <ConfirmModal
          modal={modal}
          target={"modal-save"}
          method={this.save}
          text={{
            title: "Сохранение",
            descr: "Вы действительно хотите сохранить изменения?",
            btn: "Сохранить"
          }}
        />

        <ConfirmModal
          modal={modal}
          target={"modal-logout"}
          method={this.logout}
          text={{
            title: "Выход",
            descr: "Вы действительно хотите выйти?",
            btn: "Выйти"
          }}
        />

        <ChooseModal
          modal={modal}
          target={"modal-open"}
          data={pageList}
          redirect={this.init}
        />

        <ChooseModal
          modal={modal}
          target={"modal-backup"}
          data={backupsList}
          redirect={this.restoreBackup}
        />

        {this.virtualDom ? (
          <EditorMeta
            modal={modal}
            target={"modal-meta"}
            virtualDom={this.virtualDom}
          />
        ) : (
          false
        )}
      </>
    );
  }
}
