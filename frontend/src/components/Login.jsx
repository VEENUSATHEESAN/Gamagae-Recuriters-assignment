import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", credentials);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/auth/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 animate-gradient-x">
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl rounded-2xl bg-white border-0 transform hover:scale-105 transition-transform duration-300">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">
                      Admin Login
                    </h2>
                  </div>
                  <hr className="mt-6 border-b-1 border-gray-300" />
                </div>

                <div className="flex-auto px-8 lg:px-10 py-10 pt-0">
                  <form onSubmit={handleTraditionalLogin} className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        placeholder=" "
                        value={credentials.username}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer"
                        required
                      />
                      <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Username
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        placeholder=" "
                        value={credentials.password}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer"
                        required
                      />
                      <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="ml-2">Loading...</span>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>

                  <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500">OR</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => alert("Google login failed")}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
