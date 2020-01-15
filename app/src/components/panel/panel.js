import React from "react";

const Panel = () => {
  return (
    <div className="panel">
      <button
        uk-toggle="target: #modal-open"
        className="uk-button uk-button-primary uk-margin-small-right"
      >
        Открыть
      </button>

      <button
        uk-toggle="target: #modal-save"
        className="uk-button uk-button-primary uk-margin-small-right"
      >
        Сохранить
      </button>

      <button
        uk-toggle="target: #modal-meta"
        className="uk-button uk-button-primary uk-margin-small-right"
      >
        Метатеги
      </button>

      <button
        uk-toggle="target: #modal-backup"
        className="uk-button uk-button-default"
      >
        Резервные копии
      </button>

      <button
        uk-toggle="target: #modal-logout"
        className="uk-button uk-button-danger uk-margin-small-left"
      >
        Выйти
      </button>
    </div>
  );
};

export default Panel;
