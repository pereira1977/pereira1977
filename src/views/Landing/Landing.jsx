import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./Landing.scss";
import { Skeleton } from "@material-ui/lab";
import LPBox from "src/components/LPBox/LPBox";

function Landing() {
    // Use marketPrice as indicator of loading.
    //   const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
    //   const marketPrice = useSelector(state => {
    //     return state.app.marketPrice;
    //   });
    //   const circSupply = useSelector(state => {
    //     return state.app.circSupply;
    //   });
    //   const totalSupply = useSelector(state => {
    //     return state.app.totalSupply;
    //   });
    //   const marketCap = useSelector(state => {
    //     return state.app.marketCap;
    //   });

    return (
        <div id="landing-view">
            <Box className="title-box">
                <Box className="title-box-view">
                    <h1>FARM</h1>
                    <h2>Stake LP to earn Shiba King.</h2>
                </Box>
            </Box>

            <Box className="warning-box">
                <svg viewBox="0 0 24 24" className="warning-box-icon" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M4.47 20.9999H19.53C21.07 20.9999 22.03 19.3299 21.26 17.9999L13.73 4.98993C12.96 3.65993 11.04 3.65993 10.27 4.98993L2.74 17.9999C1.97 19.3299 2.93 20.9999 4.47 20.9999ZM12 13.9999C11.45 13.9999 11 13.5499 11 12.9999V10.9999C11 10.4499 11.45 9.99993 12 9.99993C12.55 9.99993 13 10.4499 13 10.9999V12.9999C13 13.5499 12.55 13.9999 12 13.9999ZM13 17.9999H11V15.9999H13V17.9999Z"></path></svg>
                <Box className="warning-box-title">WARNING:</Box>
                <Box className="warning-box-message1">
                    STAKING POOL SHIBA KING START SOON
                </Box>
                <Box className="warning-box-message2">
                    Contact an administrator with any questions or concerns.
                </Box>
            </Box>

            <Box className="lp-container">
                <Box className="lp-boxes">
                    <LPBox APY={'32%'} duration={'15'}></LPBox>
                    <LPBox APY={'115%'} duration={'30'}></LPBox>
                    <LPBox APY={'235%'} duration={'60'}></LPBox>
                </Box>
            </Box>
        </div>
    );
}

export default Landing;
