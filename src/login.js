import React from "react";

const Login = () => {
  const githubLogin = () => {
    fetch("http://localhost:5001/api/login/github")
      .then((res) => res.json())
      .then((data) => window.open(data.url, "_blank", "noopener, noreferrer"));
  };
  return (
    <>
      <button onClick={githubLogin}>GitHub 로그인</button>
    </>
  );
};

export default Login;
