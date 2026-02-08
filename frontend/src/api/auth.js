const ops = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

const auth = {
  login: async (formElement) => {
    const formData = new FormData(formElement);
    let formBody = {};
    for (let [key, value] of formData.entries()) {
      formBody[key] = value;
    }
    formBody = JSON.stringify(formBody);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}login`, {
      ...ops,
      body: formBody,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch.");
    }
    const data = await response.json();
    console.log(data);
  },
  signIn: async (formElement) => {
    const formData = new FormData(formElement);
    let formBody = {};
    for (let [key, value] of formData.entries()) {
      formBody[key] = value;
    }
    formBody = JSON.stringify(formBody);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}sign-up`, {
      ...ops,
      body: formBody,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch.");
    }
    const data = await response.json();
    console.log(data);
  },
};
export default auth;
