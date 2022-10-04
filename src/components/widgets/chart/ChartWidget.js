// Packages
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// Material UI
// import AddIcon from '@material-ui/icons/Add';
// import BarChartIcon from '@material-ui/icons/BarChart';
// import Chip from '@material-ui/core/Chip';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
// import FormControl from '@material-ui/core/FormControl';
// import NativeSelect from '@material-ui/core/NativeSelect';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';

// Widgets
import { TechnicalAnalysisChart } from "../../pages/Technical-analysis-chart";
import ChartInfo from 'components/widgets/chart/ChartInfo';
import SwapSection from 'components/widgets/chart/SwapSection';

// Services
// import {
//   searchTokenFromDexGuru,
// } from 'components/services/Tokens';

// Library
// import {
//   useLocalStorage,
// } from 'components/libraries/Common';

// package.json
// var pjson = require('./../../../../package.json');

// Styles
const useStyles = makeStyles((theme) => ({
  info: {
    paddingTop: theme.spacing(2),
  },
  chart: {
    boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    height: 400,
    [theme.breakpoints.down("xs")]: {
      height: 300,
    },
  },
  buttons: {
    marginBottom: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttonReload: {
    padding: '0 30px',
    height: '36px',
    borderRadius: 18,
    fontSize: 12,
    fontWeight: 600,
    background: '#7ED321 !important',

    '&:hover': {
      backgroundColor: '#BEFE77 !important',
    },
  },

  formControl: {
    minWidth: 60,
  },
  formControlSelect: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
    marginBottom: 10,
    background: '#62d2cf',
    borderRadius: '0.375rem',
    transition: 'all 0.3s ease',
    padding: '0 16px',

    '& .MuiNativeSelect-root': {
      color: '#103469',
    },

    '&:before': {
      border: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      border: 'none',
    },
    '&:after': {
      border: 'none',
    },

    '& .MuiSvgIcon-root': {
      color: '#103469',
    },

    '&:hover': {
      background: 'white',
    },
  },
}));

