import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import TotalProducts from "./pages/TotalProducts";
import { AnimatePresence } from "framer-motion";
import { useStateValue } from "./context/StateProvider";

function App() {
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();
  return (
    <AnimatePresence exitBeforeEnter>
      <div>
        <Routes>
          <Route path="/" element={<Signin />} />

          <Route path="/signup" element={<Signup />} />

          {state.user.token && state.user.token !== "NA" ? (
            <Route path="/products" element={<TotalProducts />} />
          ) : (
            <Route path="/products" element={<Signin />} />
          )}

          <Route path="*" element={<Signin />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default App;
