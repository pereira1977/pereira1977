import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
    Box,
} from "@material-ui/core";

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import RowPool from './RowPool';
import CardPool from './CardPool';
import Footer from "../../components/Footer/Footer";



const Pool = ({ account, pooldatas, tokenInfo, open, setOpen }) => {

    const [viewtype, setViewType] = useState(false);
    const [stakedonly, setStakedOnly] = useState(false);
    const [livefinish, setLiveFinish] = useState(false);
    const [criteria, setCriteria] = useState('');
    const [dropdownopen, setDropDownOpen] = useState(false);
    const [sort, setSort] = useState('APR');
    const [pools, setPools] = useState(pooldatas);

    const dropdown = useRef();

    useEffect(() => {
        document.addEventListener('mouseup', function (event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        });
    }, []);

    useEffect(() => {
        if (stakedonly) {
            let temp = [];
            for (let i = 0; i < pooldatas.length; i++)
                if (Number(pooldatas[i].stakingAmount) > 0)
                    temp.push(pooldatas[i]);
            setPools(temp);
        }
        else setPools(pooldatas);

    }, [stakedonly, pooldatas])

    useEffect(() => {
        let temp = [];
        for (let i = 0; i < pooldatas.length; i++)
            if ('sfinu'.includes(criteria.toLowerCase()) || 'bnb'.includes(criteria.toLowerCase()))
                temp.push(pooldatas[i]);
        setPools(temp);
    }, [criteria, pooldatas])

    useEffect(() => {
        let temp = pooldatas;
        if (sort === 'APR')
            for (let i = 0; i < temp.length - 1; i++)
                for (let j = i + 1; j < temp.length; j++)
                    if (temp[i].rate < temp[j].rate) {
                        const t = temp[i];
                        temp[i] = temp[j];
                        temp[j] = t;
                    }
        if (sort === 'Earned')
            for (let i = 0; i < temp.length - 1; i++)
                for (let j = i + 1; j < temp.length; j++)
                    if (temp[i].pendingReward < temp[j].pendingReward) {
                        const t = temp[i];
                        temp[i] = temp[j];
                        temp[j] = t;
                    }
        if (sort === 'Total Staked')
            for (let i = 0; i < temp.length - 1; i++)
                for (let j = i + 1; j < temp.length; j++)
                    if (temp[i].totalStaked < temp[j].totalStaked) {
                        const t = temp[i];
                        temp[i] = temp[j];
                        temp[j] = t;
                    }
        setPools(temp);

    }, [sort, pooldatas])

    return (
        <>
            <StyledContainer>
                <StrokePanel >
                    <Box width={'fit-content'} mx={'auto'}>
                        <Box width={'364px'} height={'119px'}>
                            <img src={'/images/logo.png'} width={'100%'} height={'100%'} />
                        </Box>
                        <Box fontSize={'12px'} color={'white'} maxWidth={'320px'} mt={'10px'}>
                            Stake your $OGEM tokens to earn passive income.
                            High APR, low risk.
                        </Box>
                    </Box>
                </StrokePanel>
                <PoolPanel>
                    <OptionPanel mt={'20px'}>
                        <Box display={'flex'} alignItems={'center'}>
                            <RowView onClick={() => setViewType(false)} active={viewtype} mr={'10px'} />
                            <CardView onClick={() => setViewType(true)} active={viewtype} mr={'30px'} />
                            <StakedOnlyPanel active={stakedonly} onClick={() => setStakedOnly(!stakedonly)}>
                                <Box />
                            </StakedOnlyPanel>
                            <Box ml={'5px'} fontSize={'11px'} color={'#b7e2fa'} mr={'25px'}>Staked Only </Box>
                            <LiveFinishPanel active={livefinish}>
                                <Box onClick={() => setLiveFinish(false)} width={'40%'}>Live</Box>
                                <Box onClick={() => setLiveFinish(true)} width={'60%'}>Finished</Box>
                            </LiveFinishPanel>
                        </Box>

                        <Box display={'flex'} alignItems={'center'}>
                            <Box mr={'10px'}>
                                <Box fontSize={'9px'} color={'#b7e2fa'} fontWeight={'bold'}>SORT BY</Box>
                                <Dropdown onClick={() => setDropDownOpen(!dropdownopen)} active={dropdownopen} ref={dropdown}>
                                    <Box fontSize={'12px'} color={'#5fab3d'}>{sort}</Box>
                                    <Box color={'#5fab3d'} pt={'6px'}>
                                        <FaChevronDown />
                                    </Box>
                                    <DropdownBody active={dropdownopen}>
                                        {sort !== 'APR' ? <Box onClick={() => setSort('APR')}>APR</Box> : ''}
                                        {sort !== 'Earned' ? <Box onClick={() => setSort('Earned')}>Earned</Box> : ''}
                                        {sort !== 'Total Staked' ? <Box onClick={() => setSort('Total Staked')}>Total Staked</Box> : ''}
                                    </DropdownBody>
                                </Dropdown>
                            </Box>

                            <Box>
                                <Box fontSize={'9px'} color={'#b7e2fa'} fontWeight={'bold'}>SEARCH</Box>
                                <Criteria type='text' style={{ width: '163px', height: '31px' }} value={criteria} onChange={(e) => setCriteria(e.target.value)} />
                            </Box>
                        </Box>
                    </OptionPanel>

                    {viewtype ? <RowPool pools={pools} account={account} open={open} setOpen={setOpen} tokenInfo={tokenInfo} /> :
                        <CardPool pools={pools} account={account} tokenInfo={tokenInfo} open={open} setOpen={setOpen} />}
                </PoolPanel>
            </StyledContainer >
            <Footer />
        </>
    );
};
const StyledContainer = styled(Box)`
    padding-top : 64px;
    min-height : 100vh;
`;

