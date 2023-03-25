import type { User } from "../components/Login";

export const getUser = () => {
  try {
    const serialUser = localStorage.getItem("google-user");
    if (!serialUser) {
      return undefined;
    }
    return JSON.parse(serialUser);
  } catch (err) {
    return undefined;
  }
};

export const setUser = (user: User) => {
  try {
    localStorage.setItem("google-user", JSON.stringify(user));
  } catch (err) {
    console.log(err);
  }
};
