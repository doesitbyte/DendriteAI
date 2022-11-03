{/* 
  Component for "/checkoutSuccess" endpoint.
  Checks if user is logged in -> Converts User to Premium User -> Redirect to Home Page
*/}  

import { useState, useEffect } from "react";
import Keycloak from "keycloak-js";
import { MAKE_PREMIUM } from "../graphql/Queries";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const navigate = useNavigate();

  const [makePremium, { dataGetUser, loadingGetUser, errorGetUser }] =
    useMutation(MAKE_PREMIUM);

  useEffect(() => {
    const keycloak = new Keycloak({
      url: process.env.REACT_APP_KEYCLOAK_BASE_URL ,
      realm: process.env.REACT_APP_KEYCLOAK_REALM_ID,
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    });

    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setKeycloak(keycloak);
      setAuthenticated(authenticated);
      keycloak.loadUserProfile().then((profile) => {
        makePremium({
          variables: {
            username: profile.username,
          },
        }).then((result) => {
          navigate("/");
        });
      });
    });
  }, []);

  return <h1>Successful Checkout</h1>;
};

export default CheckoutSuccess;
