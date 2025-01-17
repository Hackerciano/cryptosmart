import React from "react";
import cryptos from './consts/consts';
import stocks from './consts/consts';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import {
    Grid,
    Typography,
    Tabs,
    Tab,
    Box,
    Button,
    Dialog,
} from '@mui/material';
import { useEffect } from "react";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function Tables() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [cryptosData, setCryptosData] = React.useState([]);
    const [stocksData, setStocksData] = React.useState([]);
    const [mode, setMode] = React.useState(0);

    useEffect(() => {
        //updateCryptos();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeMode = (event, newValue) => {
        setMode((mode === 0) ? 1 : 0);
    }

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    // Valid for investing.com
    const updateCryptos = async () => {
        // Update crypto currencies
        setOpen(true);
        // Check for mode
        let tempData = cryptos.cryptos;
        for (let i = 0; i < tempData.length; i++) {
            const pid = tempData[i];
            const pidData = await callInvesting(pid.pairID, 'P1M', 'P1D', 120);
            let newValue = pidData.data.data;
            // Iterate between each value of date
            newValue.forEach((value, i) => {
                // Format date
                value[0] = getDate(value[0]);
                // Calculate suggestion
                let suggestion = calculateSuggestion(newValue, i);
                value[value.length] = suggestion;
            });
            tempData[i]['data'] = newValue;
        }


        setCryptosData(tempData);

        setOpen(false);
    }

    // Valid for yahoo finance
    const updateStocks = async () => {
        // Update stock currencies
        setOpen(true);
        let tempData = stocks.stocks;
        for (let i = 0; i < tempData.length; i++) {
            const yahooFinanceCode = tempData[i].yahooFinanceCode;
            // Obtain UNIX timestamp of today with a time of 00:00:00
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let todayUnix = Math.floor(today.getTime() / 1000);
            // Obtain UNIX timestamp of today - 1 month with a time of 00:00:00
            let oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            oneMonthAgo.setHours(0, 0, 0, 0);
            let oneMonthAgoUnix = Math.floor(oneMonthAgo.getTime() / 1000);
            // Call Yahoo Finance API
            const pidData = await callYahooFinance(yahooFinanceCode, oneMonthAgoUnix, todayUnix);
            // Process response
            let newValue = [];
            const timestamps = pidData.data.chart.result[0].timestamp;
            const quotes = pidData.data.chart.result[0].indicators.quote[0];

            for (let j = 0; j < timestamps.length; j++) {
                let row = [
                    timestamps[j] * 1000, // Convert to milliseconds
                    quotes.open[j],
                    quotes.high[j],
                    quotes.low[j],
                    quotes.close[j],
                    quotes.volume[j],
                    0 // Placeholder for suggestion
                ];
                newValue.push(row);
            }

            // Iterate between each value of date
            newValue.forEach((value, i) => {
                // Format date
                value[0] = getDate(value[0]);
                // Calculate suggestion
                let suggestion = calculateSuggestion(newValue, i);
                value[value.length] = suggestion;
            });

            tempData[i]['data'] = newValue;
        }

        setStocksData(tempData);
        setOpen(false);
    }

    const callYahooFinance = (symbol, start, end) => {
        return axios({
            method: 'GET',
            url: `https://cors-anywhere-cs.vercel.app/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
            params: {
                period1: start,
                period2: end,
                interval: '1d',
                // includePrePost: false,
                events: 'div,splits',
                formatted: true,
                includeAdjustedClose: true,
                useYfid: true,
                lang: 'en-US',
                region: 'US'
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Origin' : 'http://localhost:3000'
            }
        });
    }

    const callInvesting = (pairId, period, interval, pointscount) => {
        return axios({
            method: 'GET',
            url: `https://api.investing.com/api/financialdata/${pairId}/historical/chart/`,
            params: {
                period,
                interval,
                pointscount,
            },
        });
    }

    const getDate = (unixEpoch) => {
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCMilliseconds(unixEpoch);
        d = d.toISOString().split('T')[0];
        const [year, month, day] = d.split('-');
        const result = [day, month, year].join('-');
        return result;
    }

    const copyRows = (row1, row2) => {
        let copied = '<table><tr>';
        if (row1) {
            row1.forEach((item, i) => {
                (item != 0 && i <= 5) && (copied = copied + `<td>${item}</td>`);
            });
            copied = copied + '</tr>';
        }
            
        if (row2) {
            copied = copied + '<tr>';
            row2.forEach((item, i) => {
                (item != 0 && i <= 5) && (copied = copied + `<td>${item}</td>`);
            });
            copied = copied + '</tr>';
        }
        copied = copied + '</table>';
        const blob = new Blob([copied], { type: "text/plain" });
        const tableHtml = new window.ClipboardItem({ "text/plain": blob });

        navigator.clipboard.write([tableHtml]).then(function () {
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    const copyAll = (day) => {
        let pivot = 
            // If mode is 0 (crypto then pivot is 2 on day 1 and 3 on day 2)
            // If mode is 1 (stocks then pivot is 1 on day 1 and 2 on day 2)
            (mode === 0) ? ((day === 1) ? 2 : 3) : ((day === 1) ? 1 : 2);
        let data = (mode === 0) ? cryptosData : stocksData;

        let copied = '<table><tr>';
        data.forEach(value => {
            copied = copied + `<td>${value.name} - ${value.shortName}</td>`;
            copied = copied + `<td>${value.data[value.data.length - pivot][0]}</td>`; // Date
            copied = copied + `<td>${value.data[value.data.length - pivot][1]}</td>`; // Open
            copied = copied + `<td>${value.data[value.data.length - pivot][2]}</td>`; // High
            copied = copied + `<td>${value.data[value.data.length - pivot][3]}</td>`; // Low
            copied = copied + `<td>${value.data[value.data.length - pivot][4]}</td>`; // Close
            copied = copied + `<td>${value.data[value.data.length - pivot][5]}</td>`; // Vol

            copied = copied + '</tr>';
        });
        copied = copied + '</table>';
        const blob = new Blob([copied], { type: "text/plain" });
        const tableHtml = new window.ClipboardItem({ "text/plain": blob });

        navigator.clipboard.write([tableHtml]).then(function () {
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    const calculateSuggestion = (bulkData, index) => {
        let tbd = bulkData;
        let absolute = (Number(tbd[index][2]) - Number(tbd[index][3]));
        tbd[index].push(absolute);

        // IF INDEX GREATER OR EQUAL TO 8, THEN CALCULATE AVERAGE
        if (index >= 8) {
            let avg = 0;
            let start = index - 8;
            let finish = index;
            for (let i = start; i <= finish; i++) {
                avg = avg + tbd[i][7]; 
            }
            avg =  avg / 9;
            tbd[index].push(avg);
        }

        // IF INDEX GREATER OR EQUAL TO 18, THEN CALCULATE SUGGESTION
        if (index >= 18) {
            let absAvg1 = (tbd[index][7] + tbd[index-1][7]+tbd[index-2][7]+tbd[index-3][7]+tbd[index-4][7]+tbd[index-5][7]+tbd[index-6][7]+tbd[index-7][7]+tbd[index-8][7])/9;
            let absAvg2 = (tbd[index-1][7] + tbd[index-2][7]+tbd[index-3][7]+tbd[index-4][7]+tbd[index-5][7]+tbd[index-6][7]+tbd[index-7][7]+tbd[index-8][7]+tbd[index-9][7])/9;
            let avgMax1 = Math.max(tbd[index-2][8], tbd[index-3][8], tbd[index-4][8], tbd[index-5][8], tbd[index-6][8], tbd[index-7][8], tbd[index-8][8]);
            let avgMin1 = Math.min(tbd[index-2][8], tbd[index-3][8], tbd[index-4][8], tbd[index-5][8], tbd[index-6][8], tbd[index-7][8], tbd[index-8][8]);
            let avgMax2 = Math.max(tbd[index-3][8], tbd[index-4][8], tbd[index-5][8], tbd[index-6][8], tbd[index-7][8], tbd[index-8][8], tbd[index-9][8]);
            let avgMin2 = Math.min(tbd[index-3][8], tbd[index-4][8], tbd[index-5][8], tbd[index-6][8], tbd[index-7][8], tbd[index-8][8], tbd[index-9][8]);
            let close = bulkData[index][4];
            let highAvg = (bulkData[index][2] + bulkData[index - 1][2] + bulkData[index - 2][2]) / 3;

            if ((avgMax1 < absAvg1 && avgMax2 >= absAvg2) && close > highAvg) {
                return "COMPRA";
            } else if ((avgMin1 > absAvg1 && avgMin2 <= absAvg2) && close < highAvg) {
                return "VENTA";
            } else {
                return "";
            }

        }
    
    }



    return (
        <div>
            <Grid style={{ margin: '2vw' }}>
                <Grid container>
                    <Dialog open={open}>
                        <Grid style={{ margin: '40px' }}>
                            <h1>Making magic...</h1>
                            <CircularProgress />
                        </Grid>
                    </Dialog>
                    <Grid item textAlign={'left'} xs={3}>
                        <h1>Hola Juan Carlos 👋🏻</h1>
                        <h3>Cryptosmart Web v1.3.0</h3>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="outlined" style={{ marginTop: '50px' }} onClick={() => {
                            (mode === 0) ? updateCryptos() : updateStocks();
                        }}>Actualizar datos</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button disabled={(mode === 0) ? (cryptosData.length === 0) : (stocksData.length === 0)} variant="outlined" style={{ marginTop: '50px' }} onClick={() => copyAll(1)}>Copiar todo dia 1</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button disabled={(mode === 0) ? (cryptosData.length === 0) : (stocksData.length === 0)} variant="outlined" style={{ marginTop: '50px' }} onClick={() => copyAll(2)}>Copiar todo dia 2</Button>
                    </Grid>
                </Grid>
                <Grid>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Tabs
                            value={mode}
                            onChange={handleChangeMode}
                            variant="fullWidth"
                            fullWidth
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label='Cryptos' icon={'₿ '}></Tab>
                            <Tab label='Stocks' icon={'📈 '}></Tab>
                        </Tabs>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={mode}
                            onChangeIndex={handleChangeIndex}
                        >

                            {/* ************************************************************ */}
                            {/* Cryptos */}
                            {/* ************************************************************ */}


                            <TabPanel>
                                <Paper elevation={6}>
                                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            allowScrollButtonsMobile
                                            aria-label="scrollable auto tabs example"
                                        >
                                            <Tab label='Resumen' icon={'📊 '}></Tab>
                                            {cryptos.cryptos.map((crypto, i) =>
                                                <Tab label={crypto.shortName} icon={
                                                    <div style={{
                                                        width: '14px',
                                                        height: '11px',
                                                        overflow: 'hidden',
                                                        backgroundImage: "url('https://i-invdn-com.investing.com/next_/images/components/flags/currency-v3.svg')",
                                                        backgroundPositionX: crypto.backPos
                                                    }} />
                                                }></Tab>
                                            )}
                                        </Tabs>
                                        <SwipeableViews
                                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                            index={value}
                                            onChangeIndex={handleChangeIndex}
                                        >
                                            <TabPanel>
                                                <Grid textAlign={'left'}>
                                                    <h3>Resumen</h3>
                                                </Grid>
                                                <TableContainer component={Paper} style={{maxHeight: '60vh', height: '60vh'}}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Date</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Open</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">High</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Low</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Close</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Volume</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Sugerencia</TableCell>
                                                                <TableCell align="right" style={{color: 'blue',backgroundColor: '#e9ecef'}}>Acciones</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        {(cryptosData.length != 0) ?
                                                                cryptosData.map((crypto) => {
                                                                    let maxLengthCrypto = crypto.data.length;
                                                                    
                                                                    return (
                                                                        <TableBody>
                                                                            <TableRow style={{backgroundColor: '#BBE6E4'}}>
                                                                                <TableCell colSpan={8} align='center'>{crypto.name} - {crypto.shortName}</TableCell>
                                                                            </TableRow>
                                                                            <TableRow className='table-row'>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    crypto.data[maxLengthCrypto-3][0]
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-3][1] < 1) ? crypto.data[maxLengthCrypto-3][1] : crypto.data[maxLengthCrypto-3][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-3][2] < 1) ? crypto.data[maxLengthCrypto-3][2] : crypto.data[maxLengthCrypto-3][2].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-3][3] < 1) ? crypto.data[maxLengthCrypto-3][3] : crypto.data[maxLengthCrypto-3][3].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-3][4] < 1) ? crypto.data[maxLengthCrypto-3][4] : crypto.data[maxLengthCrypto-3][4].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-3][5] < 1) ? crypto.data[maxLengthCrypto-3][5] : crypto.data[maxLengthCrypto-3][5].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    crypto.data[maxLengthCrypto-3][9]
                                                                                }</TableCell>
                                                                                
                                                                                {/* Copy buttons */}
                                                                                <TableCell className='table-cell' align="right" rowSpan={2} style={{textAlign: 'center'}}>
                                                                                    <Button style={{display: 'block', width: '200px'}} variant='outlined' onClick={() => copyRows(crypto.data[maxLengthCrypto-2])}>Copiar 1 dia</Button>
                                                                                    <Button style={{display: 'block', width: '200px'}} variant='outlined' onClick={() => copyRows(crypto.data[maxLengthCrypto-3], crypto.data[maxLengthCrypto-2])}>Copiar 2 dias</Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow className='table-row'>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    crypto.data[maxLengthCrypto-2][0]
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-2][1] < 1) ? crypto.data[maxLengthCrypto-2][1] : crypto.data[maxLengthCrypto-2][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-2][2] < 1) ? crypto.data[maxLengthCrypto-2][2] : crypto.data[maxLengthCrypto-2][2].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-2][3] < 1) ? crypto.data[maxLengthCrypto-2][3] : crypto.data[maxLengthCrypto-2][3].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-2][4] < 1) ? crypto.data[maxLengthCrypto-2][4] : crypto.data[maxLengthCrypto-2][4].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (crypto.data[maxLengthCrypto-2][5] < 1) ? crypto.data[maxLengthCrypto-2][5] : crypto.data[maxLengthCrypto-2][5].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    crypto.data[maxLengthCrypto-2][9]
                                                                                }</TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    )
                                                                })
                                                        :
                                                        ''
                                                        }
                                                    </Table>
                                                </TableContainer>




                                            {/* Tab panel for each crypto currency and its table     */}
                                            </TabPanel>
                                            {cryptos.cryptos.map((crypto, i) =>
                                                <TabPanel>
                                                    <Grid textAlign={'left'}>
                                                        <h3>{crypto.name}</h3>
                                                        <TableContainer component={Paper}>
                                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Date</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Open</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">High</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Low</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Close</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Volume</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Sugerencia</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                {(cryptosData.length != 0) ?
                                                                    <TableBody>
                                                                    {cryptosData[i].data.map((value) => (
                                                                        <TableRow className='table-row'>
                                                                            <TableCell className='table-cell' align="right">{value[0]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[1]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[2]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[3]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[4]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[5]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[9]}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                                :
                                                                ''
                                                                }
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </TabPanel>
                                            )}
                                        </SwipeableViews>
                                    </Box>
                                </Paper>
                            </TabPanel>

                            {/* ************************************************************ */}
                            {/* Stocks */}
                            {/* ************************************************************ */}

                            <TabPanel>
                                <Paper elevation={6}>
                                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            allowScrollButtonsMobile
                                            aria-label="scrollable auto tabs example"
                                        >
                                            <Tab label='Resumen' icon={'📊 '}></Tab>
                                            {stocks.stocks.map((crypto, i) =>
                                                <Tab label={crypto.shortName} icon={
                                                    <div style={{
                                                        width: '14px',
                                                        height: '11px',
                                                        overflow: 'hidden',
                                                        backgroundImage: "url('https://i-invdn-com.investing.com/next_/images/components/flags/currency-v3.svg')",
                                                        backgroundPositionX: crypto.backPos
                                                    }} />
                                                }></Tab>
                                            )}
                                        </Tabs>
                                        <SwipeableViews
                                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                            index={value}
                                            onChangeIndex={handleChangeIndex}
                                        >
                                            <TabPanel>
                                                <Grid textAlign={'left'}>
                                                    <h3>Resumen</h3>
                                                </Grid>
                                                <TableContainer component={Paper} style={{maxHeight: '60vh', height: '60vh'}}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Date</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Open</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">High</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Low</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Close</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Volume</TableCell>
                                                                <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Sugerencia</TableCell>
                                                                <TableCell align="right" style={{color: 'blue',backgroundColor: '#e9ecef'}}>Acciones</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        {(stocksData.length != 0) ?
                                                                stocksData.map((stock) => {
                                                                let maxLengthStocks = stock.data.length;

                                                                    return (
                                                                        <TableBody>
                                                                            <TableRow style={{backgroundColor: '#BBE6E4'}}>
                                                                                <TableCell colSpan={8} align='center'>{stock.name} - {stock.shortName}</TableCell>
                                                                            </TableRow>
                                                                            <TableRow className='table-row'>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    stock.data[maxLengthStocks-2][0]
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-2][1] < 1) ? stock.data[maxLengthStocks-2][1] : stock.data[maxLengthStocks-2][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-2][2] < 1) ? stock.data[maxLengthStocks-2][2] : stock.data[maxLengthStocks-2][2].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-2][3] < 1) ? stock.data[maxLengthStocks-2][3] : stock.data[maxLengthStocks-2][3].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-2][4] < 1) ? stock.data[maxLengthStocks-2][4] : stock.data[maxLengthStocks-2][4].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-2][5] < 1) ? stock.data[maxLengthStocks-2][5] : stock.data[maxLengthStocks-2][5].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    stock.data[maxLengthStocks-2][9]
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right" rowSpan={2} style={{textAlign: 'center'}}>
                                                                                    <Button style={{display: 'block', width: '200px'}} variant='outlined' onClick={() => copyRows(stock.data[maxLengthStocks-1])}>Copiar 1 dia</Button>
                                                                                    <Button style={{display: 'block', width: '200px'}} variant='outlined' onClick={() => copyRows(stock.data[maxLengthStocks-2], stock.data[maxLengthStocks-1])}>Copiar 2 dias</Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow className='table-row'>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    stock.data[maxLengthStocks-1][0]
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-1][1] < 1) ? stock.data[maxLengthStocks-1][1] : stock.data[maxLengthStocks-1][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-1][2] < 1) ? stock.data[maxLengthStocks-1][2] : stock.data[maxLengthStocks-1][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-1][3] < 1) ? stock.data[maxLengthStocks-1][3] : stock.data[maxLengthStocks-1][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-1][4] < 1) ? stock.data[maxLengthStocks-1][4] : stock.data[maxLengthStocks-1][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    (stock.data[maxLengthStocks-1][5] < 1) ? stock.data[maxLengthStocks-1][5] : stock.data[maxLengthStocks-1][1].toLocaleString("en-US")
                                                                                }</TableCell>
                                                                                <TableCell className='table-cell' align="right">{
                                                                                    stock.data[maxLengthStocks-1][9]
                                                                                }</TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    )
                                                                })
                                                        :
                                                        ''
                                                        }
                                                    </Table>
                                                </TableContainer>




                                            {/* Tab panel for each stock currency and its table     */}
                                            </TabPanel>
                                            {stocks.stocks.map((stock, i) =>
                                                <TabPanel>
                                                    <Grid textAlign={'left'}>
                                                        <h3>{stock.name}</h3>
                                                        <TableContainer component={Paper}>
                                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Date</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Open</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">High</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Low</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Close</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Volume</TableCell>
                                                                        <TableCell style={{backgroundColor: '#e9ecef'}} align="right">Sugerencia</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                {(stocksData.length != 0) ?
                                                                    <TableBody>
                                                                    {stocksData[i].data.map((value) => (
                                                                        <TableRow className='table-row'>
                                                                            <TableCell className='table-cell' align="right">{value[0]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[1]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[2]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[3]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[4]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[5]}</TableCell>
                                                                            <TableCell className='table-cell' align="right">{value[9]}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                                :
                                                                ''
                                                                }
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </TabPanel>
                                            )}
                                        </SwipeableViews>
                                    </Box>
                                </Paper>
                            </TabPanel>
                        </SwipeableViews>
                    </Box>
                </Grid>
                <Grid>
                    
                </Grid>
            </Grid>
        </div>
    )
}