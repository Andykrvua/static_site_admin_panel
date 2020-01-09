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
      // document.location.reload(true);
      // this.iframe.contentDocument.location.reload(true);
      const body = this.iframe.contentDocument.body;
      let textNodes = [];
      console.log(this.iframe.src);

      if (body.childNodes.length === 0) {
        console.log("try" + body.childNodes.length);
        this.open(page);
        // document.location.reload(true);
      }

      function recursy(element) {
        element.childNodes.forEach(node => {
          // console.log(node);
          if (
            node.nodeName === "#text" &&
            node.nodeValue.replace(/\s+/g, "").length > 0
          ) {
            textNodes.push(node);
            // console.log(node);
          } else {
            recursy(node);
          }
        });
      }

      recursy(body);
      body.setAttribute("contentEditable", true);
      textNodes.forEach(node => {
        // console.log(node);
        const wrapper = this.iframe.contentDocument.createElement(
          "text-editor"
        );
        node.parentNode.replaceChild(wrapper, node);
        wrapper.appendChild(node);
        // wrapper.contentEditable = "true";
        wrapper.setAttribute("contentEditable", true);
        console.log(wrapper);
      });
    });

    // const body2 = this.iframe.contentDocument.body;
    // if (body2.hasAttribute("contentEditable")) {
    //   alert("dd");
    //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    // } else {
    //   document.location.reload(true);
    //   this.open(page);
    //   console.log("sssssssssssssssssssssssssssssssssssssssssssssss");
    // }
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
