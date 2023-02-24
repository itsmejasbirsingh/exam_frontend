import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Axios from "axios";
import { BASE_URL } from "../utils/Config";
import { showError } from "../utils/Error";
import jwt_decode from "jwt-decode";

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const getTokens = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tokens = await Axios.post(`${BASE_URL}base/token/`, {
        username: e.target.username.value,
        password: e.target.password.value,
      });
      setLoading(false);
      localStorage.setItem("accessToken", tokens.data.access);
      localStorage.setItem("refreshToken", tokens.data.refresh);
      localStorage.setItem("isAdmin", jwt_decode(tokens.data.access).is_admin);
    } catch (e) {
      alert(showError(e.response));
      setLoading(false);
    }
  };

  const fetchAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        setLoading(true);
        const tokens = await Axios.post(`${BASE_URL}base/token/refresh/`, {
          refresh: refreshToken,
        });
        setLoading(false);
        localStorage.setItem("accessToken", tokens.data.access);
        localStorage.setItem("refreshToken", tokens.data.refresh);
        localStorage.setItem(
          "isAdmin",
          jwt_decode(tokens.data.access).is_admin
        );
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
          alignItems: "center",
        }}
      >
        Loading...
      </div>
    );

  if (!localStorage.getItem("accessToken")) {
    return (
      <form
        onSubmit={getTokens}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
          alignItems: "center",
        }}
      >
        <h4>Login</h4>
        <input type="text" name="username" required placeholder="Username" />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          style={{ marginTop: 10 }}
        />
        <input type="submit" style={{ marginTop: 10 }} />
      </form>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={2} style={{ background: "#262525", height: "100vh" }}>
          <Box style={{ marginTop: 50, marginLeft: 30 }}>
            {localStorage.getItem("isAdmin") === "true" ? (
              <>
                <Link to="/courses">
                  <Typography style={{ color: "#ffffff" }}>Courses</Typography>
                </Link>
                <Link to="/difficulty-levels">
                  <Typography style={{ color: "#ffffff" }}>
                    Difficulty Levels
                  </Typography>
                </Link>
                <Link to="/questions">
                  <Typography style={{ color: "#ffffff" }}>
                    Questions
                  </Typography>
                </Link>
                <Link to="/tests">
                  <Typography style={{ color: "#ffffff" }}>
                    Test Papers
                  </Typography>
                </Link>
                <Link to="/users">
                  <Typography style={{ color: "#ffffff" }}>Users</Typography>
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-tests">
                  <Typography style={{ color: "#ffffff" }}>My Tests</Typography>
                </Link>
              </>
            )}

            <Button
              style={{ position: "absolute", bottom: 50 }}
              variant="contained"
              color="error"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("isAdmin");
                window.location.href = "/";
              }}
            >
              Logout
            </Button>
          </Box>
        </Grid>
        <Grid item lg={10}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminLayout;
