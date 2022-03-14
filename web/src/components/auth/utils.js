import axios from "axios";
import {
  apiUrlAuthLogin,
  apiUrlAuthLogout,
  apiUrlAuthRegister,
  authTokenHeaderFormat,
} from "../../api.util";

/**
 *
 * @param {string} email
 * @param {string} password
 * @modifies {API}
 * @returns {string} auth token
 */
export const login = async (email, password) => {
  let token = "";
  const data = {
    email,
    password,
  };
  try {
    const response = await axios.post(apiUrlAuthLogin(), data);
    token = response.data.key ?? "";
  } finally {
    return { token };
  }
};

/**
 *
 * @param {string} authToken
 * @modifies {API}
 * @returns response code, presence of error
 */
export const logout = async (authToken) => {
  let errored = false;
  let code = 0;
  const options = {
    headers: { Authorization: authTokenHeaderFormat(authToken) },
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
 * @returns {string} auth token
 */
export const register = async (email, password1, password2) => {
  let token = "";
  const data = {
    email,
    password1,
    password2,
  };
  try {
    const response = await axios.post(apiUrlAuthRegister(), data);
    token = response.data.key ?? "";
  } finally {
    return { token };
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
