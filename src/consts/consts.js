const cryptos = [
    {
        name: 'bitcoin',
        shortName: 'BTC',
        pairID: '1057391',
        backPos: '-392px'
    },
    {
        name: 'Stellar',
        shortName: 'XLM',
        pairID: '1061451',
        backPos: '-98px'
    },
    {
        name: 'Basic Attention Token',
        shortName: 'BAT',
        pairID: '1061774',
        backPos: '-392px'
    },
    {
        name: 'Etherium',
        shortName: 'ETH',
        pairID: '1061443',
        backPos: '-308px'
    },
    {
        name: 'Cardano',
        shortName: 'ADA',
        pairID: '1062537',
        backPos: '-322px'
    },
    {
        name: '0x',
        shortName: 'ZRX',
        pairID: '1061803',
        backPos: '-392px'
    },
    {
        name: 'Avalanche',
        shortName: 'AVAX',
        pairID: '1177190',
        backPos: '-392px'
    },
    {
        name: 'Aave',
        shortName: 'AAVE',
        pairID: '1061509',
        backPos: '-392px'
    },
    {
        name: 'IOTA',
        shortName: 'MIOTA',
        pairID: '1061449',
        backPos: '-392px'
    },
    {
        name: 'Ontology',
        shortName: 'ONT',
        pairID: '1075377',
        backPos: '-392px'
    },
    {
        name: 'VeChain',
        shortName: 'VET',
        pairID: '1061537',
        backPos: '-392px'
    },
    {
        name: 'Tron',
        shortName: 'TRX',
        pairID: '1061450',
        backPos: '-392px'
    },
    {
        name: 'Litecoin',
        shortName: 'LTC',
        pairID: '1061445',
        backPos: '-392px'
    },
    {
        name: 'NEO',
        shortName: 'NEO',
        pairID: '1061409',
        backPos: '-392px'
    },
    {
        name: 'Atom',
        shortName: 'ATOM',
        pairID: '1071461',
        backPos: '-392px'
    },
    {
        name: 'Shiba Inu',
        shortName: 'SHIBA',
        pairID: '1177506',
        backPos: '-392px'
    },
    {
        name: 'Binance',
        shortName: 'BNB',
        pairID: '1061448',
        backPos: '-392px'
    },
    {
        name: 'Bitcoin cash',
        shortName: 'BCH',
        pairID: '1061410',
        backPos: '-392px'
    },
    {
        name: 'XRP',
        shortName: 'XRP',
        pairID: '1057392',
        backPos: '-392px'
    },
    {
        name: 'Chainlink',
        shortName: 'LINK',
        pairID: '1061794',
        backPos: '-392px'
    },
    {
        name: 'Dogecoin',
        shortName: 'DOGE',
        pairID: '1061477',
        backPos: '-392px'
    },
    {
        name: '1INCH',
        shortName: '1INCH',
        pairID: '1169571',
        backPos: '-392px'
    },
    {
        name: 'Solana',
        shortName: 'SOL',
        pairID: '1177183',
        backPos: '-392px'
    },
    {
        name: 'MBOX',
        shortName: 'MBOX',
        pairID: '1180892',
        backPos: '-392px'
    },
    {
        name: 'FET',
        shortName: 'FET',
        pairID: '1142591',
        backPos: '-392px'
    }
];

