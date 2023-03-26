import {
  CredentialResponse,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

import GoogleIcon from "./GoogleIcon";
import { getUser, setUser } from "../utils/LocalStorage";
import Loader from "./Loader";

export type User = {
  name: string;
  picture: string;
};

const url = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:8888/.netlify/functions/api";

const savedProfile = getUser()!;

const Login = () => {
  const [profile, setProfile] = useState<User | undefined>(savedProfile);
  const [token, setToken] = useState<string | undefined>();

  const responsMessage = (credentialResponse: CredentialResponse): void => {
    setToken(credentialResponse.credential!);
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const tokens = await axios.post(`${url}/auth/google`, {
        code: codeResponse.code,
      });

      setToken(tokens.data.id_token!);
    },
  });

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    googleLogout();
    setProfile(undefined);
    setToken(undefined);
  };

  useEffect(() => {
    if (token) {
      let userProfile: User | undefined = jwt_decode(token);
      setProfile(userProfile);
    }
  }, [token]);

  useEffect(() => {
    setUser(profile!);
  }, [profile]);

  return (
    <div>
      {!profile ? (
        <>
          <div style={{ position: "absolute", top: "-100%" }}>
            <GoogleLogin
              onSuccess={responsMessage}
              onError={() => {}}
              auto_select={false}
              useOneTap
              cancel_on_tap_outside
            />
          </div>
          <button className="btn login" onClick={login}>
            <GoogleIcon />
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          {token ? (
            <div className="user-container">
              <div className="user-card">
                <div className="user-img">
                  <img src={profile.picture} alt="user image" />
                </div>
                <p className="username">
                  <span>Name : </span> {profile.name}
                </p>
              </div>
              <button className="btn logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Loader />
          )}
        </>
      )}
    </div>
  );
};

export default Login;
