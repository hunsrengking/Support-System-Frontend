import React, { useState } from "react";
import logo from "../../assets/images/logo/logo.png";
import "./Login.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      alert("Login functionality would be implemented here");
    }, 1500);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Left Side: Form */}
        <div className="login-left">
          <div className="language-selector">
            <label htmlFor="language">{t("change_language")}</label>
            <select
              id="language"
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="kh">Khmer</option>
            </select>
          </div>
          <center>
            <img
              src={logo}
              alt="TUFU Logo"
              width="150px"
              height="130px"
              className="img-fluid"
            />
          </center>
          <div className="title">{t("login")}</div>
          <br />
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="input-box">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder={t("username")}
                required
              />
            </div>
            <div className="input-box">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t("password")}
                required
              />
            </div>
            <center>
              <button
                type="submit"
                className="btn btn-primary"
                id="loginBtn"
                disabled={isLoading}
              >
                <span className="btn-text">
                  {isLoading ? t("logging_in") : t("login")}
                </span>
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
              </button>
            </center>
          </form>
        </div>
        {/* Right Side: Branding */}
        <div className="login-right">
          <h1>{t("brand_text.title")}</h1>
          <p>{t("brand_text.subtitle1")}</p>
          <p>{t("brand_text.subtitle2")}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
