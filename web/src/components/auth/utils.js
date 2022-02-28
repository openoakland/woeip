import axios from "axios";
import { apiUrlAuthLogin, apiUrlAuthLogout } from "../../api.util";

/**
 *
 * @param {*} email
 * @param {*} password
 * @modifies
 * @returns
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
 * @param {*} Authorization 
 * @modifies
 * @returns 
 */
export const logout = async (Authorization) => {
  let errored = false;
  let code = 0;
  const options = {
    headers: {Authorization}
  }

  try{
    const response = await axios.post(apiUrlAuthLogout(), options);
    code = response.status;
  } catch {
    errored = true;
  } finally {
    return {code, errored};
  }
}

/**
 *
 * @modifies
 */
export const clearAuthTokenItem = () => localStorage.removeItem("authToken");

/**
 *
 * @returns {string} auth token
 */
export const getAuthTokenItem = () => localStorage.getItem("authToken") ?? '';

/**
 *
 * @param {string} authToken
 * @modifies
 */
export const setAuthTokenItem = (authToken) =>
  localStorage.setItem("authToken", authToken);
