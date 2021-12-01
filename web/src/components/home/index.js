import React, { useEffect, useState } from "react";
import { Container } from "../ui";
import { Login } from "../auth/login";
import "./index.css";

export const Home = () => {
  const [activeUser, setActiveUser] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("access");

    access ? setActiveUser(true) : setActiveUser(false);
  }, []);

  return (
    <Container textAlign="center">
      <h2>Welcome to West Oakland Air Quality!</h2>
      {!activeUser && <Login />}
    </Container>
  );
};
