import React from "react";
import cryptos from './consts/consts';
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
    Select,
    MenuItem
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
    const [maxLength, setMaxLength] = React.useState(0);

    useEffect(() => {
        //updateCryptos();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const updateCryptos = async () => {
        // Update crypto currencies
        setOpen(true);
        let tempData = cryptos.cryptos;
        for (let i = 0; i < tempData.length; i++) {
            const crypto = tempData[i];
            const cryptoData = await callInvesting(crypto.pairID, 'P1W', 'P1D', 120);
            const newValue = cryptoData.data.data;
            // Format date
            newValue.forEach(value => {
                value[0] = getDate(value[0]);
            });
            tempData[i]['data'] = newValue;
        }
        setCryptosData(tempData);
        setMaxLength(tempData[0].data.length);
        setOpen(false);
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
        const result = [day, month, year].join('/');
        return result;
    }

    const copyRows = (row1, row2) => {
        let copied = '<table><tr>';
        if (row1) {
            row1.forEach((item, i) => {
                (item != 0) && (copied = copied + `<td>${item}</td>`);
            });
            copied = copied + '</tr>';
        }
            
        if (row2) {
            copied = copied + '<tr>';
            row2.forEach((item, i) => {
                (item != 0) && (copied = copied + `<td>${item}</td>`);
            });
            copied = copied + '</tr>';
        }
        copied = copied + '</table>';
        const blob = new Blob([copied], { type: "text/html" });
        const tableHtml = new window.ClipboardItem({ "text/html": blob });

        navigator.clipboard.write([tableHtml]).then(function () {
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
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
                    <Grid item textAlign={'left'} xs={6}>
                        <h1>Hola Juan Carlos 👋🏻</h1>
                        <h3>Cryptosmart Web v1.0.1</h3>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="outlined" style={{ marginTop: '50px' }} onClick={() => updateCryptos()}>Actualizar datos</Button>
                    </Grid>
                </Grid>
                <Grid>
                    <Box sx={{ maxWidth: { xs: '100%', sm: '100%' }, bgcolor: 'background.paper' }}>
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
                                                <TableCell align="right" style={{color: 'blue',backgroundColor: '#e9ecef'}}>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {(cryptosData.length != 0) ?
                                                cryptosData.map((crypto) => (
                                                        <TableBody>
                                                            <TableRow style={{backgroundColor: '#BBE6E4'}}>
                                                                <TableCell colSpan={7} align='center'>{crypto.name} - {crypto.shortName}</TableCell>
                                                            </TableRow>
                                                            <TableRow className='table-row'>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-2][0]}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-2][1].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-2][2].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-2][3].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-2][4].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-2][5].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right" rowSpan={2} style={{textAlign: 'center'}}>
                                                                    <Button style={{display: 'block', width: '200px'}} variant='outlined' onClick={() => copyRows(crypto.data[1])}>Copiar 1 dia</Button>
                                                                    <Button style={{display: 'block', width: '200px'}} variant='outlined' onClick={() => copyRows(crypto.data[0], crypto.data[1])}>Copiar 2 dias</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className='table-row'>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-3][0]}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-3][1].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-3][2].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-3][3].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-3][4].toLocaleString("en-US")}</TableCell>
                                                                <TableCell className='table-cell' align="right">{crypto.data[maxLength-3][5].toLocaleString("en-US")}</TableCell>
                                                                
                                                            </TableRow>
                                                        </TableBody>
                                                ))
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
                </Grid>
            </Grid>
        </div>
    )
}