import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
