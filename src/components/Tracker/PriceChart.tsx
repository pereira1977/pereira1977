import {
    AreaChart,
    Area,
    Line,
    ResponsiveContainer,
    Bar,
    BarChart,
    ComposedChart,
    CartesianGrid,
    Tooltip,
    LineChart,
    XAxis,
    YAxis,
} from 'recharts'

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { Box } from '@material-ui/core';
interface Props {
    data: any
}

const PriceChart: React.FC<Props> = ({ data }) => {
    const chartRef = useRef<any>();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        window.addEventListener('resize', function () {
            if(!chartRef.current) return;
            setWidth(chartRef.current.offsetWidth);
            setHeight(chartRef.current.offsetHeight);
        });
        if(!chartRef.current) return;
        setWidth(chartRef.current.offsetWidth);
        setHeight(chartRef.current.offsetHeight);
    }, [chartRef])
    return (
        <StyledContainer ref={chartRef}>
            {data.length ? <AreaChart width={width} height={height} data={data}
                margin={{ right: 10, left: 10 }}>
                <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(46,229,162)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="rgb(46,229,162)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" />

                <CartesianGrid />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="rgb(46,229,162)" strokeWidth={4} fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart> : ''}
        </StyledContainer>
    );
}

const StyledContainer = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    justify-content :center;
`;
export default PriceChart;