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

  render() {
    const { pageList } = this.state;
    const pages = pageList.map((page, i) => {
      return <div key={i}>{page}</div>;
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
