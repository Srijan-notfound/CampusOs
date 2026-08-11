import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Navbar />

      <div className="ml-64">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;