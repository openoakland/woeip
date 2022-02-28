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
  console.log(options);
  axios.post(apiUrlAuthLogin(), data);
};
