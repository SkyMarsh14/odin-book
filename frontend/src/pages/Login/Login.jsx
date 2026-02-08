import styles from "./login.module.css";
import appLogo from "../../assets/logo.svg";
import githubLogo from "../../assets/GitHub_Invertocat_White.svg";
function Login() {
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
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles["content-container"]}>
        <div className={styles["sign-in-container"]}>
          <div className={styles["logo-container"]}>
            <img src={appLogo} alt="Vibely Logo" className={styles.logo} />
            <div className={styles["mogra-regular"]}>Vibely</div>
          </div>
          <div className={styles["comfortaa-title"]}>Welcome Back</div>
          <div className={`${styles["nunito-regular"]} ${styles.subtitle}`}>
            Sign in to continue Vibely
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-field"]}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              name="username"
              id="username"
              type="text"
              className={styles.input}
              placeholder="Enter your username"
            />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className={styles["submit-btn"]}>
            Submit
          </button>
        </form>

        <div className={styles["horizontal-line"]}>
          <span>Or continue with</span>
        </div>
        <button onClick={handleGithubLogin} className={styles["github-button"]}>
          <img
            className={styles["github-img"]}
            src={githubLogo}
            alt="GitHub Icon"
          />
          <div className={styles["figtree-normal"]}>Sign in with GitHub</div>
        </button>
        <button className={styles["guest-button"]}>Continue as a Gueset</button>
      </div>
    </div>
  );
}

export default Login;
