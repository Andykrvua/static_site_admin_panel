import React, { Component } from "react";
import axios from "axios";

export default class Editor extends Component {
  constructor() {
    super();

    this.state = {
      pageList: [],
      newPageName: ""
    };
  }

  componentDidMount() {
    this.loadPageList();
  }

  loadPageList() {
    axios.get("./api").then(res => this.setState({ pageList: res.data }));
  }

  createNewPage() {}

  render() {
    const { pageList } = this.state;
    const pages = pageList.map((page, i) => {
      return <h1 key={i}>{page}</h1>;
    });

    return (
      <>
        <input type="text" />
        <button>Создать страницу</button>
        {pages}
      </>
    );
  }
}
