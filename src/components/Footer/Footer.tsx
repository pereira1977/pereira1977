import React from "react";
import styled from "styled-components";
import { Box, Link } from "@material-ui/core";

const Footer: React.FC = () => {
  return (
    <StyledContainer>
      <Box display={"flex"} flexDirection={"column"}>
        <SvgBox>
          <svg viewBox="0 0 772 159" width="130px" color="text" xmlns="http://www.w3.org/2000/svg">
            <image href="/images/logo/logo-horizontal.png"></image>
          </svg>
        </SvgBox>
        <TokenInfoBox>
          <ul>
            <li>Total Value Locked</li>
            <span style={{ fontSize: '16px' }}>{"$43,09.02"}</span>
          </ul>
          <Box display={'flex'} alignItems={'center'}>
            <img width={'32px'} src={'./logo.png'} />
            {/* <Box mr={'10px'} />
            <img width={'120px'} src={'/logotext.png'} /> */}
          </Box>
        </TokenInfoBox>
        <TokenSellBox>
          <Box>
            <TokenPriceBox>
              <Link href={'https://pancakeswap.finance/swap?outputCurrency=0x1e9692ceb06f4fba63009caab19610577fe57b18'}>
                <img width={'24x'} src={'./logo.png'} />
                <Box>{'$0.000156'}</Box>
              </Link>
            </TokenPriceBox>
            <TokenBuyBut href={'https://pancakeswap.finance/swap?outputCurrency=0x1e9692ceb06f4fba63009caab19610577fe57b18'}>BUY SHIBA KING</TokenBuyBut>
          </Box>
        </TokenSellBox>
      </Box>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  background-image: url("/images/footer/Footer.png");
  background-size: 100% 100%;
  width: 100%;
  /* height: calc(100vw / 1921 * 229); */
  font-size: calc(100vw / 1921 * 16);

  display: flex;
  justify-content: center;
  background: rgb(11, 36, 56);
  padding : 0px 20px;
  @media screen and (min-width: 576px) {
    padding: 35px 40px 32px;
    margin-bottom: 0px;
  }

  > div {
    width: 100%;

    @media screen and (min-width: 576px) {
      width: 1200px;
    }
  }
`;

const SvgBox = styled(Box)`
  margin-bottom: 24px;

  @media screen and (min-width: 576px) {
    display: none;
  }

  >svg {
    align-self: center;
    fill: rgb(21, 110, 155);
    flex-shrink: 0;
  }
`;

const TokenInfoBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    margin-bottom: 42px;;

    @media screen and (min-width: 576px) {
        order: 1;
        flex-direction: row;

        margin-bottom: 36px;
    }

    >ul {
        list-style: none;
        padding: 0;
        margin: 0;

        @media screen and (min-width: 852px) {
            margin-bottom: 0px;
        }

        li {
            color: rgb(89, 124, 179);
            font-weight: 600;
            text-transform: uppercase;

            font-size: 16px;
            margin-bottom: 8px;
        }

        span {
            color: rgb(172, 200, 235);
        }
    }
`;

const TokenSellBox = styled(Box)`
    border-color: rgb(0, 21, 44);
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-style: solid;
    padding: 24px 0px;
    margin-bottom: 24px;

    display: flex;
    order: 1;
    flex-direction: column;
    justify-content: space-between;
    border: none;
    @media screen and (min-width: 576px) {
        padding: 0px;
        margin-bottom: 0px;

        order: 3;
        flex-direction: row;
    }

    >div {
        @media screen and (min-width: 576px) {
            order: 2;

            margin-bottom: 0px;
        }

        display: flex;
        order: 1;
        -webkit-box-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        align-items: center;
        margin-bottom: 24px;
    }
`;

const TokenPriceBox = styled(Box)`
    margin-right: 20px;

    a {
        display: flex;
        align-items: center;

        color: inherit;
        text-decoration: none;
    }

    img {
        transition: transform 0.3s ease 0s;
        margin-right: 8px;
    }

    div {
        color: rgb(173, 195, 210);
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
    }
`;

const TokenBuyBut = styled.a`
    -webkit-box-align: center;
    align-items: center;
    border: 0px;
    border-radius: 16px;
    box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px 0px inset;
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
    background-color: rgb(239, 183, 0);
    color: white;

    text-decoration: none;

    &:hover {
        opacity: 0.65;
    }
`

export default Footer;
