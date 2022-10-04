// Packages
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
// import FileCopyIcon from '@material-ui/icons/FileCopy';
// import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Services
import {
  getPresaleList,
} from 'components/services/Sales';

import {
  getTransactionsByAddress,
} from 'components/services/Tokens';

// Library
import {
  formatToken,
} from 'components/libraries/Common';

// Variable
import { CONSTANT } from 'config/Constant';

// Images
import surpriseGift from 'images/surprise-gift.png';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },

  // Block
  blockTitle: {
    fontSize: 32,
    lineHeight: '36px',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    position: 'relative',
    textAlign: 'center',

    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      bottom: '-35px',
      width: '60px',
      height: '3px',
      background: 'linear-gradient(to right,#67d9c0,#2d2fa0)',
      left: '50%',
      marginLeft: '-30px',
    },

    '& .living': {
      marginTop: '9px',
      position: 'absolute',
      marginLeft: '16px',
      width: '18px',
      height: '18px',
    }
  },
  blockSub: {
    marginTop: theme.spacing(6),
  },

  // Wallet
  wallet: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),

    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(16),
      paddingRight: theme.spacing(16),
    },

    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(26),
      paddingRight: theme.spacing(26),
    },
  },
  walletCard: {
    padding: '13px 20px',
    textAlign: 'center',
    borderRadius: '10px',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg,#b44fff 0%,#273dff 100%)',
  },
  walletCardAlone: {
    display: 'inline-block',
    width: 'calc(100% - 40px)',

    [theme.breakpoints.up("sm")]: {
      maxWidth: '400px',
    },
  },
  walletTokenName: {
    padding: '4px 10px',
    position: 'absolute',
    minWidth: '146px',
    transform: 'rotate(-45deg)',
    left: '-45px',
    top: '14px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'uppercase',
    boxShadow: '0px 5px 10px 0px rgb(0 0 0 / 20%)',
    background: 'linear-gradient(to right,#0095ff 0%,#26ebdc 100%)',
  },
  walletTitle: {
    fontSize: 14,
    lineHeight: '20px',
  },
  walletToken: {
    fontSize: 30,
    lineHeight: '42px',
  },
  walletAddress: {
    marginTop: theme.spacing(8),
  },

  whiteBackground: {
    background: 'white',
  },

  inner: {
    maxWidth: '800px',

    [theme.breakpoints.up("md")]: {
      display: 'inline-block',
    },
  },
  table: {
    maxHeight: 400,
    marginTop: theme.spacing(8),
  },
  presaleAddress: {
    color: '#f3ba30',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  warning: {
    background: 'yellow',
    color: 'red',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: '4px',
  },
  margin: {
    margin: theme.spacing(0.4),
    padding: theme.spacing(0.6),
  },
  copyIcon: {
    color: 'white',
    width: '18px',
  },
  error: {
    color: 'red',
  },

  surpriseGift: {
    width: '100px',
  },
}));

