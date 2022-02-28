import axios from "axios";
import { apiUrlAuthLogin } from "../../api.util";

export const login = (username, password) => {
  const data = {
    username,
    password,
  };
  const options = {
    headers: { "Content-Type": "application/json" },
    data,
  };
  axios.post(apiUrlAuthLogin(), options);
};
