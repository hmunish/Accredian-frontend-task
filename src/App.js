import { AppBar, Button, Toolbar } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { authorizeUser, removeAuthorization } from "./redux/user/userSlice";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authorizeUser());
  }, []);

  if (user.isAuthorized)
    return (
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => dispatch(removeAuthorization())}
      >
        Log out
      </Button>
    );

  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar>Accredian Form</Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </React.Fragment>
  );
}

export default App;
