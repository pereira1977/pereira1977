import { Box } from "@material-ui/core";
import "./Landing.scss";
import LPBox from "src/components/LPBox/LPBox";
import { useState, useEffect } from 'react'
import { useAddress } from "../../hooks";
import { SHIBAKING_ADDR, SHIBAKING_BNB_ADDR, FARMING_ADDR } from '../../abis/address'
import ERC20ABI from '../../abis/ERC20ABI.json';
import PancakePairABI from '../../abis/PancakePairABI.json'
import FarmingABI from '../../abis/FarmingABI.json';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWeb3Context } from '../../hooks';

let timerid = null;
function Landing() {
    const account = useAddress();
    const [farms, setFarms] = useState([{}, {}, {}]);

    async function fetchData() {
        const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
        const lpTokenContract = new ethers.Contract(SHIBAKING_BNB_ADDR, PancakePairABI, provider);

        const farmingContract = new ethers.Contract(FARMING_ADDR, FarmingABI, provider);
        const reserves = await lpTokenContract.getReserves();
        const totalSupply = await lpTokenContract.totalSupply() / Math.pow(10, 18);
        let price = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/0xaFb64E73dEf6fAa8B6Ef9a6fb7312d5C4C15ebDB`);
        price = price.data.data;
        const totalLiquidity = (price.price * reserves[0] / Math.pow(10, 18) + price.price / price.price_BNB * reserves[1] / Math.pow(10, 18))
        console.log(totalLiquidity);
        price = 2 * Math.sqrt(reserves[0] / Math.pow(10, 18) * reserves[1] / Math.pow(10, 18)) *
            Math.sqrt(price.price * price.price / price.price_BNB) / totalSupply;
        console.log(price);

        let allowance = 0, balance = 0;
        if (account) {
            allowance = await lpTokenContract.allowance(account, FARMING_ADDR) / Math.pow(10, 18);
            balance = await lpTokenContract.balanceOf(account) / Math.pow(10, 18);
        }
        let temp = [];
        for (let i = 0; i < 3; i++) {
            const poolInfo = await farmingContract.pools(i);
            const depositFee = poolInfo.depositFee / 1;
            const withdrawFee = poolInfo.withdrawFee / 1;
            const totalStaked = poolInfo.totalStaked / Math.pow(10, 18);
            let withdrawableAmount = 0, pendingReward = 0, stakedAmount = 0, claimableReward = 0;
            if (account) {

                const amount1 = await farmingContract.withdrawableAmount(i, account);
                stakedAmount = amount1[0] / Math.pow(10, 18);
                withdrawableAmount = amount1[1] / Math.pow(10, 18);
                const amount2 = await farmingContract.pendingReward(i, account);
                pendingReward = amount2[0] / Math.pow(10, 18);
                claimableReward = amount2[1] / Math.pow(10, 18);
            }

            temp.push({
                depositFee,
                withdrawFee,
                price,
                allowance,
                stakedAmount,
                withdrawableAmount,
                pendingReward,
                claimableReward,
                totalStaked,
                balance,
                totalLiquidity
            });
        }
        console.log(temp);
        setFarms(temp);
    }

    useEffect(() => {
        fetchData();
        if (timerid) clearInterval(timerid);
        timerid = setInterval(function () {
            fetchData();
        }, 10000)
    }, [account])
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
                    <LPBox APY={'32%'} duration={'15'} farm={farms[0]} index={0} fetchData={fetchData}></LPBox>
                    <LPBox APY={'115%'} duration={'30'} farm={farms[1]} index={1} fetchData={fetchData}></LPBox>
                    <LPBox APY={'235%'} duration={'60'} farm={farms[2]} index={2} fetchData={fetchData}></LPBox>
                </Box>
            </Box>
        </div>
    );
}

export default Landing;
