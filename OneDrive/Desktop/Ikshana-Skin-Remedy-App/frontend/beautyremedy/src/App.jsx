import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Home from "./Home/Home";
import AddRemedy from "./AddRemedy/AddRemedy";
import MyRemedy from "./MyRemedy/MyRemedy";
import EditRemedy from "./EditRemedy/EditRemedy";
import Favorites from "./Favorites/Favorites";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navigation from "./Navigation/Navigation";
import Landing from "./Landing/Landing"; 
import SearchResults from "./SearchResults/SearchResults"; 
import ViewDetails from "./ViewDetails/ViewDetails"; 

// ✅ Private Route Wrapper (Redirects Back After Login)
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();  // ✅ Get current page

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/add-remedy" element={<PrivateRoute><AddRemedy /></PrivateRoute>} />
          <Route path="/myremedies" element={<PrivateRoute><MyRemedy /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/edit-remedy/:id" element={<PrivateRoute><EditRemedy /></PrivateRoute>} />
          <Route path="/search-results" element={<PrivateRoute><SearchResults /></PrivateRoute>} /> 
          <Route path="/view-details/:id" element={<PrivateRoute><ViewDetails /></PrivateRoute>} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
