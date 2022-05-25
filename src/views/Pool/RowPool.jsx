import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    Box,
    Checkbox,
    InputAdornment,
    OutlinedInput,
} from "@material-ui/core";
import { OGEM_ADDR, First_Lock, Second_Lock, MANUAL_LOCK } from '../../abis/address'

import ERC20ABI from '../../abis/ERC20ABI.json'
import ManualABI from '../../abis/ManualABI.json'
import LockABI from '../../abis/LockABI.json'
import Modal from 'react-modal';
import { BsAlarm } from 'react-icons/bs'
import { CgArrowsExchangeAlt } from 'react-icons/cg'
import { MdOutlineClose } from 'react-icons/md'
import { Skeleton } from "@material-ui/lab";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { AiOutlineCalculator } from 'react-icons/ai'
import { RiShareBoxLine } from 'react-icons/ri';
import { BiLockAlt } from 'react-icons/bi';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { ethers } from "ethers";


const compound = [
    [1135.04 / 252.24 / 252.24, 1074.30 / 252.24 / 252.24, 1010.83 / 252.24 / 252.24, 889.68 / 252.24 / 252.24],
    [1982.22 / 304.87 / 304.87, 1835.37 / 304.87 / 304.87, 1687.16 / 304.87 / 304.87, 1418.83 / 304.87 / 304.87],
    [2100.80 / 310.45 / 310.45, 1940.19 / 310.45 / 310.45, 1778.71 / 310.45 / 310.45, 1488.07 / 310.45 / 310.45]
]

const customStyles1 = {
    content: {
        top: 'calc(50% )',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: 'calc(100% - 20px)',
        maxWidth: '500px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Poppins',
        borderRadius: '20px'
    },
};

const customStyles = {
    content: {
        top: 'calc(50% )',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        height: 'calc(100vh - 150px)',
        width: '100%',
        maxWidth: '500px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Poppins',
        borderRadius: '20px'
    },
};