export default function PresaleList(props) {
  const classes = useStyles();

  const {
    // copyToClipboard,
    // enqueueSnackbar,
    walletAddress,
  } = props;

  const
    cleaned = useRef(false),
    timeoutPresaleList = useRef(),
    timeoutPresaleTransactions = useRef();

  const [presaleList, setPresaleList] = useState([]);
  const [updatingPresaleList, setUpdatingPresaleList] = useState();

  const processResult = (result) => {
    const
      newResult = [];

    result.forEach(presale => {
      if (presale.address.toLowerCase() !== CONSTANT.MAIN_NET.DEPLOYER_WALLET.toLowerCase()) {
        newResult.push(presale);
      }
    });

    return newResult;
  }

  const updatePresaleList = () => {
    if (!updatingPresaleList) {
      setUpdatingPresaleList(true);
      getPresaleList().then(result => {
        if (!cleaned.current) {
          if (result) {
            setPresaleList(processResult(result));
          }

          timeoutPresaleList.current = setTimeout(updatePresaleList, CONSTANT.DELAY_TIME);

          setUpdatingPresaleList(false);
        }
      });
    }
  }

  const getTotalRegisteredBNB = () => {
    let
      result = 0;

    presaleList.forEach(presale => {
      result += presale.amount
    });

    if (result) {
      return formatToken(result, 0);
    }

    return result;
  }

  const getTotalPurchasedBNB = () => {
    let
      result = 0;

    presaleTransactions.forEach(transaction => {
      result += transaction.value;
    });

    presaleOutTransactions.forEach(transaction => {
      result -= transaction.value;
    });

    return result;
  }



  // Transactions
  const processTransactionsResult = (result) => {
    const
      newResult = [],
      outResult = [];

    let
      findIndex;

    if (result && result.data && result.data.items) {
      result.data.items.forEach(item => {
        if (item.to_address === CONSTANT.MAIN_NET.PRESALE_WALLET.toLowerCase() && item.value) {
          findIndex = newResult.findIndex(x => x.from_address === item.from_address);

          if (findIndex > -1) {
            if (item.block_height !== newResult[findIndex].block_height) {
              newResult[findIndex].value += item.value / (10 ** 18);
            }
          } else {
            newResult.push({
              block_height: item.block_height,
              from_address: item.from_address,
              value: item.value / (10 ** 18),
              tx_hash: item.tx_hash,
            });
          }
        }

        // Out transaction
        if (item.from_address === CONSTANT.MAIN_NET.PRESALE_WALLET.toLowerCase() && item.value && item.block_height < 11190238) {
          outResult.push({
            block_height: item.block_height,
            to_address: item.to_address,
            value: item.value / (10 ** 18),
            tx_hash: item.tx_hash,
          });
        }
      });
    }

    setPresaleOutTransactions(outResult);

    return newResult;

    // Sample data
    /*
    return [{
      block_height: 10930102,
      from_address: "0xdac833a4fbb2f7173c498646981774547c17d43a",
      value: 2,
      tx_hash: "0x0de1fa8fd3aa1606e3c3226e1f8c1f1323477d7a50a93adcc60f2208652ad742",
    }];
    */
  }

  const [presaleTransactions, setPresaleTransactions] = useState([]);
  const [presaleOutTransactions, setPresaleOutTransactions] = useState([]);
  const [updatingPresaleTransactions, setUpdatingPresaleTransactions] = useState();

  const updatePresaleTransactions = (pageNumber = 0) => {
    if (!updatingPresaleTransactions) {
      setUpdatingPresaleTransactions(true);
      getTransactionsByAddress(CONSTANT.MAIN_NET.PRESALE_WALLET, pageNumber).then(result => {
        if (!cleaned.current) {
          if (result) {
            setPresaleTransactions(processTransactionsResult(result));
          }

          if (result && result.data && result.data.pagination && result.data.pagination.has_more) {
            timeoutPresaleTransactions.current = setTimeout(() => {
              updatePresaleTransactions(result.data.pagination.page_number + 1);
            });
          } else {
            timeoutPresaleTransactions.current = setTimeout(updatePresaleTransactions, CONSTANT.DELAY_TIME_TRANSACTIONS);
          }

          setUpdatingPresaleTransactions(false);
        }
      });
    }
  }



  // First init
  useEffect(() => {
    cleaned.current = false;
    updatePresaleList();
    updatePresaleTransactions();

    return function cleanup() {
      clearTimeout(timeoutPresaleList.current);
      clearTimeout(timeoutPresaleTransactions.current);
      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPurchased = (address) => {
    const
      findIndex = presaleTransactions.findIndex(x => x.from_address === address.toLowerCase()),
      value = findIndex > -1 ? presaleTransactions[findIndex].value : null;

    if (value) {
      if (value < CONSTANT.PRESALE_SALE_MIN_BUY_BNB || value > CONSTANT.PRESALE_SALE_MAX_BUY_BNB) {
        return <span className={classes.error}>OUT OF RANGE<br />{formatToken(value, 0)} BNB</span>;
      } else {
        return `${formatToken(value, 0)} BNB`;
      }
    }

    return '';
  }

  const getPurchasedToken = (address) => {
    const
      findIndex = presaleTransactions.findIndex(x => x.from_address === address.toLowerCase()),
      value = findIndex > -1 ? presaleTransactions[findIndex].value : null;

    if (value) {
      if (value < CONSTANT.PRESALE_SALE_MIN_BUY_BNB || value > CONSTANT.PRESALE_SALE_MAX_BUY_BNB) {
        return '';
      } else {
        return `${formatToken(value * CONSTANT.PRESALE_SALE_TOKEN_PER_BNB, 0)} $MEO`;
      }
    }

    return '';
  }

  const getTxHash = (address) => {
    const
      findIndex = presaleTransactions.findIndex(x => x.from_address === address.toLowerCase()),
      txHash = findIndex > -1 ? presaleTransactions[findIndex].tx_hash : null;

    if (txHash) {
      return <Link href={`https://bscscan.com/tx/${txHash}`} target="_blank">{txHash.substr(0, 6)}</Link>
    }
  }

  const isMyWalletAddressInpresaleList = () => {
    if (walletAddress) {
      const
        findIndex = presaleList.findIndex(x => x.address === walletAddress.toLowerCase());

      if (findIndex > -1) {
        return true;
      }
    }

    return false;
  }

  return (
    <div className={classes.root}>
      {isMyWalletAddressInpresaleList() &&
        <Box className={classes.wallet}>
          <Box className={clsx(classes.walletCard, classes.walletCardAlone)}>
            <Box className={classes.walletTokenName}>
              $MEO
            </Box>
            <Box className={classes.walletTitle}>
              Your tokens
            </Box>
            <Box className={classes.walletToken}>
              {getPurchasedToken(walletAddress) || 0}
            </Box>
            <Typography variant="body2">
              From Presale: <strong style={{ fontSize: 16, }}>{getPurchased(walletAddress) || 0}</strong>
            </Typography>
          </Box>
        </Box>
      }

      <Box className={classes.inner}>
        {/* {isMyWalletAddressInpresaleList() &&
          <>
            <Typography variant="body2" className={props.classes.marginBottom} component="div" align="center">
              Presale Address: <Link className={classes.presaleAddress} href={`https://bscscan.com/address/${CONSTANT.MAIN_NET.PRESALE_WALLET}`} target="_blank">{CONSTANT.MAIN_NET.PRESALE_WALLET}</Link>

              <Tooltip title="Copy address" placement="top" arrow>
                <IconButton className={classes.margin}
                  onClick={() => {
                    copyToClipboard(CONSTANT.MAIN_NET.PRESALE_WALLET)
                      .then(() => enqueueSnackbar('Copied to Clipboard'))
                      .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
                  }} size="small">
                  <FileCopyIcon className={classes.copyIcon} />
                </IconButton>
              </Tooltip>
            </Typography>

            <Typography variant="body2" className={props.classes.marginBottom} component="div" align="left">
              <strong>● If you see this sentence, it means your address was whitelisted, and you can purchase the Presale.</strong><br />
              ● You can use any device with any wallet that is easy for you, and please use Binance Smart Chance (BSC) network.<br />
              ● Please send only BNB to the above Presale Address.<br />
              ● The amount can differ from your Registered amount, but please make sure the total is in the range of {CONSTANT.PRESALE_SALE_MIN_BUY_BNB} - {CONSTANT.PRESALE_SALE_MAX_BUY_BNB} BNB / wallet.<br />
            </Typography>
          </>
        } */}

        <Box className={props.classes.marginBottom}>
          <Typography variant="h5" className={props.classes.marginBottom}>
            Presale surprise gift: <strong>{formatToken(CONSTANT.PRESALE_REWARD_PERCENT * (getTotalPurchasedBNB() + 20))} BNB</strong>
          </Typography>

          <Typography variant="body2" component="div" align="center">
            The reward will be calculated base on the <strong>Total purchased BNB</strong> in Private Sale and Presale.<br />
            Random 4 members who joined the Private Sale and Presale, before launching.
          </Typography>

          <img src={surpriseGift} alt="surprise gift" className={classes.surpriseGift} />

          <Typography variant="body2" className={props.classes.marginBottom}>
            ● 1st prize: <strong>{formatToken(CONSTANT.PRESALE_REWARD_PERCENT_1 * (getTotalPurchasedBNB() + 20))} BNB</strong><br />
            ● 2nd prize: <strong>{formatToken(CONSTANT.PRESALE_REWARD_PERCENT_2 * (getTotalPurchasedBNB() + 20))} BNB</strong><br />
            ● 3rd prize: <strong>{formatToken(CONSTANT.PRESALE_REWARD_PERCENT_3 * (getTotalPurchasedBNB() + 20))} BNB</strong><br />
            ● 4th prize: <strong>{formatToken(CONSTANT.PRESALE_REWARD_PERCENT_4 * (getTotalPurchasedBNB() + 20))} BNB</strong><br />
          </Typography>
        </Box>



        <Typography variant="h2" className={classes.blockTitle}>
          PRESALE MASTER DATA
          <div className="living"></div>
        </Typography>

        {/* {isMyWalletAddressInpresaleList() &&
          <div className={classes.warning}>● DO NOT SEND BNB TO ANY ADDRESS IN THE BELOW PRESALE MASTER DATA</div>
        } */}

        <TableContainer className={clsx(classes.table, props.classes.marginBottom)} component={Paper}>
          <Table aria-label="a dense table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Wallet Address</TableCell>
                <TableCell align="right">Registered</TableCell>
                <TableCell align="right">Purchased</TableCell>
                <TableCell align="right">$MEO tokens</TableCell>
                <TableCell align="center">Tx Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {updatingPresaleList && presaleList && presaleList.length === 0 &&
                <TableRow>
                  <TableCell align="center" colSpan="5">
                    <Box className={props.classes.loading}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              }

              {!updatingPresaleList && presaleList && presaleList.length === 0 &&
                <TableRow>
                  <TableCell align="center" colSpan="5">
                    No results found
                  </TableCell>
                </TableRow>
              }

              {presaleList && presaleList.length !== 0 &&
                presaleList.map((presale, key) => (
                  <TableRow className={classes.row} key={key}>
                    <TableCell component="td" scope="row">
                      {presale.address}
                    </TableCell>
                    <TableCell component="td" scope="row" align="right">
                      {formatToken(presale.amount, 0)} BNB
                    </TableCell>
                    <TableCell component="td" scope="row" align="right">
                      {getPurchased(presale.address)}
                    </TableCell>
                    <TableCell component="td" scope="row" align="right">
                      {getPurchasedToken(presale.address)}
                    </TableCell>
                    <TableCell component="td" scope="row" align="right">
                      {getTxHash(presale.address)}
                    </TableCell>
                  </TableRow>
                ))
              }

            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body2" className={props.classes.marginBottom}>
          ● Total addresses: <strong>{formatToken(presaleList.length, 0)}</strong><br />
          ● Total registered BNB: <strong>{getTotalRegisteredBNB()}</strong><br />
          {/* ● Total purchased BNB: <strong>{formatToken(getTotalPurchasedBNB(), 0)}</strong><br /> */}
          ● Total purchased BNB: <strong>136.505</strong><br />
        </Typography>

        <Typography variant="body2">
          <em>(*) The data get from blockchain will be cached and delayed from 3-5 minutes</em>
        </Typography>



        <Typography variant="h2" className={classes.blockTitle}>
          PRESALE REFUND DATA
          <div className="living"></div>
        </Typography>

        <TableContainer className={clsx(classes.table, props.classes.marginBottom)} component={Paper}>
          <Table aria-label="a dense table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Wallet Address</TableCell>
                <TableCell align="right">Refuned</TableCell>
                <TableCell align="center">Tx Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {updatingPresaleTransactions && presaleOutTransactions && presaleOutTransactions.length === 0 &&
                <TableRow>
                  <TableCell align="center" colSpan="5">
                    <Box className={props.classes.loading}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              }

              {!updatingPresaleTransactions && presaleOutTransactions && presaleOutTransactions.length === 0 &&
                <TableRow>
                  <TableCell align="center" colSpan="5">
                    No results found
                  </TableCell>
                </TableRow>
              }

              {presaleOutTransactions && presaleOutTransactions.length !== 0 &&
                presaleOutTransactions.map((transaction, key) => (
                  <TableRow className={classes.row} key={key}>
                    <TableCell component="td" scope="row">
                      {transaction.to_address}
                    </TableCell>
                    <TableCell component="td" scope="row" align="right">
                      {formatToken(transaction.value, 0)} BNB
                    </TableCell>
                    <TableCell component="td" scope="row" align="right">
                      <Link href={`https://bscscan.com/tx/${transaction.tx_hash}`} target="_blank">{transaction.tx_hash.substr(0, 6)}</Link>
                    </TableCell>
                  </TableRow>
                ))
              }

            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}