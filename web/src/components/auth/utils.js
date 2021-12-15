import axios from "axios";
import {
  apiUrlCreateJWTToken,
  apiUrlRegister,
  apiUrlLoadUser,
  apiUrlVerifyToken,
  apiUrlVerifyActivation,
} from "../../api.util";

/**
 * Shape of User stored in database
 * @typeof User
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {int} id
 */

/**
 * Shape of JSON Web Token pair
 * @typeof WebToken
 * @property {string} refresh
 * @property {string} access
 */

/**
 * Stores access token in Local Storage
 * @param {string} access the access token
 */
export const setAccessToken = (access) => {
  localStorage.setItem("access", access);
};

/**
 * Sets access token to null on failure in Local Storage
 *
 */
export const removeTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

/**
 * Retrieves the JWT for the user
 * @param {string} email the user's email
 * @param {string} password the user's password
 * @returns {String []}
 */
export const getJWT = async (email, password) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(apiUrlCreateJWTToken(), body, options);
    return [res.data.access, ""];
  } catch (err) {
    console.error("Logging-in was unsuccessful", err);
    return ["", err];
  }
};

/**
 * Registers a user
 * @param {string} first_name the user's first name
 * @param {string} last_name the user's last name
 * @param {string} email the user's email
 * @param {string} password the user's password
 * @param {string} re_password the second validation of the user's password against the first password
 * @returns {User}
 */
export const register = async (
  first_name,
  last_name,
  email,
  password,
  re_password
) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({
    email,
    first_name,
    last_name,
    password,
    re_password,
  });

  try {
    const res = await axios.post(apiUrlRegister(), body, options);
    return { success: res.data };
  } catch (err) {
    console.error("Registering was unsuccessful", err);
    return { success: false };
  }
};

/**
 * 
 * @returns
 */
export const verify = async (uid, token) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token });

  try {
    const res = await axios.post(apiUrlVerifyActivation(), body, options);
    return { success: res.data };
  } catch (err) {
    console.error("Verification failed", err);
    return { success: false };
  }
};

/**
 * Checks user authentication
 * @param {string} token
 * @returns {boolean}
 */
export const checkAuthenticated = async (token) => {
  if (token) {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const body = JSON.stringify({ token });

    try {
      const res = await axios.post(apiUrlVerifyToken(), body, options);
      if (res.data && res.data.code !== "token_not_valid") {
        return true;
      } else {
        console.error("Token is invalid", res);
        return false;
      }
    } catch (err) {
      console.error("Authentication failed", err);
      return false;
    }
  } else {
    console.error("Authentication failed: no access token");
    return false;
  }
};

/**
 * Loads a user
 * @param {string} token
 * @returns {User}
 */
export const loadUser = async (token) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
      Accept: "application/json",
    },
  };
  try {
    const res = await axios.get(apiUrlLoadUser(), options);
    return { success: res.data };
  } catch (err) {
    console.error("Loading user was unsuccessful", err);
    return { success: false };
  }
};
