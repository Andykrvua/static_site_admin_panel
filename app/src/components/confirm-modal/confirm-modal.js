import React from "react";

const ConfirmModal = ({ modal, target, method, text }) => {
  const { title, descr, btn } = text;

  return (
    <div id={target} uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">{title}</h2>
        <p>{descr}</p>
        <p className="uk-text-right">
          <button
            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
            type="button"
          >
            Отмена
          </button>
          <button
            onClick={() => method()} // обернули в анонимную функцию что бы сохранить контекст, иначе нужен bind в конструторе
            className="uk-button uk-button-primary uk-modal-close"
            type="button"
          >
            {btn}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ConfirmModal;