export default function ChartWidget(props) {
  const classes = useStyles();

  const {
    // addWatchList,
    className,
    // enqueueSnackbar,
    // findTokenInWatchList,
    // scrollTo,
    network,
    setNetwork,
    // setTokenListActivedTab,
    token,
    // updateTokenAlertHighlightInWatchListByAddress,
    // updateTokenAlertOpenInWatchListByAddress,
  } = props;

  let
    timeoutNow = useRef();

  const [now, setNow] = useState(new Date());

  const renderNow = () => {
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    }).format(now);
  }

  useEffect(() => {
    if (token) {
      timeoutNow.current = setInterval(() => {
        setNow(new Date());
      }, 500);

      return function cleanup() {
        clearTimeout(timeoutNow.current);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const addTokenToWatchlist = token => {
  //   if (findTokenInWatchList(token)) {
  //     enqueueSnackbar('This token has already existed on the watchlist.');
  //     activeWatchlistAndScrollTo(`watchlist-row-${token}`);
  //   } else {
  //     searchTokenFromDexGuru(token).then(result => {
  //       if (result && result.value && result.value.length > 0) {
  //         addWatchList(result.value[0]);
  //         enqueueSnackbar('This token has been added to the watchlist already.');
  //         activeWatchlistAndScrollTo(`watchlist-row-${token}`);
  //       } else {
  //         enqueueSnackbar('Can not file token');
  //       }
  //     });
  //   }
  // }

  // const addAlerts = token => {
  //   if (findTokenInWatchList(token)) {
  //     enqueueSnackbar('This token has already existed on the watchlist. Press the ADD ALERT button to get started adding alerts.');
  //     updateTokenAlertOpenInWatchListByAddress(token, true);
  //     updateTokenAlertHighlightInWatchListByAddress(token, true);
  //     activeWatchlistAndScrollTo(`watchlist-row-${token}`);
  //   } else {
  //     searchTokenFromDexGuru(token).then(result => {
  //       if (result && result.value && result.value.length > 0) {
  //         addWatchList(result.value[0]);
  //         updateTokenAlertOpenInWatchListByAddress(token, true);
  //         updateTokenAlertHighlightInWatchListByAddress(token, true);
  //         enqueueSnackbar('This token has been added to the watchlist already. Press the ADD ALERT button to get started adding alerts.');
  //         activeWatchlistAndScrollTo(`watchlist-row-${token}`);
  //       } else {
  //         enqueueSnackbar('Can not file token');
  //       }
  //     });
  //   }
  // }

  // const activeWatchlistAndScrollTo = id => {
  //   setTokenListActivedTab("watchlist");
  //   setTimeout(() => {
  //     scrollTo(id);
  //   });
  // }

  // const [intervals, setIntervals] = useLocalStorage('intervals', 60);

  // const handleChange = (event) => {
  //   setIntervals(event.target.value);
  // };

  const reloadChart = () => {
    // document.getElementById('chart').contentWindow.location.reload();
    if (document.querySelector('#ta_chart_container iframe')) {
      document.querySelector('#ta_chart_container iframe').contentWindow.location.reload();
    }
  };

  // useEffect(() => {
  //   reloadChart();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [intervals]);

  return (
    <div className={className} id="chart-widget">
      <Box className={classes.info}>
        <ChartInfo
          {...props}
          token={token}
          setNetwork={setNetwork}
        />

        <SwapSection
          {...props}
          token={token}
          network={network}
        />

        <Box className={classes.buttons}>
          <Button
            size="small"
            variant="contained"
            onClick={reloadChart}
            startIcon={<RefreshIcon />}
            className={clsx(classes.button, classes.buttonReload)}
          >Reload chart</Button>

          {/*<FormControl className={classes.formControl}>*/}
          {/*  <NativeSelect*/}
          {/*    value={intervals}*/}
          {/*    className={classes.formControlSelect}*/}
          {/*    onChange={handleChange}*/}
          {/*  >*/}
          {/*    <optgroup label="MINUTES">*/}
          {/*      <option value="1">1 minute</option>*/}
          {/*      <option value="5">5 minutes</option>*/}
          {/*      <option value="10">10 minutes</option>*/}
          {/*      <option value="30">30 minutes</option>*/}
          {/*    </optgroup>*/}
          {/*    <optgroup label="HOURS">*/}
          {/*      <option value="60">1 hour</option>*/}
          {/*      <option value="240">4 hours</option>*/}
          {/*      <option value="720">12 hours</option>*/}
          {/*    </optgroup>*/}
          {/*    <optgroup label="DAYS">*/}
          {/*      <option value="1440">1 day</option>*/}
          {/*      <option value="10080">1 week</option>*/}
          {/*    </optgroup>*/}
          {/*  </NativeSelect>*/}
          {/*</FormControl>*/}

          {/* <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              addTokenToWatchlist(token);
            }}
            startIcon={<AddIcon />}
            className={classes.button}
          >Add to Watchlist</Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              addAlerts(token);
            }}
            startIcon={<NotificationsActiveIcon />}
            className={clsx(classes.button, props.classes.amberButton)}
          >Add alerts</Button> */}
        </Box>

        {/* <Box className={props.classes.marginBottom}>
          <Chip variant="outlined" size="small" icon={<BarChartIcon />} label="1 hour" />
        </Box> */}
      </Box>
      <TechnicalAnalysisChart
        {...props}
        token={token}
        setNetwork={setNetwork}
      />

      {/*<iframe id="chart" title="chart" frameBorder="0" width="100%" src={`/token/chart/${pjson.version}/${token}`} className={classes.chart}></iframe>*/}

      <Typography variant="body2" align="right" style={{ marginTop: 4 }}>
        {renderNow()}
      </Typography>
    </div>
  );
}
