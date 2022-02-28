import axios from "axios";
import { apiUrlAuthLogin } from "../../api.util";

/**
 *
 * @param {*} email
 * @param {*} password
 * @returns
 */
export const login = async (email, password) => {
  let token = "";
  let code = 100;
  let errored = false;
  const data = {
    email,
    password,
  };
  const options = {
    headers: { "Content-Type": "application/json" },
    data,
  };
  console.log(options);
  try {
    const response = await axios.post(apiUrlAuthLogin(), data);
    code = response.status;
    if (code === 200) token = response.data.key;
  } catch {
    errored = true;
  } finally {
    return { token, code, errored };
  }
};

/**
 *
 * @modifies
 */
export const clearAuthTokenItem = () => localStorage.removeItem("authToken");

/**
 *
 * @returns {string} auth token
 */
export const getAuthTokenItem = () => localStorage.getItem("authToken");

/**
 *
 * @param {string} authToken
 * @modifies
 */
export const setAuthTokenItem = (authToken) =>
  localStorage.setItem("authToken", authToken);
