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
    this.currentPage = `../${page}`;
    this.iframe.load(this.currentPage, () => {
      const body = this.iframe.contentDocument.body;
      console.log(body);

      body.childNodes.forEach(node => {
        console.log(node);
      });
    });
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
      <iframe src={this.currentPage} frameBorder="0"></iframe>
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