const stocks = [
    { shortName: 'AAPL', name: 'APPLE COMPUTER INC.', pairID: '30130', backPos: '-392px' },
    { shortName: 'ABNB', name: 'AIRBNB, INC.', pairID: '1172004', backPos: '-392px' },
    { shortName: 'ALFAA', name: 'ALFA, S.A.B. DE C.V.', pairID: '27065', backPos: '-392px' },
    { shortName: 'ALPEKA', name: 'ALPEK, S.A.B. DE C.V.', pairID: '31092', backPos: '-392px' },
    { shortName: 'ALSEA', name: 'ALSEA, S.A.B. DE C.V.', pairID: '27066', backPos: '-392px' },
    { shortName: 'AMD', name: 'ADVANCED MICRO DEVICES INC.', pairID: '993706', backPos: '-392px' },
    { shortName: 'AMZN', name: 'AMAZON. COM INC.', pairID: '30137', backPos: '-392px' },
    { shortName: 'BAC', name: 'BANK OF AMERICA CORP.', pairID: '993713', backPos: '-392px' },
    { shortName: 'BIMBOA', name: 'GRUPO BIMBO, S.A.B. DE C.V.', pairID: '27075', backPos: '-392px' },
    { shortName: 'BOLSAA', name: 'BOLSA MEXICANA DE VALORES, S.A.B. DE C.V.', pairID: '27076', backPos: '-392px' },
    { shortName: 'CEMEXCPO', name: 'CEMEX, S.A.B. DE C.V.', pairID: '27024', backPos: '-392px' },
    { shortName: 'DIS', name: 'THE WALT DISNEY COMPANY', pairID: '30007', backPos: '-392px' },
    { shortName: 'FEMSAUBD', name: 'FOMENTO ECONOMICO MEXICANO, S.A.B. DE C.V.', pairID: '27102', backPos: '-392px' },
    { shortName: 'GAPB', name: 'GRUPO AEROPORTUARIO DEL PACIFICO, S.A. DE C.V.', pairID: '26963', backPos: '-392px' },
    { shortName: 'GCARSOA1', name: 'GRUPO CARSO, S.A.B. DE C.V.', pairID: '27112', backPos: '-392px' },
    { shortName: 'GFNORTEO', name: 'GRUPO FINANCIERO BANORTE, S.A.B. DE C.V.', pairID: '27101', backPos: '-392px' },
    { shortName: 'GMEXICOB', name: 'GRUPO MEXICO, S.A.B. DE C.V.', pairID: '27109', backPos: '-392px' },
    { shortName: 'GOOGL', name: 'GOOGLE INC.', pairID: '993784', backPos: '-392px' },
    { shortName: 'INTC', name: 'INTEL CORPORATION', pairID: '29989', backPos: '-392px' },
    { shortName: 'JPM', name: 'JP MORGAN CHASE & CO.', pairID: '993800', backPos: '-392px' },
    { shortName: 'META', name: 'META PLATFORMS, INC.', pairID: '993034', backPos: '-392px' },
    { shortName: 'MSFT', name: 'MICROSOFT CORPORATION', pairID: '29993', backPos: '-392px' },
    { shortName: 'NFLX', name: 'NETFLIX, INC.', pairID: '993835', backPos: '-392px' },
    { shortName: 'NKE', name: 'NIKE, INC.', pairID: '993836', backPos: '-392px' },
    { shortName: 'NVDA', name: 'NVIDIA CORPORATION', pairID: '993840', backPos: '-392px' },
    { shortName: 'PE&OLES', name: 'INDUSTRIAS PEÑOLES, S.A.B. DE C.V.', pairID: '27161', backPos: '-392px' },
    { shortName: 'PYPL', name: 'PAYPAL HOLDINGS, INC.', pairID: '997508', backPos: '-392px' },
    { shortName: 'SBUX', name: 'STARBUCKS CORP.', pairID: '993857', backPos: '-392px' },
    { shortName: 'SHY', name: 'ISHARES LEHMAN 1-3 YEAR TREASURY BOND FUND', pairID: '1036845', backPos: '-392px' },
    { shortName: 'TSLA', name: 'TESLA, INC.', pairID: '993877', backPos: '-392px' },
    { shortName: 'VOLARA', name: 'CONTROLADORA VUELA COMPAÑIA DE AVIACION, S.A.B. DE', pairID: '103965', backPos: '-392px' },
    { shortName: 'WALMEX', name: 'WAL - MART DE MEXICO, S.A.B. DE C.V.', pairID: '27186', backPos: '-392px' },
    { shortName: 'USD/MXN', name: 'US Dollar Mexican Peso', pairID: '39', backPos: '-392px' },
    { shortName: 'NASDAQ Composite', name: 'NASDAQ Composite (IXIC)', pairID: '14958', backPos: '-392px' },
    { shortName: 'Dow Jones', name: 'Dow Jones Industrial Average (DJI)', pairID: '169', backPos: '-392px' },
    { shortName: 'S&P 500', name: 'S&P 500 (SPX)', pairID: '166', backPos: '-392px' },
    { shortName: 'S&P/BMV IPC', name: 'S&P/BMV IPC (MXX)', pairID: '27254', backPos: '-392px' },
];

export default { cryptos, stocks }