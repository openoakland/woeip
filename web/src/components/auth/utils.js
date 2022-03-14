import axios from "axios";
import {
  apiUrlAuthLogin,
  apiUrlAuthLogout,
  apiUrlAuthRegister,
  authTokenHeaderFormat,
} from "../../api.util";

/**
 * Request to start user session and receive auth token
 * @param {string} email
 * @param {string} password
 * @modifies {API}
 * @returns {{token: string}} auth token
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
 * Request to end user session
 * @param {string} authToken
 * @modifies {API}
 * @returns {{succeeded: boolean}}
 */
export const logout = async (authToken) => {
  const options = {
    headers: { Authorization: authTokenHeaderFormat(authToken) },
  };
  try {
    await axios.post(apiUrlAuthLogout(), options);
    return { succeeded: true}
  } catch {
    return { succeeded: false };
  }
};

/**
 * Request to create user, start user session, and receive auth token
 * @param {string} email
 * @param {string} password1
 * @param {string} password2
 * @modifies {API}
 * @returns {{token: string}} auth token
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
