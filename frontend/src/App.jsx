import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
function App() {
  const handleGithubLogin = () => {
    window.location = "http://localhost:3000/auth/github";
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
    navigate("/");
  };
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
