import React, { useState } from "react";
import { TextField, Button, Alert, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/user/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setEmailError(false);
    setEmailHelperText("");

    setPasswordError(false);
    setPasswordHelperText("");

    if (email == "") {
      setEmailError(true);
      return setEmailHelperText("Email required");
    }
    if (password == "") {
      setPasswordError(true);
      return setPasswordHelperText("Password required");
    }

    dispatch(login({ email, password }));
  };

  return (
    <React.Fragment>
      {user.isErrorLogin && (
        <Alert severity="error">Error logging in: {user.isErrorLogin}</Alert>
      )}
      {user.isLoadingLogin && <LinearProgress />}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Login Form</h2>
        <TextField
          label="Email or Username"
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          fullWidth
          value={email}
          error={emailError}
          helperText={emailHelperText}
        />
        <TextField
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          color="secondary"
          type="password"
          value={password}
          error={passwordError}
          helperText={passwordHelperText}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Login
        </Button>
      </form>
      <small>
        Need an account? <Link to="/">Register here</Link>
      </small>
    </React.Fragment>
  );
};

export default Login;
