import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: ""
    };
  }

  onPasswordCahnge(e) {
    this.setState({
      pass: e.target.value
    });
  }

  render() {
    const { pass } = this.state;
    const { loginError } = this.props;

    let loginErr;

    loginError
      ? (loginErr = (
          <span className="login-error uk-margin-top">Неправильный пароль</span>
        ))
      : null;

    return (
      <div className="login-container">
        <div className="login">
          <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
          <div className="uk-margin-top uk-tet-lead">Пароль:</div>
          <input
            type="password"
            name=""
            id=""
            className="uk-input uk-margin-top"
            placeholder="Пароль"
            value={pass}
            onChange={e => this.onPasswordCahnge(e)}
          />
          {loginErr}
          <button
            className="uk-margin-top uk-button uk-button-primary"
            type="button"
            onClick={() => this.props.login(pass)}
          >
            Вход
          </button>
        </div>
      </div>
    );
  }
}
