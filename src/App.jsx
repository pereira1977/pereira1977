import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback, useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Hidden, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { storeQueryParameters } from "./helpers/QueryParameterHelper";

import { Home, Stake, ChooseBond, Bond, Dashboard, TreasuryDashboard, Presale, Landing } from "./views";
import Pool from "./views/Pool";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import Messages from "./components/Messages/Messages";
import Tracker from './views/Swap/Swap'

import { dark as darkTheme } from "./themes/dark.js";
import { ethers } from "ethers";
import axios from "axios";

import "./style.scss";
import Footer from "./components/Footer/Footer";


// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 0;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    paddingTop: '40px',
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    background: "#292929",
    backgroundSize: "cover",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));



let trackerid = null, txid = null, poolid = null;

function App() {
  useGoogleAnalytics();
  useSegmentAnalytics();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const history = useHistory();
  const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();
  const address = useAddress();

  const [walletchecked, setWalletChecked] = useState(null);

  const [dividendInfo, setDividendInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [withdrawn, setWithdrawn] = useState(null);
  const [tokentxlist, setTokenTxList] = useState(null);
  const [reserves, setReserves] = useState(null);
  const [payouttxlist, setPayoutTxList] = useState(null);
  const [tokenwholetxlist, setTokenWholeTxList] = useState(null);

  const [manuallockdata, setManualLockData] = useState({});
  const [lockdata, setLockData] = useState([{}, {}]);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
    storeQueryParameters();
  }, []);



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode = theme === "light" ? darkTheme : theme === "dark" ? darkTheme : darkTheme;

  useEffect(() => {
    themeMode = theme === "light" ? darkTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);
  const path = useMemo(() => window.location.pathname, [window.location.pathname]);

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        {/* {isAppLoading && <LoadingSplash />} */}
        <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} light`}>
          <Messages />
          {path === "/" ? null : (
            <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
          )}
          {path === "/" ? null : (
            <nav className={classes.drawer}>
              {isSmallerScreen ? (
                <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
              ) : (
                <Sidebar />
              )}
            </nav>
          )}

          <div className={`${path === "/" ? null : classes.content} ${isSmallerScreen && classes.contentShift}`}>
            <Switch>

              <Route exact path="/landing">
                <Landing />
              </Route>


              <Route exact path="/">
                <Redirect to="landing" />
              </Route>
            </Switch>
          </div>

          <Footer></Footer>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
