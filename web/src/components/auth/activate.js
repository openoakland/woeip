import React from "react";
import { AffirmActionButton } from "../ui";
import { useHistory } from "react-router-dom";
import { verify } from "./utils";

export const Activate = ({ match }) => {
  const history = useHistory();

  const verifyAccount = async (e) => {
    const uid = match.params.uid;
    const token = match.params.token;

    const isVerified = await verify(uid, token);

    if (isVerified) {
      history.push({
        pathname: "/",
      });
    }
  };

  return (
    <div className="activate-container">
      <h2>Verify your account</h2>
      <AffirmActionButton type="button" color="grey" onClick={verifyAccount}>
        Verify
      </AffirmActionButton>
    </div>
  );
};
