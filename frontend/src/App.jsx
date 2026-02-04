import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const handleGithubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=read:user`;
    window.location.href = githubAuthUrl;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let formBody = {};
    for (let [key, value] of formData.entries()) {
      formBody[key] = value;
    }
    formBody = JSON.stringify(formBody);
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formBody,
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
  };
  useEffect(() => {
    async function handleAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;
      const url = `http://localhost:3000/github/access-token?code=${code}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
    }
    handleAuth();
  }, []);
  return (
    <>
      <div>
        <button onClick={handleGithubLogin}>
          <img
            src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png"
            alt="GitHub Icon"
            className="img"
          />
          Sign in with GitHub
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Name</label>
          <input name="username" type="text" />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input name="password" type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
