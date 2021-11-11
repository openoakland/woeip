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
 * Shape of JWT Web Token pair
 * @typeof WebToken
 * @property {string} refresh
 * @property {string} access
 */

/**
 * Stores access token in Local Storage
 * @param {string} access the access token
 */
const setAccessTokenOnSuccess = (access) => {
  localStorage.setItem("access", access);
};

/**
 * Sets access token to null on failure in Local Storage
 *
 */
const setTokensOnFailure = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

/**
 * Logs-in a user
 * @param {string} email the user's email
 * @param {string} password the user's password
 * @returns {boolean}
 */
export const login = async (email, password) => {
<<<<<<< HEAD
  // debugger;
=======
>>>>>>> fix login page
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(apiUrlCreateJWTToken(), body, options);
    let isAuthenticated = false;
    if (res && res.data && res.data.access) {
      isAuthenticated = checkAuthenticated(res.data.access);
    }
    if (isAuthenticated) {
      setAccessTokenOnSuccess(res.data.access);
      loadUser(res.data.access);
    }
    return isAuthenticated;
  } catch (err) {
    console.error("Logging-in was unsuccessful", err);
    setTokensOnFailure();
  }
};

/**
 * Registers a user
 * @param {string} firstName the user's first name
 * @param {string} lastName the user's last name
 * @param {string} email the user's email
 * @param {string} password the user's password
 * @param {string} rePassword the second validation of the user's password against the first password
 * @returns {User}
 */
export const register = async (
  firstName,
  lastName,
  email,
  password,
  rePassword
) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({
    firstName,
    lastName,
    email,
    password,
    rePassword,
  });

  try {
    const res = await axios.post(apiUrlRegister(), body, options);
    return { success: res.data };
  } catch (err) {
    console.error("Registering was unsuccessful", err);
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
    }
  } else {
    console.error("Authentication failed: no access token");
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
    await axios.get(apiUrlLoadUser(), options);
  } catch (err) {
    console.error("Loading user was unsuccessful", err);
  }
};

/**
 * Logs-out a user
 */
export const logout = async () => {
  try {
    localStorage.removeItem("access");
  } catch (err) {
    console.error("Logging-out was unsuccessful", err);
  }
};
