import styles from "./login.module.css";
import appLogo from "../../assets/logo.svg";
import githubLogo from "../../assets/GitHub_Invertocat_White.svg";
import auth from "../../api/auth.js";
function Login({ signUp }) {
  const handleGithubLogin = () => {
    window.location = "http://localhost:3000/auth/github";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    if (signUp) {
      await auth.signUp(formElement);
    } else {
      await auth.login(formElement);
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
          <div className={styles["comfortaa-title"]}>
            {signUp ? "Join Vibely" : "Welcome back"}
          </div>
          <div className={`${styles["nunito-regular"]} ${styles.subtitle}`}>
            {signUp
              ? "Create your account to get started"
              : "Sign in to continue Vibely"}
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
          {signUp && (
            <div className={styles["form-field"]}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                className={styles.input}
                placeholder="••••••••"
              />
            </div>
          )}
          <button type="submit" className={styles["submit-btn"]}>
            {signUp ? "Sign Up" : "Login"}
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
        <div className={styles["signup-link"]}>
          {signUp ? (
            <>
              Don't have an account? <a href="/login">Login</a>
            </>
          ) : (
            <>
              Already have an account? <a href="/sign-up">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
