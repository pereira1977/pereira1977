
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation, useHistory } from "react-router-dom";

import { Landing } from "./views";
import TopBar from "./components/TopBar/TopBar.jsx";
import Messages from "./components/Messages/Messages";

import "./style.scss";
import Footer from "./components/Footer/Footer";


// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

function App() {
  return (
    <Router>

      <Messages />
      <TopBar />


      <Switch>

        <Route exact path="/farms">
          <Landing />
        </Route>


        <Route exact path="/">
          <Redirect to="farms" />
        </Route>
      </Switch>

      <Footer></Footer>
    </Router >
  );
}

export default App;