const RowPool = ({ account, pools, open, setOpen, tokenInfo }) => {

    const [showdetail, setShowDetail] = useState([]);

    const [pending, setPending] = useState([]);

    const [modaldata, setModalData] = useState({ modallocknum: 0, address: '', isStake: true, balance: 0 });
    const [modalopen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState('0');

    const [calcmodal, setCalcModal] = useState(0);
    const [calcmodalopen, setCalcModalOpen] = useState(false);
    const [calcamount, setCalcAmount] = useState('0');
    const [stakeday, setStakeDay] = useState(365);
    const [compoundday, setCompoundDay] = useState(-1);
    const [showcalcdetail, setShowCalcDetail] = useState(false);
    const [compoundcalc, setCompoundCalc] = useState(false);
    const [calcshowtype, setCalcShowType] = useState(false);

    function tokenToUSD(amount, decimal) {
        if (!tokenInfo || !amount) return 'null';
        let temp = (Number(amount) * Number(tokenInfo.price.price));
        return numberWithCommas(temp.toFixed(decimal));
    }

    function BNBToUSD(amount, decimal) {
        if (!tokenInfo || !amount) return 'null';
        let temp = (Number(amount) * Number(tokenInfo.price.price) / Number(tokenInfo.price.price_BNB));
        return numberWithCommas(temp.toFixed(decimal));
    }

    function numberWithCommas(x) {
        if (!x) return '';
        const list = x.split('.')
        if (list.length > 1)
            return list[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + list[1];
        return list[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const onApproveContract = async (type, _address) => {
        let temp = [...pending];
        temp[type] = true;
        setPending(temp);
        const address = _address.split(' ')[0];
        try {
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(OGEM_ADDR, ERC20ABI, signer);
            const tx = await tokenContract.approve(address, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
            await tx.wait();
        }
        catch (error) {
            console.log(error);
        }
        temp = [...pending];
        temp[type] = false;
        setPending(temp);
    }

    const onConfirm = async () => {
        let _pending = [...pending];
        _pending[modaldata.modallocknum] = true;
        setPending(_pending);
        let temp = amount.split('.')[1];
        if (temp)
            temp = amount.slice(0, amount.length - 2);
        else temp = amount;

        const signer = provider.getSigner();
        try {
            if (modaldata.modallocknum === 0) {

                const ManualContract = new ethers.Contract(MANUAL_LOCK, ManualABI, signer);
                if (modaldata.isStake) {
                    await ManualContract.deposit(ethers.utils.parseEther(temp));
                }
                else
                    await ManualContract.withdraw(ethers.utils.parseEther(temp));
            }
            else {
                const address = modaldata.address.split(' ')[0];
                const type = modaldata.address.split(' ')[1];
                const LockContract = new ethers.Contract(address, LockABI, signer);
                if (modaldata.isStake) {
                    await LockContract.deposit(ethers.utils.parseEther(temp), type);
                }
                else
                    await LockContract.withdraw(ethers.utils.parseEther(temp), type);
            }
        }
        catch (error) {
            console.log(error);
        }
        _pending = [...pending];
        _pending[modaldata.modallocknum] = false;
        setPending(_pending);
    }

    const onCompoundReward = async (i) => {
        let _pending = [...pending];
        _pending[i] = true;
        setPending(_pending);

        const signer = provider.getSigner();
        try {
            if (i === 0) {
                const contract = new ethers.Contract(pools[i].address, ManualABI, signer);
                await contract.compoundReward({ value: pools[i].performanceFee });
            }
            else {
                const address = modaldata.address.split(' ')[0];
                const type = modaldata.address.split(' ')[1];
                const contract = new ethers.Contract(address, LockABI, signer);
                await contract.compoundReward(type, { value: pools[i].performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        _pending = [...pending];
        _pending[i] = false;
        setPending(_pending);
    }
    const onCompoundReflection = async (i) => {
        let _pending = [...pending];
        _pending[i] = true;
        setPending(_pending);

        const signer = provider.getSigner();
        try {
            if (i === 0) {
                const contract = new ethers.Contract(pools[i].address, ManualABI, signer);
                await contract.compoundDividend({ value: pools[i].performanceFee });
            }
            else {
                const address = modaldata.address.split(' ')[0];
                const type = modaldata.address.split(' ')[1];
                const contract = new ethers.Contract(address, LockABI, signer);
                await contract.compoundDividend(type, { value: pools[i].performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        _pending = [...pending];
        _pending[i] = false;
        setPending(_pending);
    }
    const onHarvestReward = async (i) => {
        let _pending = [...pending];
        _pending[i] = true;
        setPending(_pending);

        const signer = provider.getSigner();
        try {
            if (i === 0) {
                const contract = new ethers.Contract(pools[i].address, ManualABI, signer);
                await contract.claimReward({ value: pools[i].performanceFee });
            }
            else {
                const address = modaldata.address.split(' ')[0];
                const type = modaldata.address.split(' ')[1];
                const contract = new ethers.Contract(address, LockABI, signer);
                await contract.claimReward(type, { value: pools[i].performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        _pending = [...pending];
        _pending[i] = false;
        setPending(_pending);
    }
    const onHarvestReflection = async (i) => {
        let _pending = [...pending];
        _pending[i] = true;
        setPending(_pending);

        const signer = provider.getSigner();
        try {
            if (i === 0) {
                const contract = new ethers.Contract(pools[i].address, ManualABI, signer);
                await contract.claimDividend({ value: pools[i].performanceFee })
            }
            else {
                const address = modaldata.address.split(' ')[0];
                const type = modaldata.address.split(' ')[1];
                const contract = new ethers.Contract(address, LockABI, signer);
                await contract.claimDividend(type, { value: pools[i].performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        _pending = [...pending];
        _pending[i] = false;
        setPending(_pending);
    }

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

    const CalculateRate = (i) => {
        if (compoundcalc)
            return Number(stakeday * pools[i]?.rate * pools[i]?.rate * compound[i][compoundday] / 36500);
        return Number(stakeday * pools[i]?.rate / 36500);
    }


    return (
        <PoolField mt={'10px'}>
            <Modal
                isOpen={calcmodalopen}
                onRequestClose={() => setCalcModalOpen(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <Box display={'flex'} justifyContent={'space-between'} mb={'20px'} fontSize={'24px'} py={'20px'} borderBottom={'2px solid rgb(231, 227, 235)'}>
                    <Box>
                        ROI Calculator
                    </Box>
                    <Box onClick={() => setCalcModalOpen(false)}><MdOutlineClose /></Box>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} fontSize={'18px'} mb={'5px'}>
                    <Box>
                        = {calcshowtype ? numberWithCommas((Number(calcamount) / tokenInfo?.price.price).toFixed(2))
                            : numberWithCommas(Number(tokenInfo?.price.price * Number(calcamount)).toFixed(2))} {calcshowtype ? 'OGEM' : 'USD'}
                    </Box>
                    <Box>
                        Balance : {calcshowtype ? numberWithCommas(Number(tokenInfo?.balance * tokenInfo?.price.price).toFixed(2)) :
                            numberWithCommas(Number(tokenInfo?.balance).toFixed(2))}
                    </Box>
                </Box>
                <CustomInput className="amountinput" type="number" value={calcamount.toString()}
                    endAdornment={
                        <InputAdornment position="start">
                            <Box display={'flex'} alignItems={'center'}>
                                <Box fontSize={'14px'} mr={'5px'}>{calcshowtype ? 'USD' : 'OGEM '}</Box>
                                <Box mr={'20px'} fontSize={'32px'} style={{ cursor: 'pointer' }} onClick={() => setCalcShowType(!calcshowtype)}>
                                    <CgArrowsExchangeAlt />
                                </Box>
                                <Box
                                    style={{ cursor: "pointer", background: "rgb(64 75 151)" }}
                                    color={"white"}
                                    padding={"10px"}
                                    borderRadius={"10px"}
                                    fontSize={"30px"}
                                    onClick={() => {
                                        setCalcAmount(calcshowtype ? tokenInfo?.balance * tokenInfo?.price.price :
                                            tokenInfo?.balance)
                                    }}
                                >
                                    MAX
                                </Box>
                            </Box>
                        </InputAdornment>
                    }
                    onKeyPress={(event) => {
                        if ((event?.key === '-' || event?.key === '+')) {
                            event.preventDefault();
                        }
                    }}
                    onChange={(event) => {
                        if (event.target.value / 1 < 0)
                            return;

                        setCalcAmount(inputNumberFormat(event.target.value));
                    }} />
                <Box mt={'40px'} fontSize={'18px'}>
                    STAKED FOR
                </Box>
                <DaySelectPanel>
                    <DaySelectCard active={stakeday === 1} onClick={() => setStakeDay(1)} width={'20%'}>1D</DaySelectCard>
                    <DaySelectCard active={stakeday === 7} onClick={() => setStakeDay(7)} width={'20%'}>7D</DaySelectCard>
                    <DaySelectCard active={stakeday === 30} onClick={() => setStakeDay(30)} width={'20%'}>30D</DaySelectCard>
                    <DaySelectCard active={stakeday === 365} onClick={() => setStakeDay(365)} width={'20%'}>1Y</DaySelectCard>
                    <DaySelectCard active={stakeday === 365 * 5} onClick={() => setStakeDay(365 * 5)} width={'20%'}>5Y</DaySelectCard>
                </DaySelectPanel>
                <Box mt={'40px'} fontSize={'18px'}>
                    COMPOUNDING EVERY
                </Box>
                <Box display={'flex'}>
                    <Checkbox checked={compoundcalc} onChange={() => {
                        if (compoundday === -1)
                            setCompoundDay(0);
                        if (compoundcalc)
                            setCompoundDay(-1);
                        setCompoundCalc(!compoundcalc)
                    }} />
                    <DaySelectPanel>
                        <DaySelectCard active={compoundday === 0} onClick={() => compoundcalc && setCompoundDay(0)} width={'25%'}>1D</DaySelectCard>
                        <DaySelectCard active={compoundday === 1} onClick={() => compoundcalc && setCompoundDay(1)} width={'25%'}>7D</DaySelectCard>
                        <DaySelectCard active={compoundday === 2} onClick={() => compoundcalc && setCompoundDay(2)} width={'25%'}>14D</DaySelectCard>
                        <DaySelectCard active={compoundday === 3} onClick={() => compoundcalc && setCompoundDay(3)} width={'25%'}>30D</DaySelectCard>
                    </DaySelectPanel>
                </Box>

                <Box borderRadius={'16px'} mt={'40px'} border={'1px solid black'} padding={'30px'} mx={'20px'} mb={'20px'}>
                    <Box fontSize={'18px'} >ROI AT CURRENT RATES</Box>
                    <Box fontSize={'28px'} mt={'10px'} fontWeight={'bold'}>${
                        numberWithCommas((calcshowtype ? Number(calcamount) * CalculateRate(calcmodal) :
                            Number(calcamount) * tokenInfo?.price.price * CalculateRate(calcmodal)).toFixed(2))}</Box>
                    <Box mt={'10px'} fontWeight={'bold'}> ~ {
                        calcshowtype ? (Number(calcamount) * CalculateRate(calcmodal) / tokenInfo?.price.price).toFixed(3) :
                            (Number(calcamount) * CalculateRate(calcmodal)).toFixed(3)} OGEM({(CalculateRate(calcmodal) * 100).toFixed(2)}%)</Box>
                </Box>

                <Box display={'flex'} justifyContent={'center'} padding={'10px 0'}>
                    <Box display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setShowCalcDetail(!showcalcdetail)}>
                        <Box mr={'20px'} fontSize={'21px'}>
                            {showcalcdetail ? 'Hide' : 'Details'}
                        </Box>
                        {showcalcdetail ? <BsChevronUp /> : <BsChevronDown />}
                    </Box>
                </Box>

                {showcalcdetail ? <Box px={'20px'} fontSize={'18px'} mt={'20px'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box>APR</Box>
                        <Box>{Number(pools[calcmodal]?.rate).toFixed(2)}%</Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={'10px'}>
                        <Box>APY (1x daily compound)</Box>
                        <Box>{Number(pools[calcmodal]?.rate * pools[calcmodal]?.rate * compound[calcmodal][0]).toFixed(2)}%</Box>
                    </Box>
                    <Box fontSize={'16px'} my={'20px'}>
                        Calculated based on current rates.<br />
                        All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.
                    </Box>
                </Box> : ''}
            </Modal>
            <Modal
                isOpen={modalopen}
                onRequestClose={() => {
                    setModalOpen(false);
                }}
                style={customStyles1}
                contentLabel="Example Modal"
            >
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'2px solid rgb(231, 227, 235)'} mb={'20px'} fontSize={'24px'} py={'20px'} >
                    <Box >
                        {modaldata.isStake ? 'Stake Tokens' : 'Withdraw Tokens'}
                    </Box>
                    <Box onClick={() => {
                        setModalOpen(false);
                    }} style={{ cursor: 'pointer' }}>
                        <MdOutlineClose />
                    </Box>
                </Box>
                <Box display={'flex'} justifyContent={'end'} fontSize={'18px'} mb={'5px'}>
                    {modaldata.isStake ? 'Balance' : 'Staked Amount'} : {modaldata.balance}
                </Box>
                <CustomInput className="amountinput" type="number" value={amount.toString()}
                    endAdornment={
                        <InputAdornment position="start">
                            <Box
                                style={{ cursor: "pointer", background: "rgb(64 75 151)" }}
                                color={"white"}
                                padding={"10px"}
                                borderRadius={"10px"}
                                fontSize={"30px"}
                                onClick={() => { setAmount(modaldata.balance.toString()) }}
                            >
                                MAX
                            </Box>
                        </InputAdornment>
                    }
                    onKeyPress={(event) => {
                        if ((event?.key === '-' || event?.key === '+')) {
                            event.preventDefault();
                        }
                    }}
                    onChange={(event) => {
                        if (event.target.value / 1 < 0 || event.target.value / 1 > modaldata.balance)
                            return;
                        setAmount(inputNumberFormat(event.target.value));
                    }} />

                <ModalActions>
                    <ModalButton onClick={() => {
                        setModalOpen(false);
                    }}>Cancel</ModalButton>
                    <ModalButton disabled={!modaldata.balance} onClick={() => onConfirm()}>Confirm</ModalButton>
                </ModalActions>
            </Modal>
            {
                pools.map((data, i) => {
                    return <>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} fontWeight={'400'} padding={'16px 10px'} borderBottom={i < pools.length - 1 ? '1px solid #b7e2fa' : 'none'}>
                            <Box display={'flex'} alignItems={'center'} width={'120px'}>
                                <Box width={'42px'} height={'42px'}>
                                    <img src={'/images/cardlogo.png'} width={'100%'} height={'100%'} />
                                </Box>
                                <Box fontSize={'9px'} ml={'10px'}>
                                    <Box fontSize={'12px'} color={'#b7e2fa'}>Earn OGEM</Box>
                                    <Box color={'#b7e2fa'}>Stake OGEM</Box>
                                    <Box color={'#add39c'}>Refl. BNB</Box>
                                    {
                                        data.duration ?
                                            <Box color={'white'}>{i === 0 ? '' : 'Lock:'} {data.duration}</Box> :
                                            <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                    }
                                </Box>
                            </Box>
                            <Box fontSize={'9px'} width={'80px'}>
                                <Box fontSize={'9px'} color={'#b7e2fa'}>OGEM Earned</Box>
                                {data.pendingReward ?
                                    <Box fontSize={'12px'} color={'white'}>{numberWithCommas(Number(data.pendingReward).toFixed(5))}</Box> :
                                    <Skeleton variant={'text'} width={'60px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                }
                                {
                                    !tokenToUSD(data.pendingReward, 2)?.includes('null') ?
                                        <Box fontSize={'9px'} color={'#add39c'}>~{numberWithCommas(tokenToUSD(data.pendingReward, 2)?.toString())}USD</Box> :
                                        <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                }
                            </Box>
                            <APRPanel>
                                <Box fontSize={'9px'}>
                                    <Box fontSize={'9px'} color={'#add39c'}>APR</Box>
                                    {
                                        data.rate ?
                                            <Box fontSize={'12px'} color={'white'} style={{ cursor: 'pointer' }} onClick={() => {
                                                setCalcModalOpen(true);
                                                setCalcModal(i);
                                            }}>{data.rate}%</Box>
                                            :
                                            <Skeleton variant={'text'} width={'60px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                    }
                                </Box>
                                <Box color={'#b7e2fa'} fontSize={'18px'} style={{ cursor: 'pointer' }} onClick={() => {
                                    setCalcModalOpen(true);
                                    setCalcModal(i);
                                }}><AiOutlineCalculator /></Box>
                            </APRPanel>
                            <TotalStaked>
                                <Box fontSize={'9px'} color={'#add39c'}>Total Staked</Box>
                                {data.totalStaked ?
                                    <Box fontSize={'11px'}>{data.totalStaked} OGEM</Box> :
                                    <Skeleton variant={'text'} width={'100px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                }
                            </TotalStaked>
                            <EndsIn >
                                <Box>
                                    <Box fontSize={'9px'} color={'#add39c'}>Ends In</Box>
                                    {data.endsIn ?
                                        <Box mr={'10px'} fontSize={'11px'}>{data.endsIn} blocks</Box> :
                                        <Skeleton variant={'text'} width={'80px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                    }
                                </Box>
                                <Box color={'#b7e2fa'} mt={'10px'}><BsAlarm /></Box>
                            </EndsIn>
                            <DetailButton onClick={() => {
                                let temp = [...showdetail];
                                temp[i] = !temp[i];
                                setShowDetail(temp)
                            }}>
                                <Box display={'flex'} fontSize={'11px'} >
                                    <Box color={'#add39c'}>
                                        Details
                                    </Box>
                                    <Box color={'#b7e2fa'} pt={'2px'} ml={'10px'}>
                                        <FaChevronDown />
                                    </Box>
                                </Box>
                            </DetailButton>
                        </Box>

                        <Detail active={showdetail[i]} borderBottom={i < pools.length - 1 && showdetail[i] ? '1px solid #b7e2fa' : 'none'}>
                            <Box padding={'15px 65px'} pr={'35px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                                <Box width={'150px'}>
                                    <Box fontSize={'11px'} color={'#b7e2fa'}>
                                        Ends in: &nbsp;&nbsp;9,023,334 blocks
                                    </Box>
                                    <a href={'https://pancakeswap.finance/info/token/token/0x190984cB2E74332c2c9017f4998E382fc31DC2D5'} target={'_blank'} style={{ textDecoration: 'unset' }}>
                                        <Box fontSize={'11px'} color={'#add39c'} display={'flex'} style={{ cursor: 'pointer' }}>
                                            <Box>See Token Info</Box>
                                            <Box ml={'10px'}><RiShareBoxLine fontSize={'14px'} /></Box>
                                        </Box>
                                    </a>
                                    <a href={'https://shitfaceinu.com/'} target={'_blank'} style={{ textDecoration: 'unset' }}>
                                        <Box fontSize={'11px'} color={'#add39c'} display={'flex'} style={{ cursor: 'pointer' }} >
                                            <Box>View Website</Box>
                                            <Box ml={'10px'}><RiShareBoxLine fontSize={'14px'} /></Box>
                                        </Box>
                                    </a>
                                    <a href={'https://bscscan.com/token/0x190984cb2e74332c2c9017f4998e382fc31dc2d5'} target={'_blank'} style={{ textDecoration: 'unset' }}>
                                        <Box fontSize={'11px'} color={'#add39c'} display={'flex'} style={{ cursor: 'pointer' }}>
                                            <Box>View Contract</Box>
                                            <Box ml={'10px'}><RiShareBoxLine fontSize={'14px'} /></Box>
                                        </Box>
                                    </a>
                                    <Box fontSize={'11px'} color={'#add39c'} display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }}>
                                        <Box>Add to Metamask</Box>
                                        <Box ml={'20px'} width={'19px'} height={'19px'}>
                                            <img src={'/images/pools/metamask.png'} width={'100%'} height={'100%'} />
                                        </Box>
                                    </Box>
                                    <Box mt={'10px'}>
                                        <YellowPanel style={{ backgroundColor: '#e5f6ff' }}>
                                            <Box fontSize={'11px'} width={'85px'} height={'22px'} color={'#404040'}>
                                                <Box mr={'3px'}><BiLockAlt fontSize={'14px'} /></Box>
                                                <Box >Lockup</Box>
                                            </Box>
                                        </YellowPanel>
                                    </Box>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} maxWidth={'250px'} width={'100%'}>
                                    <Box width={'120px'}>
                                        <Box fontSize={'10px'} color={'#b7e2fa'}>OGEM EARNED</Box>
                                        {data.pendingReward ?
                                            <Box fontSize={'14px'} color={'white'}>{numberWithCommas(Number(data.pendingReward).toFixed(5))}</Box> :
                                            <Skeleton variant={'text'} width={'60px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                        }
                                        {
                                            !tokenToUSD(data.pendingReward, 2)?.includes('null') ?
                                                <Box fontSize={'10px'} color={'#add39c'} fontWeight={'400'}>~{numberWithCommas(tokenToUSD(data.pendingReward, 2)?.toString())}USD</Box> :
                                                <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                        }
                                        <Box fontSize={'10px'} color={'#b7e2fa'} mt={'15px'}>BNB REFLECTED</Box>
                                        {data.pendingReflection ? <Box fontSize={'14px'} color={'white'}>{numberWithCommas(Number(data.pendingReflection).toFixed(5))}</Box> :
                                            <Skeleton variant={'text'} width={'60px'} style={{ transform: 'unset', marginBottom: '3px' }} />}
                                        {BNBToUSD(data.pendingReflection, 2)?.includes('null') ?
                                            <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} /> :
                                            <Box fontSize={'10px'} color={'#add39c'} fontWeight={'400'}>~{numberWithCommas(BNBToUSD(data.pendingReflection, 2)?.toString())}USD</Box>
                                        }
                                    </Box>

                                    <Box>
                                        <Box>
                                            <YellowPanel disabled={pending[i] || !(Number(data.pendingReward))} onClick={() => onCompoundReward(i)}>
                                                <Box width={'79px'} height={'19px'} fontSize={'9px'}>
                                                    Compound
                                                </Box>
                                            </YellowPanel>
                                        </Box>
                                        {i === 0 || data?.userinfo?.available / 1 ?
                                            <Box>
                                                <YellowPanel disabled={pending[i] || !(Number(data.pendingReward))} onClick={() => onHarvestReward(i)}>
                                                    <Box width={'79px'} height={'19px'} fontSize={'9px'}>
                                                        Harvest
                                                    </Box>
                                                </YellowPanel>
                                            </Box> : ''
                                        }
                                        <Box mt={'15px'}>
                                            <YellowPanel onClick={() => onCompoundReflection(i)} disabled={pending[i] || !(Number(data.pendingReflection))}>
                                                <Box width={'79px'} height={'19px'} fontSize={'9px'}>
                                                    Compound
                                                </Box>
                                            </YellowPanel>
                                        </Box>
                                        <Box>
                                            <YellowPanel onClick={() => onHarvestReflection(i)} disabled={pending[i] || !(Number(data.pendingReflection))}>
                                                <Box width={'79px'} height={'19px'} fontSize={'9px'}>
                                                    Harvest
                                                </Box>
                                            </YellowPanel>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box fontSize={'10px'} width={'100%'} maxWidth={'280px'}>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Box color={'#add39c'}>LOCK DURATION</Box>
                                        {
                                            data.duration ?
                                                <Box fontWeight={'bold'} color={'white'}>{data.duration}</Box> :
                                                <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                        }
                                    </Box>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Box color={'#add39c'}>DEPOSIT FEE</Box>
                                        {
                                            data.depositFee ?
                                                <Box color={'white'} fontWeight={'bold'} >{Number(data.depositFee).toFixed(2)}%</Box> :
                                                <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                        }
                                    </Box>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Box color={'#add39c'}>WITHDRAW FEE</Box>
                                        {
                                            data.withdrawFee ?
                                                <Box color={'white'} fontWeight={'bold'} >{Number(data.withdrawFee).toFixed(2)}%</Box> :
                                                <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                        }
                                    </Box>
                                    <Box display={'flex'} justifyContent={'space-between'} fontSize={'10px'} mt={'10px'}>
                                        <Box>
                                            <Box color={'#b7e2fa'}>OGEM STAKED</Box>
                                            {
                                                data.allowance && Number(data.allowance) >= Math.pow(10, 28) && Number(data.stakingAmount) > 0 ?
                                                    <>
                                                        {
                                                            data.stakingAmount ?
                                                                <Box fontSize={'14px'} fontWeight={'700'} color={'white'}>{numberWithCommas(Number(data.stakingAmount).toFixed(5))}</Box> :
                                                                <Skeleton variant={'text'} width={'60px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                                        }
                                                        {tokenToUSD(data.stakingAmount, 2)?.includes('null') ?
                                                            <Skeleton variant={'text'} width={'40px'} style={{ transform: 'unset', marginBottom: '3px' }} /> :
                                                            <Box color={'#add39c'}>~{numberWithCommas(tokenToUSD(data.stakingAmount, 2))}USD</Box>
                                                        }
                                                    </> : ''
                                            }
                                        </Box>
                                        {Number(data.allowance) >= Math.pow(10, 28) && data.allowance &&
                                            Number(data.stakingAmount) > 0 ?
                                            <Box display={'flex'} mt={'10px'}>
                                                <StakeAction onClick={() => {
                                                    setModalOpen(true);
                                                    setModalData({
                                                        modallocknum: i, address: data.address, isStake: false, balance: Number(data.stakingAmount)
                                                    });
                                                }}>-</StakeAction>
                                                <Box mr={'5px'} />
                                                <StakeAction onClick={() => {
                                                    setModalOpen(true);
                                                    setModalData({
                                                        modallocknum: i, address: data.address, isStake: true, balance: Number(tokenInfo.balance)
                                                    })
                                                }}>+</StakeAction>
                                            </Box>
                                            : ''
                                        }
                                        {Number(data.allowance) < Math.pow(10, 28) || !data.allowance ?
                                            account ?
                                                <EnableButton onClick={() => onApproveContract(i, data.address)} disabled={pending[i]}>
                                                    <Box width={'100%'} height={'35px'} fontSize={'14px'}>
                                                        Enable
                                                    </Box>
                                                </EnableButton> :
                                                <EnableButton onClick={() => setOpen(true)}>
                                                    <Box width={'100%'} height={'35px'} fontSize={'14px'}>
                                                        Connect Wallet
                                                    </Box>
                                                </EnableButton>
                                            : ''
                                        }
                                    </Box>
                                    <Box fontSize={'10px'} mt={'10px'}>
                                        <Box color={'#b7e2fa'}>LOCKED</Box>
                                        {data.locked ?
                                            <Box color={'white'}  >{numberWithCommas(Number(data.locked).toFixed(0))}</Box> :
                                            <Skeleton variant={'text'} width={'60px'} style={{ transform: 'unset', marginBottom: '3px' }} />
                                        }
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                display={'flex'}
                                justifyContent={'center'}
                                width={'100%'}
                                bgcolor={'#494949'}
                                alignItems={'center'}
                                height={'45px'}
                                fontSize={'12px'}
                                color={'white'}
                                borderTop={'1px solid #b7e2fa'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                <Box>To Top</Box>
                                <Box ml={'10px'} mt={'5px'}><FaChevronUp /></Box>
                            </Box>
                        </Detail>
                    </>
                })
            }
        </PoolField>
    );
};

const PoolField = styled(Box)`
    border : 1px solid #b7e2fa;
    border-radius : 20px;
    overflow : hidden;
    margin-bottom : 20px;
    background : #494949;
`;

const Detail = styled(Box)`
    
    font-weight : 400;
                    background-color : #161616;
    >div>div:nth-child(1)>div{
        margin-top : 8px;
    }
    transition : all 0.2s;
    overflow : hidden;
    height : ${({ active }) => active ? '210px' : '0'};
    @media screen and (max-width : 800px){
        >div:nth-child(1){
            flex-direction : column-reverse;
            padding : 15px 35px;
            >div{
                margin-bottom : 10px;
                width : 100%;
                max-width : 400px;
            }
        }
        height : ${({ active }) => active ? '525px' : '0'};
    }
`;

const YellowPanel = styled.button`
    font-family : 'Poppins';
    color : #404040;
    border-radius : 30px;
    background-color : #cffabc;
    cursor : pointer;
    padding : 0;
    outline : none;
    border: none;
    >div{
        display : flex;
    justify-content : center;
    align-items : center;
    }
    :disabled{
        color : #404040b5;
        background-color : #cffabcb5;
        cursor : not-allowed;
    }
`;

const StakeAction = styled.button`
    width : 40px;
    height : 40px;
    border-radius : 10px;
    border : 2px solid #add39c;
    display : flex;
    justify-content : center;
    align-items : center;
    font-weight : bold;
    background : transparent;
    font-size : 24px;
    color : #add39c;
`;

const TotalStaked = styled(Box)`
    display : flex;
    justify-content : space-between;
    width : 100%;
    max-width : 150px;
    flex-direction : column;
    @media screen and (max-width : 700px){
        display : none;
    }
`;

const EndsIn = styled(Box)`
    @media screen and (max-width : 700px){
        display : none;
    }
    display : flex;
    justify-content : space-between;
    width : 100%;
    max-width : 130px;
    align-items : center;
`;

const DetailButton = styled(Box)`
    display : flex;
    justify-content : center;
    width : 100%;
    max-width : 100px;
    cursor : pointer;
    @media screen and (max-width : 700px){
        >div>div:nth-child(1){
            display : none;
        }
        max-width : 30px;
    }
`;

const APRPanel = styled(Box)`
    display : flex;
    align-items : center;
    width : 100%;
    max-width : 70px;
    justify-content : space-between;
    @media screen and (max-width : 700px){
        max-width : 20px;
        >div:nth-child(2){
            display : none;
        }
    }
`;


const EnableButton = styled.button`
    font-family : 'Poppins';
    max-width : 150px;
    width : 100%;
    color : #494949;
    border-radius : 7px;
    background-color : #e2f4fe;
    cursor : pointer;
    padding : 0;
    outline : none;
    border: none;
    >div{
        display : flex;
    justify-content : center;
    align-items : center;
    }
    :disabled{
        color : rgb(150,150,150);
        background-color :  #e2f4feb5;
        cursor : not-allowed;
    }
`;

const ModalActions = styled(Box)`
    display : flex;
    justify-content : space-between;
    margin-top : 40px;
    @media screen and (max-width : 500px){
        flex-direction : column;
        >button{
            width : 100%;
        margin-bottom : 10px;
        }
    }
 `

const ModalButton = styled.button`
    text-align : center;
    border : 2px solid #add39c;
    background : white;
    color : #add39c;
    padding : 10px 70px;
    font-size : 21px;
    border-radius : 10px;
    cursor : pointer;
    transition : all 0.3s;
    :hover{
        background : #add39c;
    color : white;
    }
    :disabled{
        background : rgb(233, 234, 235);
        color : rgb(189, 194, 196);
        cursor : not-allowed;
        border : none;
    }
}
    `
const CustomInput = styled(OutlinedInput)`
    font-size: 20px !important;
    width: 100%;
    border-radius: 10px!important;
    border : 1px solid rgb(64 75 151);
    color : black!important;
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    }
    margin: 0; 
`;

const DaySelectPanel = styled(Box)`
    background-color: rgb(239, 244, 245);
    border-radius: 16px;
    display: inline-flex;
    border: 1px solid rgb(233, 234, 235);
    width : 100%;
    font-size : 21px;
>div{
        display : flex;
    justify-content : center;
    align-items : center;
    cursor : pointer;
    padding : 10px 0px;
}
    `;

const DaySelectCard = styled(Box)`
    background-color: ${({ active }) => active ? 'rgb(15, 33, 49)' : 'unset'};
    color: ${({ active }) => active ? 'white' : 'unset'};
    border-radius : 16px;
    transition : all 0.2s;
`;
export default RowPool;
