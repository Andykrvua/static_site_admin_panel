import React, { Component } from "react";

export default class EditorMeta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        title: "",
        description: "",
        keywords: ""
      }
    };
  }

  componentDidMount() {
    this.getMeta(this.props.virtualDom);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.virtualDom !== this.props.virtualDom) {
      this.getMeta(this.props.virtualDom);
    }
  }

  getMeta(virtualDom) {
    this.title =
      virtualDom.head.querySelector("title") ||
      virtualDom.head.appendChild(virtualDom.createElement("title"));
    this.description = virtualDom.head.querySelector(
      "meta[name='description']"
    );
    if (!this.description) {
      this.description = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.description.setAttribute("name", "description");
      this.description.setAttribute("content", "");
    }
    this.keywords = virtualDom.head.querySelector("meta[name='keywords']");
    if (!this.keywords) {
      this.keywords = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.keywords.setAttribute("name", "keywords");
      this.keywords.setAttribute("content", "");
    }

    this.setState({
      meta: {
        title: this.title.innerHTML,
        description: this.description.getAttribute("content"),
        keywords: this.keywords.getAttribute("content")
      }
    });
  }

  applyMeta() {
    this.title.innerHTML = this.state.meta.title;
    this.description.setAttribute("content", this.state.meta.description);
    this.keywords.setAttribute("content", this.state.meta.keywords);
  }

  onValueChange(e) {
    if (e.target.getAttribute("data-title")) {
      e.persist(); // для доступа к свойствам событий асинхронным способом
      this.setState(({ meta }) => {
        // колбек нужен что бы текущий стейт зависел от предыдущего (отключаем асинхронность)
        const newMeta = {
          // что бы избежать отдельных мутаций сначала копируем старый стейт
          ...meta,
          title: e.target.value
        };

        return {
          // возвращаем новый стейт
          meta: newMeta
        };
      });
    } else if (e.target.getAttribute("data-key")) {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          keywords: e.target.value
        };

        return {
          meta: newMeta
        };
      });
    } else {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          description: e.target.value
        };

        return {
          meta: newMeta
        };
      });
    }
  }

  render() {
    const { modal, target } = this.props;
    const { title, keywords, description } = this.state.meta;

    return (
      <div id={target} uk-modal={modal.toString()}>
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Редактирование Метатегов</h2>

          <form>
            <div className="uk-margin">
              <input
                data-title
                className="uk-input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => this.onValueChange(e)}
              />
            </div>

            <div className="uk-margin">
              <textarea
                data-descr
                className="uk-textarea"
                rows="5"
                placeholder="Description"
                value={description}
                onChange={e => this.onValueChange(e)}
              ></textarea>
            </div>

            <div className="uk-margin">
              <textarea
                data-key
                className="uk-textarea"
                rows="5"
                placeholder="Keywords"
                value={keywords}
                onChange={e => this.onValueChange(e)}
              ></textarea>
            </div>
          </form>

          <p className="uk-text-right">
            <button
              className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
              type="button"
            >
              Отмена
            </button>
            <button
              className="uk-button uk-button-primary uk-modal-close"
              type="button"
              onClick={() => {
                this.applyMeta();
              }}
            >
              Применить
            </button>
          </p>
        </div>
      </div>
    );
  }
}
