import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Notifications from "./pages/Notifications";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import AIAssistant from "./pages/AIAssistant";
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <Navbar />

      <div className="ml-64">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />}
          /> <Route path="/notifications"
    element={<Notifications />}/>
    <Route path="/ai" element={<AIAssistant />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={<ProtectedLayout />}
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;