// Packages
import { Link } from "react-router-dom";
import { orderBy } from "lodash";
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CountUp from 'react-countup';
import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

// Services
import {
  getWalletBalancesByAddress,
} from 'components/services/Tokens';

// Library
import {
  formatPrice,
  formatTokenPrice,
  getShortToken,
  useLocalStorage,
} from 'components/libraries/Common';

// Images
import bscscan from 'images/bscscan_40x40.png';

// Variable
import { CONSTANT } from 'config/Constant';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 600,
  },
  symbol: {
    color: '#808a9d',
    fontSize: 13,
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
  margin: {
    margin: theme.spacing(0.4),
    padding: theme.spacing(0.6),
  },
  iconLogo: {
    width: theme.spacing(3),
  },
  yourAddress: {
    lineHeight: '38px',
  },
  switch: {
    float: 'right',
  },
}));

export default function Wallet(props) {
  const classes = useStyles();

  const {
    addWatchList,
    connectWallet,
    copyToClipboard,
    enqueueSnackbar,
    findTokenInWatchList,
    history,
    isViewTokenPage,
    scrollTo,
    token,
    walletAddress,
  } = props;

  const
    cleaned = useRef(false),
    timeoutWalletBalances = useRef();

  const [walletBalances, setWalletBalances] = useLocalStorage('walletBalances', []);
  const latestWalletBalances = () => {
    return JSON.parse(localStorage.getItem('walletBalances')) || [];
  }

  const [updatingWalletBalances, setUpdatingWalletBalances] = useState();

  const processWalletBalances = items => {
    items.forEach(item => {
      item.balance_convert = item.balance / Math.pow(10, item.contract_decimals);
      item.balance_new_convert = item.balance_new / Math.pow(10, item.contract_decimals);

      if (item.show === undefined) {
        item.show = true;
      }

      if (item.balance_new === undefined) {
        item.balance_new = item.balance;
      }
    });

    return orderBy(items, ['quote', 'balance_convert', 'contract_name'], ['desc', 'desc', 'asc']);
  }

  const updateNewWalletBalances = items => {
    const
      cloneWalletBalances = [...latestWalletBalances()];

    items.forEach(item => {
      const findIndex = cloneWalletBalances.findIndex(x => x.contract_address === item.contract_address);

      if (findIndex > -1) {
        // Update new data
        if (item.contract_address === '0xc748673057861a797275cd8a068abb95a902e8de') {
          cloneWalletBalances[findIndex].balance = cloneWalletBalances[findIndex].balance_new;
          cloneWalletBalances[findIndex].balance_new = item.balance;
          cloneWalletBalances[findIndex].balance_24h = item.balance_24h;
          cloneWalletBalances[findIndex].quote = item.quote;
          cloneWalletBalances[findIndex].quote_rate = item.quote_rate;
        }
      } else {
        cloneWalletBalances.unshift(item);
      }
    });

    return processWalletBalances(cloneWalletBalances);
  }

  const updateWalletBalances = () => {
    if (!updatingWalletBalances) {
      setUpdatingWalletBalances(true);
      getWalletBalancesByAddress(walletAddress).then(result => {
        if (!cleaned.current) {
          if (result && !result.error && result.data && result.data.items) {
            setWalletBalances(updateNewWalletBalances(result.data.items));
          }

          timeoutWalletBalances.current = setTimeout(updateWalletBalances, CONSTANT.DELAY_TIME_WALLET_BALANCES);

          setUpdatingWalletBalances(false);
        }
      });
    }
  }

  const showWalletBalancesByKey = key => {
    const
      cloneWalletBalances = [...latestWalletBalances()];

    cloneWalletBalances[key].show = true;

    setWalletBalances(processWalletBalances(cloneWalletBalances));
  }

  const hideWalletBalancesByKey = key => {
    const
      cloneWalletBalances = [...latestWalletBalances()];

    cloneWalletBalances[key].show = false;

    setWalletBalances(processWalletBalances(cloneWalletBalances));
  }

  // First init
  useEffect(() => {
    cleaned.current = false;

    return function cleanup() {
      clearTimeout(timeoutWalletBalances.current);
      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // First init
  useEffect(() => {
    if (walletAddress) {
      updateWalletBalances();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const getChartClassName = address => {
    let
      chartClassName = classes.margin;

    if (isViewTokenPage() && token === address) {
      chartClassName = clsx(classes.margin, 'chartLiving');
    }

    return chartClassName;
  }

  const [showHiddenToken, setShowHiddenToken] = useLocalStorage('showHiddenToken', false);

  const WalletTableRow = props => {
    const {
      walletBalance,
      index,
    } = props;

    return (
      <TableRow>
        <TableCell>
          <Link to={`/token/${walletBalance.contract_address}`} className={props.classes.meoLinkV1}>
            {walletBalance.contract_name}
          </Link>
          <br />
          <span className={classes.symbol}>
            {getShortToken(walletBalance.contract_address)}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className={classes.symbol}>{walletBalance.contract_ticker_symbol}</span><br />

          ~{formatTokenPrice(walletBalance.quote_rate)}
        </TableCell>
        <TableCell align="right">
          <span className={classes.symbol}>
            {walletBalance.balance_new_convert &&
              <CountUp
                start={walletBalance.balance_convert}
                end={walletBalance.balance_new_convert}
                duration={CONSTANT.DELAY_TIME_WALLET_BALANCES / 1000}
                separator=","
                decimals={4}
                decimal="."
              />
            }
          </span><br />

          {formatPrice(walletBalance.quote)}
        </TableCell>
        <TableCell align="center" className={classes.nowrap}>

          <Tooltip title="Copy address" placement="top" arrow>
            <IconButton className={classes.margin}
              onClick={() => {
                copyToClipboard(walletBalance.contract_address)
                  .then(() => enqueueSnackbar('Copied to Clipboard'))
                  .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
              }} size="small">
              <FileCopyIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go to bscscan" placement="top" arrow>
            <IconButton className={classes.margin} target="_blank" href={`https://bscscan.com/token/${walletBalance.contract_address}`} size="small">
              <img src={bscscan} className={classes.iconLogo} alt="bscscan" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View chart" placement="top" arrow>
            <IconButton className={getChartClassName(walletBalance.contract_address)}
              href={`/token/${walletBalance.contract_address}`}
              onClick={(e) => {
                e.preventDefault();
                history.push(`/token/${walletBalance.contract_address}`);
                scrollTo('chart-section');
              }} size="small">
              <InsertChartIcon />
            </IconButton>
          </Tooltip>

        </TableCell>
        <TableCell align="center" className={classes.nowrap}>

          {!findTokenInWatchList(walletBalance.contract_address) &&
            <Tooltip title="Add this token to My Watchlist - Portfolio" placement="top" arrow>
              <IconButton
                onClick={() => {
                  addWatchList({
                    address: walletBalance.contract_address,
                    name: walletBalance.contract_name,
                    symbol: walletBalance.contract_ticker_symbol,
                    priceUSD: walletBalance.quote_rate,
                    balance: walletBalance.balance_convert,
                    network: 'bsc',
                  });
                }} size="small">
                <AddIcon />
              </IconButton>
            </Tooltip>
          }

          {findTokenInWatchList(walletBalance.contract_address) &&
            <Tooltip title="This token has added to My Watchlist - Portfolio" placement="top" arrow>
              <IconButton
                size="small">
                <CheckIcon />
              </IconButton>
            </Tooltip>
          }

          {walletBalance.show &&
            <Tooltip title="Hide this token" placement="top" arrow>
              <IconButton className={classes.margin}
                onClick={() => {
                  hideWalletBalancesByKey(index);
                }} size="small">
                <VisibilityOffIcon />
              </IconButton>
            </Tooltip>
          }

          {!walletBalance.show &&
            <Tooltip title="Show this token" placement="top" arrow>
              <IconButton className={classes.margin}
                onClick={() => {
                  showWalletBalancesByKey(index);
                }} size="small">
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          }

        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {!walletAddress &&
        <Box className={props.classes.empty}>
          <Typography variant="body2" className={props.classes.marginBottom}>
            Connect your wallet to see your tokens.
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={connectWallet}
          >Connect</Button>
        </Box>
      }

      {walletAddress &&
        <>
          <Typography variant="body2" className={clsx(props.classes.marginBottom, classes.yourAddress)}>
            Your address: <strong>{walletAddress}</strong>

            <Tooltip title="Copy address" placement="top" arrow>
              <IconButton className={classes.margin}
                onClick={() => {
                  copyToClipboard(walletAddress)
                    .then(() => enqueueSnackbar('Copied to Clipboard'))
                    .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
                }} size="small">
                <FileCopyIcon />
              </IconButton>
            </Tooltip>

            <FormControlLabel
              className={classes.switch}
              control={
                <Switch
                  checked={showHiddenToken}
                  onChange={() => { setShowHiddenToken(!showHiddenToken) }}
                  color="primary"
                />
              }
              label="Show hidden token"
            />
          </Typography>

          <Divider className={props.classes.divider} />

          <TableContainer component={Paper} square className={classes.root}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="center">Address</TableCell>
                  <TableCell align="center">Control</TableCell>
                </TableRow>
              </TableHead>

              {Object.keys(walletBalances).length === 0 &&
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className={props.classes.empty}>
                      <Typography variant="h6" className={props.classes.marginBottom}>
                        Your Wallet is empty
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              }

              {walletBalances.length !== 0 &&
                <TableBody>
                  {!showHiddenToken && walletBalances.map((walletBalance, key) => (
                    <React.Fragment key={key}>
                      {walletBalance.show &&
                        <WalletTableRow
                          {...props}
                          index={key}
                          walletBalance={walletBalance}
                        />
                      }
                    </React.Fragment>
                  ))}

                  {showHiddenToken && walletBalances.map((walletBalance, key) => (
                    <React.Fragment key={key}>
                      {!walletBalance.show &&
                        <WalletTableRow
                          {...props}
                          index={key}
                          walletBalance={walletBalance}
                        />
                      }
                    </React.Fragment>
                  ))}
                </TableBody>
              }

            </Table>
          </TableContainer>
        </>
      }
    </>
  );
}