import React from "react";
import { useEffect, useState } from "react";

const Login = () => {
  const [isLogined, setIsLogined] = useState(false);
  const checkLoginStatus = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/login/check", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setIsLogined(data.loggedIn);
      }
    } catch (err) {
      console.error("로그인 상태 확인 중 오류:", err);
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);
  const githubLogin = () => {
    fetch("http://localhost:5001/api/login/github")
      .then((res) => res.json())
      .then((data) => window.open(data.url, "_blank", "noopener, noreferrer"));
  };

  const logout = async () => {
    const res = await fetch("http://localhost:5001/api/login/logout", {
      method: "GET",
      credentials: "include",
    });
    console.log(res);
    if (res.ok) {
      console.log("로그아웃 성공");
      checkLoginStatus();
    } else {
      console.error("로그아웃 실패");
    }
  };

  return (
    <>
      {!isLogined && <button onClick={githubLogin}>GitHub 로그인</button>}
      {isLogined && <button onClick={logout}>로그아웃</button>}
    </>
  );
};

export default Login;
