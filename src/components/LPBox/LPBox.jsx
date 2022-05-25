import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useWeb3Context } from "../../hooks";

import styled from 'styled-components'

import "./LPBox.scss";
import ConnectMenu from "../TopBar/ConnectMenu";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
    appBar: {
        [theme.breakpoints.up("sm")]: {
            width: "100%",
            padding: "10px",
        },
        justifyContent: "flex-end",
        alignItems: "flex-end",
        background: "transparent",
        backdropFilter: "none",
        zIndex: 10,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("981")]: {
            display: "none",
        },
    },
}));

function LPBox({ theme, APY, duration }) {
    const [show_details, setsShowDetails] = useState(false);
    const { connect, disconnect, connected, web3, chainID } = useWeb3Context();

    return (
        <Box className="lp-box">
            <Box className="lp-box-content">
                <Box className="lp-box-content-top">
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'12px'}>
                        <Box className="image-content">
                            <img src={'./images/bnb.png'} width='32' height='32' />
                            <img src={'./logo.png'} width='50' height='50' />
                        </Box>
                        <Box className="token-name">
                            SHIBA KING-BNB
                        </Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box className={'attr_title'}>APR:</Box>
                        <Box className={'attr_cont'} display={'flex'} alignItems={'center'}>
                            {APY}
                            <Box className="percentage_But">
                                <svg viewBox="0 0 24 24" width="18px" color="text" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvtL cQhkZ"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"></path><path d="M11.25 7.72H6.25V9.22H11.25V7.72Z"></path><path d="M18 15.75H13V17.25H18V15.75Z"></path><path d="M18 13.25H13V14.75H18V13.25Z"></path><path d="M8 18H9.5V16H11.5V14.5H9.5V12.5H8V14.5H6V16H8V18Z"></path><path d="M14.09 10.95L15.5 9.54L16.91 10.95L17.97 9.89L16.56 8.47L17.97 7.06L16.91 6L15.5 7.41L14.09 6L13.03 7.06L14.44 8.47L13.03 9.89L14.09 10.95Z"></path></svg>
                            </Box>
                        </Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box className={'attr_title'}>Earn:</Box>
                        <Box className={'attr_cont'} display={'flex'} alignItems={'center'}>
                            Shiba King
                        </Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} marginTop={'0.75rem'}>
                        <Box className={'attr_title'}>Withdraw Lock:</Box>
                        <Box className={'lock_amount'} display={'flex'} alignItems={'center'}>
                            <svg viewBox="0 0 330 330" width="12px" color="secondary" xmlns="http://www.w3.org/2000/svg" class="key"><path d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80.001,38.131,80.001,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M110.001,85 c0-30.327,24.673-55,54.999-55c30.327,0,55,24.673,55,55v45H110.001V85z"></path></svg>
                            {duration}
                        </Box>
                    </Box>

                    <Box paddingTop={'16px'}>
                        <Box display={'flex'} alignItems={'center'}>
                            <span className={'attr_title_s_l'}>{'shiba king'}</span>
                            <span className={'attr_title_s_d'}>{' earned'}</span>
                        </Box>

                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} height={'65px'} marginBottom={'8px'}>
                            <span className={'attr_lock_amount'}>0.000</span>
                            <button disabled className={'attr_lock_but'}>Harvest</button>
                        </Box>

                        <Box display={'flex'} alignItems={'center'}>
                            <span className={'attr_title_s_l'}>{'shiba king-bnb'}</span>
                            <span className={'attr_title_s_d'}>{' staked'}</span>
                        </Box>

                        {!connected ? <Box marginTop={'8px'}>
                            <ConnectMenu bigType={true} theme={theme} />
                        </Box> : ''
                        }
                    </Box>

                </Box>

                <Box className="lp-box-content-bottom">
                    <DetailsBox showType={show_details} className={'lp-box-details-text'} onClick={() => setsShowDetails(!show_details)}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Box>{show_details ? 'Hide' : 'Details'}</Box>
                            <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvtL cQhkZ"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                        </Box>
                        {show_details &&
                            <Box marginTop={'24px'}>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Box className={'attr_text'}>Total SHIBA KING-BNB Staked:</Box>
                                    <Box className={'attr_text'}>17,031.00528</Box>
                                </Box>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Box className={'attr_text'}>Total liquidity:</Box>
                                    <Box className={'attr_text'}>$8,821.99</Box>
                                </Box>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Box className={'attr_text'}>Deposit Fee:</Box>
                                    <Box className={'attr_text'}>-</Box>
                                </Box>

                                <Box marginTop={'1rem'}>
                                    <Box className={'attr_view'}>
                                        <Link href={'https://pancakeswap.finance/add/BNB/0x7AE5709c585cCFB3e61fF312EC632C21A5F03F70'}>
                                            {"Get SHIBA KING-BNB"}
                                            <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvtL golKGe"><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                        </Link>
                                    </Box>

                                    <Box className={'attr_view'}>
                                        <Link href={'https://bscscan.com/address/0x5a90F5a2762848DB2E62a857fC34c51176BC8691'}>
                                            {"View Contract"}
                                            <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvtL golKGe"><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                        </Link>
                                    </Box>

                                    <Box className={'attr_view'}>
                                        <Link href={'https://pancakeswap.finance/info/pool/0x0Ddc6cE1ba3fC706edb1d5EF9fac90E73185903a'}>
                                            {"See Pair Info"}
                                            <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvtL golKGe"><path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path></svg>
                                        </Link>
                                    </Box>
                                </Box>
                            </Box>}
                    </DetailsBox>
                </Box>
            </Box>
        </Box>
    );
}

const DetailsBox = styled(Box)`
    > svg {
        ${({ showType }) => showType ? 'transform: rotate(180deg)' : ''};
    }
`;

export default LPBox;

