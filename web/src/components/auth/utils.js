import axios from "axios";
import {
  apiUrlAuthLogin,
  apiUrlAuthLogout,
  apiUrlAuthRegister,
} from "../../api.util";

/**
 *
 * @param {string} email
 * @param {string} password
 * @modifies {API}
 * @returns auth token, response code, and presence of error
 */
export const login = async (email, password) => {
  let token = "";
  let code = 0;
  let errored = false;
  const data = {
    email,
    password,
  };
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
 * @param {string} Authorization
 * @modifies {API}
 * @returns response code, presence of error
 */
export const logout = async (Authorization) => {
  let errored = false;
  let code = 0;
  const options = {
    headers: { Authorization },
  };

  try {
    const response = await axios.post(apiUrlAuthLogout(), options);
    code = response.status;
  } catch {
    errored = true;
  } finally {
    return { code, errored };
  }
};

/**
 *
 * @param {string} email
 * @param {string} password1
 * @param {string} password2
 * @modifies {API}
 * @returns auth token, response code, and presence of error
 */
export const register = async (email, password1, password2) => {
  let token = "";
  let code = 0;
  let errored = false;
  const data = {
    email,
    password1,
    password2,
  };
  try {
    const response = await axios.post(apiUrlAuthRegister(), data);
    code = response.status;
    if (code === 201) token = response.data.key;
  } catch {
    errored = true;
  } finally {
    return { token, code, errored };
  }
};

/**
 * Removes auth token from local storage
 * @modifies {LocalStorage}
 */
export const clearAuthTokenItem = () => localStorage.removeItem("authToken");

/**
 * Retrieve auth token from local storage
 * @returns {string} auth token
 */
export const getAuthTokenItem = () => localStorage.getItem("authToken") ?? "";

/**
 * Place auth token into local storage
 * @param {string} authToken
 * @modifies {LocalStorage}
 */
export const setAuthTokenItem = (authToken) =>
  localStorage.setItem("authToken", authToken);
