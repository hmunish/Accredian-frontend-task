import {
  Button,
  Stack,
  TextField,
  Alert,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import validator from "validator";
import { login, signup } from "../redux/user/userSlice";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [usernameHelperText, setUsernameHelperText] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");

  function isValidUsername() {
    setUsernameError(false);
    setUsernameHelperText("");
    if (username == "") {
      setUsernameError(true);
      setUsernameHelperText("Username is required");
      return false;
    }
    if (!validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
      setUsernameError(true);
      setUsernameHelperText(
        "Invalid Username, only alphabets, numbers & symbols (_ . -) allowed"
      );
      return false;
    }
    return true;
  }

  function isValidEmail() {
    setEmailError(false);
    setEmailHelperText("");
    if (email == "") {
      setEmailError(true);
      setEmailHelperText("Email is required");
      return false;
    }
    if (!validator.isEmail(email)) {
      setEmailError(true);
      setEmailHelperText("Invalid Email Id");
      return false;
    }

    return true;
  }

  function isValidPassword() {
    setPasswordError(false);
    setPasswordHelperText("");
    if (password == "") {
      setPasswordError(true);
      setPasswordHelperText("Password is required");
      return false;
    }
    // Validating password
    if (!validator.isStrongPassword(password)) {
      setPasswordError(true);
      setPasswordHelperText(
        "Enter strong password (minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1)"
      );
      return false;
    }
    return true;
  }

  function isValidConfirmPassword() {
    setConfirmPasswordError(false);
    setConfirmPasswordHelperText("");
    if (confirmPassword == "") {
      setConfirmPasswordError(true);
      setConfirmPasswordHelperText("Confirm Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordHelperText(
        "Confirm Password should match the password"
      );
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validUsername = isValidUsername();
    const validEmail = isValidEmail();
    const validPassword = isValidPassword();
    const validConfirmPassword = isValidConfirmPassword();

    if (
      !validUsername ||
      !validEmail ||
      !validPassword ||
      !validConfirmPassword
    ) {
      return;
    }
    dispatch(signup({ username, email, password })).then((res) => {
      if (!res.error) {
        dispatch(login({ email, password }));
      }
    });
  }

  return (
    <React.Fragment>
      {user.isErrorSignUp && (
        <Alert severity="error">Error signing up: {user.isErrorSignUp}</Alert>
      )}
      {user.isLoadingSignUp && <LinearProgress />}
      <h2>Register Form</h2>
      <form onSubmit={handleSubmit} action={<Link to="/login" />}>
        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}></Stack>
        <TextField
          type="text"
          variant="outlined"
          color="secondary"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          fullWidth
          required
          error={usernameError}
          helperText={usernameHelperText}
          sx={{ mb: 4 }}
        />
        <TextField
          type="email"
          variant="outlined"
          color="secondary"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fullWidth
          required
          error={emailError}
          helperText={emailHelperText}
          sx={{ mb: 4 }}
        />
        <TextField
          type="password"
          variant="outlined"
          color="secondary"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          fullWidth
          error={passwordError}
          helperText={passwordHelperText}
          sx={{ mb: 4 }}
        />
        <TextField
          type="password"
          variant="outlined"
          color="secondary"
          label="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          required
          fullWidth
          error={confirmPasswordError}
          helperText={confirmPasswordHelperText}
          sx={{ mb: 4 }}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Sign Up
        </Button>
      </form>
      <small>
        Already have an account? <Link to="/login">Login Here</Link>
      </small>
    </React.Fragment>
  );
};

export default RegisterForm;
