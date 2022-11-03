{
  /* 
  Component for "/" endpoint.
  Checks if user is logged in -> Renders Todo List and respective functionality
*/
}

import { useState, useEffect } from "react";
import Keycloak from "keycloak-js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../graphql/Queries";
import ListTodo from "./ListTodo";
import { CreateTodo, UpdateTodo } from "./CreateTodo";

import getStripe from "../getStripe";

const Home = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [userPremium, setUserPremium] = useState(false);
  const [updateTodoId, setUpdateTodoId] = useState(null);
  const [refresh, setRefresh] = useState(true);

  const [addUser, { dataGetUser, loadingGetUser, errorGetUser }] =
    useMutation(ADD_USER);

  const refreshList = () => {
    // Function to force refresh component from child components
    setRefresh(!refresh);
  };

  useEffect(() => {
    const keycloak = new Keycloak({
      url: process.env.REACT_APP_KEYCLOAK_BASE_URL,
      realm: process.env.REACT_APP_KEYCLOAK_REALM_ID,
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    });

    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setKeycloak(keycloak);
      setAuthenticated(authenticated);
      localStorage.setItem("token", keycloak.token);
      keycloak.loadUserProfile().then((profile) => {
        setUserProfile(profile);
        addUser({
          variables: {
            username: profile.username,
          },
        }).then((result) => {
          setUserPremium(result.data.add_user.user.premium);
        });
      });
    });
  }, []);

  const logout = () => {
    // Function to handle user logout
    keycloak.logout({
      redirectUri: process.env.REACT_APP_REDIRECT_URL_HOME,
    });
  };

  async function handleCheckout() {
    // Function to handle stripe payment checkout
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: process.env.REACT_APP_STRIPE_PRODUCT_KEY,
          quantity: 1,
        },
      ],
      mode: "subscription",
      successUrl: process.env.REACT_APP_REDIRECT_URL_SUCCESSCHECKOUT,
      cancelUrl: process.env.REACT_APP_REDIRECT_URL_ERRORCHECKOUT,
    });
    console.warn(error.message);
  }

  if (keycloak) {
    if (authenticated && userProfile.username) {
      console.log(userProfile);
      return (
        <div>
          <h1>
            Hello, {userProfile.firstName}{" "}
            {userPremium ? "(Premium User)" : "(Non Premium User)"}{" "}
          </h1>
          <Button
            variant="danger"
            onClick={logout}
            style={{ display: "block", margin: "auto" }}
          >
            LOGOUT
          </Button>
          <Container
            style={{
              marginTop: "2rem",
            }}
          >
            <Row>
              <Col>
                <ListTodo
                  username={userProfile.username}
                  premium={userPremium}
                  updateIdToggle={setUpdateTodoId}
                />
              </Col>
              <Col>
                {updateTodoId && (
                  <UpdateTodo
                    username={userProfile.username}
                    premium={userPremium}
                    id={updateTodoId}
                    refresh={refreshList}
                  />
                )}
                {!updateTodoId && (
                  <CreateTodo
                    username={userProfile.username}
                    premium={userPremium}
                    refresh={refreshList}
                  />
                )}
              </Col>
            </Row>
            {!userPremium ? (
              <Button
                variant="success"
                onClick={handleCheckout}
                style={{ display: "block", margin: "1rem auto" }}
              >
                Upgrade to Premium
              </Button>
            ) : (
              ""
            )}
          </Container>
        </div>
      );
    } else {
      return <h1>Unable to log in with keycloak!</h1>;
    }
  } else {
    return <h1>Keycloak is initializing...</h1>;
  }
};

export default Home;
