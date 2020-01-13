import React from "react";
import UIkit from "uikit";

const ConfirmModal = ({ modal, target, method }) => {
  return (
    <div id={target} uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Сохранение</h2>
        <p>Вы действительно хотите сохранить изменения?</p>
        <p className="uk-text-right">
          <button
            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
            type="button"
          >
            Отмена
          </button>
          <button
            onClick={() =>
              method(
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
  );
};

export default ConfirmModal;
