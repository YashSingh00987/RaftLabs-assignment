import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "./components/Navbar";
import NewsFeed from "./components/NewsFeed";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import "./index.css";
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSetup from "./components/ProfileSetup";

// import LoginForm from "./components/";
// import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    {" "}
                    <NewsFeed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/profile-setup"
                element={
                  // <ProtectedRoute>
                  <ProfileSetup />
                  // </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}

export default App;
