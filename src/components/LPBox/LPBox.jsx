import { Box } from "@material-ui/core";
import { useWeb3Context } from "../../hooks";

import styled from 'styled-components'
import { ethers } from "ethers";

import "./LPBox.scss";
import ConnectMenu from "../TopBar/ConnectMenu";
import { useEffect, useState } from "react";
import Modal from 'react-modal'
import { AiOutlineClose } from 'react-icons/ai'
import { MdOutlineSwapVert } from 'react-icons/md';
import { FiArrowDown } from 'react-icons/fi';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaChevronDown } from "react-icons/fa";
import { BiLinkExternal } from 'react-icons/bi'
import { Link } from "react-router-dom";
import { FARMING_ADDR, SHIBAKING_BNB_ADDR } from "../../abis/address";
import PancakePairABI from '../../abis/PancakePairABI.json'
import FarmingABI from '../../abis/FarmingABI.json';
import { Skeleton } from "@material-ui/lab";

const customStyles = {
    content: {
        top: 'calc(50% )',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        maxHeight: '100vh',
        width: '100%',
        maxWidth: '345px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Kanit',
        borderRadius: '32px',
        background: 'rgb(236, 249, 255)',
        border: '1px solid rgb(223, 239, 247)',
        boxShadow: 'rgb(14 14 44 / 10%) 0px 20px 36px -8px, rgb(0 0 0 / 5%) 0px 1px 1px',
        padding: '0'
    },
};

const customStyles1 = {
    content: {
        top: 'calc(50% )',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        maxHeight: '100vh',
        width: '100%',
        maxWidth: '345px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Kanit',
        borderRadius: '32px',
        background: 'rgb(236, 249, 255)',
        border: '1px solid rgb(223, 239, 247)',
        boxShadow: 'rgb(14 14 44 / 10%) 0px 20px 36px -8px, rgb(0 0 0 / 5%) 0px 1px 1px',
        padding: '0'
    },
};

