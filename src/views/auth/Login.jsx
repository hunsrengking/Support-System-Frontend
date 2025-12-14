import React, { useState } from "react";
import logo from "../../assets/images/logo/logo.png";
import "./Login.css";
import { useTranslation } from "react-i18next";
import axiosClient from "../../services/axiosClient";
import { useEffect } from "react";

const Login = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/api/login", {
        email,
        password,
      });

      const data = response.data;

      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem("app_auth_token", token);
      }

      if (data.user) {
        localStorage.setItem("app_auth_user", JSON.stringify(data.user));
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.crossorigin = "anonymous";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Left Side */}
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
              alt="App Logo"
              width="150px"
              height="130px"
              className="img-fluid"
            />
          </center>

          <div className="title">{t("login")}</div>
          <br />
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="input-box">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t("email")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  <span className="spinner-border spinner-border-sm"></span>
                )}
              </button>
            </center>
          </form>
        </div>
        {/* Right Side */}
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