const StrokeText = styled(Box)`
    font-family : none;
    font-size : 30px;
    font-weight : 400;
    color : #d3824a;
    font-style : italic;
    -webkit-text-stroke: 0.3px #363636;
    >span{
        color : white;
    }
`;
const StrokePanel = styled(Box)`
 `;

const OptionPanel = styled(Box)`
    display : flex;
    justify-content: space-between;
    @media screen and (max-width : 900px){
        flex-direction : column;
        >div{
            margin-bottom : 10px;
        }
        margin-left : 30px;
    }
`;

const RowView = styled(Box)`
    width : 18px;
    height : 16px;
    background-size : 100% 100%;
    background-image : ${({ active }) => !active ? `url('/images/pools/rowviewinactive.png')` : `url('/images/pools/rowviewactive.png')`};
    cursor : pointer;
`;

const CardView = styled(Box)`
    width : 18px;
    height : 16px;
    background-size : 100% 100%;
    background-image : ${({ active }) => active ? `url('/images/pools/cardviewinactive.png')` : `url('/images/pools/cardviewactive.png')`};
    cursor : pointer;
`;

const StakedOnlyPanel = styled(Box)`
    background-color : ${({ active }) => !active ? '#cffabc' : '#5fab3d'};
    width : 35px;
    height : 15px;
    position : relative;
    border-radius : 20px;
    >div{
        width : 13px;
        height : 13px;
        background-color : white;
        position : absolute;
        top : 1px;
        left : ${({ active }) => !active ? '1px' : '21px'};
        transition : all 0.2s;
        border-radius : 50%;
    }
    cursor:pointer;
`;

const LiveFinishPanel = styled(Box)`
    width : 114px;
    height : 26px;
    background-color : #cffabc;
    border-radius : 20px;
    cursor : pointer;
    display : flex;
    font-weight : bold;
    >div{
        display : flex;
        justify-content : center;
        align-items: center;
        font-size : 11px;
    }
    >div:nth-child(1){
        background-color : ${({ active }) => !active ? '#5fab3d' : 'transparent'};
        color : ${({ active }) => !active ? 'white' : '#404040'};
        border-radius : 20px; 
    }
    >div:nth-child(2){
        background-color : ${({ active }) => active ? '#5fab3d' : 'transparent'};
        color : ${({ active }) => active ? 'white' : '#404040'};
        border-radius : 20px; 
    }
`;

const Dropdown = styled.div`
    width : 130px;
    height : 31px;
    background-color : #cffabc;
    border-radius : 8px;
    border-color : 1px solid #ffd48d;
    display :flex;
    justify-content : space-between;
    padding : 5px 8px;
    cursor : pointer;
    align-items : center;
    position : relative;
    border-bottom-left-radius : ${({ active }) => active ? '0px' : '8px'};
    border-bottom-right-radius : ${({ active }) => active ? '0px' : '8px'};
`;

const DropdownBody = styled(Box)`
    background-color : #cffabc;
    border-radius : 8px;
    border-top-left-radius : 0px;
    border-top-right-radius : 0px;
    left : 0;
    top : 30px;
    >div{
        padding : 5px 8px;
        cursor : pointer;
        color : #5fab3d;
        font-size : 12px;
        transtion : all 0.2s;
        border-radius : 8px;
        :hover{ 
            background-color : #5fab3d;
            color : white;
        }
    }
    position : absolute;
    transition : all 0.2s;
    width : 100%;
    height : ${({ active }) => active ? '58px' : '0'};
    overflow : hidden;
`;

const Criteria = styled.input`
    background-color : #cffabc;
    border-radius : 8px;
    border : none;
    padding : 5px;
    outline:none;
    color : #56ced7;
    font-size : 12px;
`;


const PoolPanel = styled(Box)`
    max-width : 875px;
    margin : 0 auto;
    @media screen and (max-width : 900px){
        max-width : calc(100vw - 40px);
    }
`;

export default Pool;