function LPBox({ theme, APY, duration, farm, index, fetchData }) {
    const [show_details, setsShowDetails] = useState(false);
    const [showdetail, setShowDetail] = useState(false);
    const { connect, disconnect, connected, web3, chainID, provider } = useWeb3Context();
    const [modalopen, setModalOpen] = useState(false);
    const [calcshowtype, setCalcShowType] = useState(false);
    const [day, setDay] = useState(1);
    const [pending, setPending] = useState(false);
    const [calcamount, setCalcAmount] = useState(0);

    const [modaldata, setModalData] = useState({ isStake: true, balance: 0 });
    const [amount, setAmount] = useState('0');
    const [open, setOpen] = useState(false);
    const [insufficient, setInsufficient] = useState(false);

    console.log(farm);

    const inputNumberFormat = (str) => {
        if (!str.length) {
            return '0';
        }

        let temp = str.split('.')[0];
        if (temp === '00' || str === '0')
            return '0';
        else if (temp === '0' && str.includes('.'))
            return str
        else
            return (str.replace(/^0+/, ''));
    }
    const onApproveContract = async () => {
        setPending(true);
        try {
            const lpTokenContract = new ethers.Contract(SHIBAKING_BNB_ADDR, PancakePairABI, provider.getSigner());
            const tx = await lpTokenContract.approve(FARMING_ADDR, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
            await tx.wait();
            fetchData();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    const onConfirm = async () => {
        setPending(true);
        try {
            const farmContract = new ethers.Contract(FARMING_ADDR, FarmingABI, provider.getSigner());
            let tx;
            if (modaldata.isStake) {
                tx = await farmContract.deposit(index, ethers.utils.parseEther(amount.toString()));
            }
            else
                tx = await farmContract.withdraw(index, ethers.utils.parseEther(amount.toString()));
            await tx.wait();
            fetchData();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    const onHarvest = async () => {
        setPending(true);
        try {
            const farmContract = new ethers.Contract(FARMING_ADDR, FarmingABI, provider.getSigner());
            const tx = await farmContract.claim(index);
            await tx.wait();
            fetchData();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    useEffect(() => {
        if (amount / 1 < 0 || amount / 1 > modaldata.balance)
            setInsufficient(true);
        else setInsufficient(false);
    }, [amount])
    return (
        <Box className="lp-box">
            <Modal
                isOpen={modalopen > 0}
                onRequestClose={() => setModalOpen(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <ModalHeader>
                    <Box color={'rgb(21,110,155)'} fontSize={'20px'} fontWeight={'600'}>ROI Calculator</Box>
                    <Box height={'48px'} display={'flex'} justifyContent={'center'} alignItems={'center'} onClick={() => setModalOpen(false)}>
                        <AiOutlineClose color={'rgb(239, 183, 0)'} fontSize={'18px'} cursor={'pointer'} />
                    </Box>
                </ModalHeader>
                <ModalBody>
                    <Box color={'rgb(85, 176, 221)'} fontWeight={600} fontSize={'12px'} >SHIBA KING-BNB STAKED</Box>
                    <InputPanel>
                        <Box width={'100%'} mr={'15px'} >
                            <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
                                <CustomInput type="number" style={{ width: calcshowtype ? '100px' : '200px' }}
                                    onKeyPress={(event) => {
                                        if ((event?.key === '-' || event?.key === '+')) {
                                            event.preventDefault();
                                        }
                                    }}
                                    value={calcamount}
                                    onChange={(event) => {
                                        if (event.target.value / 1 < 0)
                                            return;
                                        setCalcAmount(inputNumberFormat(event.target.value));
                                    }} />
                                <Box fontSize={'16px'} color={'rgb(21, 110, 155)'} width={calcshowtype ? '120px' : 'unset'}>{!calcshowtype ? 'USD' : 'SHIBAKING-BNB'}</Box>
                            </Box>
                            <Box fontSize={'12px'} textAlign={'right'} color={'rgb(50, 111, 174)'}>
                                {calcshowtype ? calcamount * farm.price : calcamount / farm.price} {calcshowtype ? 'USD' : 'SHIBAKING-BNB'}
                            </Box>
                        </Box>
                        <MdOutlineSwapVert color={'rgb(50, 111, 174)'} fontSize={'24px'} lineHeight={'24px'} onClick={() => setCalcShowType(!calcshowtype)} style={{ cursor: 'pointer' }} />

                    </InputPanel>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box width={'25%'} height={'20px'} >
                            <StyledButton
                                onClick={() => !calcshowtype ? setCalcAmount(100) : setCalcAmount(100 / farm.price)}
                            >$100
                            </StyledButton>
                        </Box>
                        <Box width={'25%'} height={'20px'}>
                            <StyledButton
                                onClick={() => !calcshowtype ? setCalcAmount(1000) : setCalcAmount(1000 / farm.price)}
                            >
                                $1000
                            </StyledButton>
                        </Box>
                        <Box width={'45%!important'} height={'20px'}>
                            <StyledButton
                                onClick={() => !calcshowtype ? setCalcAmount(farm.balance * farm.price) : setCalcAmount(farm.balance)}
                            >
                                MY BALANCE
                            </StyledButton>
                        </Box>
                    </Box>
                    <Box color={'rgb(85, 176, 221)'} fontWeight={600} fontSize={'12px'} mt={'24px'}>STAKED FOR</Box>
                    <DaySelectPanel mt={'10px'} active={day}>
                        <Box width={'20%'} onClick={() => setDay(1)}>15D</Box>
                        <Box width={'20%'} onClick={() => setDay(2)}>30D</Box>
                        <Box width={'20%'} onClick={() => setDay(3)}>60D</Box>
                    </DaySelectPanel>
                    <Box display={'flex'} justifyContent={'center'} my={'24px'}>
                        <FiArrowDown color={'rgb(50, 111, 174)'} fontSize={'24px'} />
                    </Box>
                    <ROIPanel>
                        <Box>
                            <Box color={'rgb(85, 176, 221)'} fontSize={'12px'} fontWeight={'600'}>ROI AT CURRENT RATES</Box>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} color={'rgb(21, 110, 155)'} fontSize={'24px'} fontWeight={'600'} mt={'4px'}>
                                <Box>$0.00</Box>
                                <BsFillPencilFill color={'rgb(239, 183, 0)'} fontSize={'20px'} cursor={'pointer'} />
                            </Box>
                            <Box color={'rgb(50, 111, 174)'} fontSize={'12px'}>~ 0 DogeDash (0.00%)</Box>
                        </Box>
                    </ROIPanel>

                </ModalBody >
                <Detail>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} color={'rgb(239, 183, 0)'} style={{ cursor: 'pointer' }} onClick={() => setShowDetail(!showdetail)}>
                        <Box mr={'16px'} fontSize={'16px'} fontWeight={'600'}>Details</Box>
                        <FaChevronDown fontSize={'14px'} />
                    </Box>
                    <DetailBody active={showdetail}>
                        <Box display={'flex'} justifyContent={'space-between'} color={'rgb(50, 111, 174)'} fontSize={'14px'} mt={'15px'}>
                            <Box>
                                APR (incl. LP rewards)
                            </Box>
                            <Box> 0.00%</Box>
                        </Box>
                        <Box color={'rgb(50, 111, 174)'} fontSize={'12px'} mt={'35px'}>
                            <Box>
                                - Calculated based on current rates.
                            </Box>
                            <Box>
                                - All figures are estimates provided for your convenience only, and by no means represent guaranteed returns..
                            </Box>
                        </Box>
                        <a href={'https://pancakeswap.finance/add/BNB/0x7AE5709c585cCFB3e61fF312EC632C21A5F03F70'} target={'_blank'} style={{ textDecoration: 'none', color: 'rgb(239, 183, 0)' }}>
                            <Box fontWeight={600} display={'flex'} justifyContent={'center'} alignItems={'center'} mt={'15px'}>
                                <Box mr={'8px'}>Get SHIBA KING-BNB</Box>
                                <BiLinkExternal fontSize={'18px'} />
                            </Box>
                        </a>
                    </DetailBody>
                </Detail>
            </Modal >

            <Modal
                isOpen={open}
                onRequestClose={() => {
                    setOpen(false);
                }}
                style={customStyles1}
                contentLabel="Example Modal"
            >
                <ModalHeader >
                    <Box color={'rgb(21,110,155)'} fontSize={'20px'} fontWeight={'600'}>
                        {modaldata.isStake ? 'Stake Tokens' : 'Withdraw Tokens'}
                    </Box>
                    <Box height={'48px'} display={'flex'} justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(false)}>
                        <AiOutlineClose color={'rgb(239, 183, 0)'} fontSize={'18px'} cursor={'pointer'} />
                    </Box>
                </ModalHeader>
                <ModalBody>
                    <Box display={'flex'} justifyContent={'end'} mb={'5px'} color={'rgb(85, 176, 221)'} fontSize={'12px'} style={{ cursor: 'pointer' }} onClick={() => setAmount(modaldata.balance)}>
                        {modaldata.isStake ? 'Balance' : 'Withdrawable Amount'} : {modaldata.balance.toFixed(3)}
                    </Box>
                    <Box bgcolor={'rgb(215, 240, 255)'} padding={'3px 10px'} borderRadius={'8px'}>
                        <CustomInput className="amountinput" type="number" value={amount.toString()} style={{ textAlign: 'left' }}

                            onKeyPress={(event) => {
                                if ((event?.key === '-' || event?.key === '+')) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(event) => {

                                setAmount(inputNumberFormat(event.target.value));
                            }} />
                    </Box>
                    {insufficient ? <Box color={'tomato'} display={'flex'} justifyContent={'end'}>
                        Insufficient Balance
                    </Box> : ''}
                </ModalBody>
                <ModalActions>
                    <Box height={'48px'} width={'49%'}>
                        <EnableButton onClick={() => {
                            setOpen(false);
                        }} style={{ fontSize: '16px', borderRadius: '5px' }}>Cancel
                        </EnableButton>
                    </Box>
                    <Box height={'48px'} width={'49%'}>
                        <EnableButton
                            disabled={insufficient || !Number(amount)} onClick={() => onConfirm()}
                            style={{ fontSize: '16px', borderRadius: '5px' }}
                        >Confirm</EnableButton>
                    </Box>

                </ModalActions>
            </Modal>

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
                            <Box className="percentage_But" onClick={() => setModalOpen(true)}>
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
                            {duration}D
                        </Box>
                    </Box>

                    <Box paddingTop={'16px'}>
                        <Box display={'flex'} alignItems={'center'}>
                            <span className={'attr_title_s_l'}>{'shiba king'}</span>
                            <span className={'attr_title_s_d'}>{' earned'}</span>
                        </Box>

                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} height={'65px'} marginBottom={'8px'}>
                            <span className={'attr_lock_amount'}>{
                                farm.pendingReward !== undefined ? Number(farm.pendingReward).toFixed(3) :
                                    <Skeleton variant={'text'} width={'120px'} style={{ transform: 'unset', marginBottom: '3px' }} />}
                            </span>
                            <Box width={'108px'} height={'48px'}>
                                < EnableButton className={'attr_lock_but'} disabled={!farm || !Number(farm.claimableReward) || pending} onClick={() => onHarvest()}>Harvest</EnableButton>
                            </Box>
                        </Box>

                        <Box display={'flex'} alignItems={'center'}>
                            <span className={'attr_title_s_l'}>{'shiba king-bnb'}</span>
                            <span className={'attr_title_s_d'}>{' staked'}</span>
                        </Box>

                        {!connected ? <Box marginTop={'8px'}>
                            <ConnectMenu bigType={true} theme={theme} />
                        </Box> : ''
                        }
                        {connected && (farm && !farm.allowance || !farm) ?
                            < Box width={'100%'} height={'48px'} marginTop={'8px'}>
                                <EnableButton onClick={() => onApproveContract()} disabled={pending}>
                                    Enable Contract
                                </EnableButton>
                            </Box> : ''
                        }
                        {connected && farm && farm.allowance && !farm.stakedAmount ?
                            < Box width={'100%'} height={'48px'} marginTop={'8px'}>
                                <EnableButton disabled={pending}
                                    onClick={() => {
                                        setOpen(true);
                                        setModalData({
                                            isStake: true, balance: Number(farm.balance)
                                        });
                                    }}
                                >
                                    Stake
                                </EnableButton>
                            </Box> : ''
                        }
                        {connected && farm && farm.allowance && farm.stakedAmount ?
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <span className={'attr_lock_amount'}>{farm.stakedAmount}</span>
                                <Box display={'flex'} mt={'8px'}>
                                    < Box width={'100%'} height={'48px'} mr={'5px'}>
                                        <StakeAction disabled={pending} style={{ lineHeight: '10px' }}
                                            onClick={() => {
                                                setOpen(true);
                                                setModalData({
                                                    isStake: true, balance: Number(farm.balance)
                                                });
                                            }}
                                        >
                                            +
                                        </StakeAction>
                                    </Box>
                                    < Box width={'100%'} height={'48px'}>
                                        <StakeAction disabled={pending} style={{ lineHeight: '10px' }}
                                            onClick={() => {
                                                setOpen(true);
                                                setModalData({
                                                    isStake: false, balance: Number(farm.withdrawableAmount)
                                                });
                                            }}
                                        >
                                            -
                                        </StakeAction>
                                    </Box>
                                </Box>
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
                                    <Box className={'attr_text'}>{farm.totalStaked ? Number(farm.totalStaked).toFixed(5) : '0.00000'}</Box>
                                </Box>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Box className={'attr_text'}>Total liquidity:</Box>
                                    <Box className={'attr_text'}>${farm.totalLiquidity ? farm.totalLiquidity.toFixed(2) : '0.00'}</Box>
                                </Box>
                                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Box className={'attr_text'}>Deposit Fee:</Box>
                                    <Box className={'attr_text'}>{farm.depositFee ? Number(farm.depositFee).toFixed(2) : '0.00'}%</Box>
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
        </Box >
    );
}


const EnableButton = styled.button`
    border: none;
    align-items: center;
    border-radius: 16px;
    box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px 0px inset;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.03em;
    line-height: 1;
    justify-content: center;
    opacity: 1;
    padding: 0px 16px;
    outline: 0px;
    background-color: rgb(239, 183, 0);
    width : 100%;
    height : 100%;
    color: white;
    &:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: .5;
    }
    :disabled{
         background-color: rgb(233, 234, 235);
        border-color: rgb(233, 234, 235);
        box-shadow: none;
        color: rgb(192, 202, 205);
        cursor: not-allowed;
    }
    transition : all 0.2s;
`;


const Detail = styled(Box)`
    padding : 24px;
    background : rgb(246, 246, 246)
`;

const DetailBody = styled(Box)`
    height : ${({ active }) => active ? '180px' : '0'};
    overflow : hidden;
    transition : all 0.3s;
`;

const StyledButton = styled(Box)`
    border: 0px;
    border-radius: 16px;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-weight: 600;
    -webkit-box-pack: center;
    justify-content: center;
    align-items : center;
    letter-spacing: 0.03em;
    line-height: 1;
    opacity: 1;
    outline: 0px;
    transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
    height: 100%;
    font-size: 12px;
    background-color: rgb(251, 240, 226);
    box-shadow: none;
    color: rgb(239, 183, 0);
    width: 100%;
    padding: 4px 16px;
    :hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
        opacity: 0.65;
    }
    :disabled{
        background - color: rgb(233, 234, 235);
    border-color: rgb(233, 234, 235);
    box-shadow: none;
    color: rgb(192, 202, 205);
    cursor: not-allowed;
    }
                `;

const InputPanel = styled(Box)`
    background-color : rgb(215, 240, 255);
    padding : 8px 16px;
    display : flex;
    align-items : center;
    box-shadow : rgb(74 74 104 / 10%) 0px 2px 2px -1px inset;
    border : 1px solid rgb(202, 222, 236);
    border-radius : 16px;
                `;

const DetailsBox = styled(Box)`
    > svg {
        ${({ showType }) => showType ? 'transform: rotate(180deg)' : ''};
    }
`;

const ModalHeader = styled(Box)`
    background-image : linear-gradient(111.68deg, rgb(66, 193, 255) 0%, rgb(6, 162, 239) 100%);
    padding : 12px 24px;
    display : flex;
    justify-content : space-between;
    align-items : center;
    >svg{
            transition : all 0.2s;
            :hover{
            opacity : 0.8;
            }
        }
`;

const ModalBody = styled(Box)`
                padding : 24px;
                `

const CustomInput = styled.input`
    font-size: 16px !important;
    height : 40px;
    width: 100%;
    border : none!important;
    text-align : right;
    color : rgb(21, 110, 155)!important;
    font-family : 'Kanit';
    background : transparent;
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit - appearance: none; 
    }
    margin: 0;
                `;
const DaySelectPanel = styled(Box)`
    background-color: rgb(251, 240, 226);
    border-radius: 16px;
    display: inline-flex;
    border: 1px solid rgb(232, 242, 246);
    width : 100%;
    justify-content : space-between;
    margin : 0!important;
    >div{
        -webkit-box-align: center;
        align-items: center;
        border: 0px;
        border-radius: 16px;
        cursor: pointer;
        display: inline-flex;
        font-family: inherit;
        font-size: 16px;
        font-weight: 600;
        -webkit-box-pack: center;
        justify-content: center;
        letter-spacing: 0.03em;
        line-height: 1;
        opacity: 1;
        outline: 0px;
        transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
        height: 32px;
        padding: 0px 16px;
        color : rgb(239, 183, 0);
        width : 33%;
    }
    >div:nth-child(${({ active }) => active}){
                    background-color: rgb(239, 183, 0);
                color: white;
    }
                `;

const ROIPanel = styled(Box)`
    >div{
                    height: 120px;
                padding: 24px;
                border-radius: 16px;
                background: linear-gradient(139.73deg, rgb(197, 237, 253) 0%, rgb(6, 162, 239) 100%);
    }
                background: linear-gradient(rgb(83, 222, 233), rgb(118, 69, 217));
                padding: 1px;
                width: 100%;
                border-radius: 16px;
                `;

const ModalActions = styled(Box)`
    display : flex;
    justify-content : space-between;
    >button{
        width : 47%;
    }
    @media screen and (max-width : 500px){
        flex-direction : column;
        >button{
            width : 100%;
        margin-bottom : 10px;
        }
    }
 `

const StakeAction = styled.button`
    width : 40px;
    height : 40px;
    border-radius : 10px;
    border : 2px solid rgb(255, 180, 43);
    display : flex;
    justify-content : center;
    align-items : center;
    font-weight : bold;
    background : transparent;
    font-size : 24px;
    color : rgb(255, 180, 43);
    cursor : pointer;
`;

export default LPBox;

