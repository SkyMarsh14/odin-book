import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
function App() {
  const [count, setCount] = useState(0);
  const handleGithubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=read:user`;
    window.location.href = githubAuthUrl;
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;
    const target = `http://localhost:3000/`;
  });
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div class="github-signin-container">
        <button class="github-signin-btn" onClick={handleGithubLogin}>
          <img
            src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png"
            alt="GitHub Icon"
          />
          Sign in with GitHub
        </button>
      </div>
    </>
  );
}

export default App;
