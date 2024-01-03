import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../LoginPage";
import ContactPage from "../ContactPage";
import WithAuth from "../HOC/WithAuth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          index
          path="/"
          exact
          element={
            <WithAuth>
              <ContactPage />
            </WithAuth>} />
        <Route
          path="/login"
          exact
          element={<LoginPage />}
        />
      </Routes>
    </Router>)
}

export default App;