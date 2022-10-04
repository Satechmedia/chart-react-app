// Packages
import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';

// Material UI
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Widgets
import PresaleList from 'components/widgets/presale/PresaleList';

// Variable
import { CONSTANT } from 'config/Constant';

// Library
import {
  formatToken,
  getShortToken,
  makeid,
  useLocalStorage,
} from 'components/libraries/Common';

// Services
import {
  getPresaleListByAddress,
  registerPresale,
} from 'components/services/Sales';

// Styles
const useStyles = makeStyles((theme) => ({
  // Block
  blockTitle: {
    fontSize: 32,
    lineHeight: '36px',
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
    marginTop: theme.spacing(4),
  },

  // registrationForm
  registrationForm: {
    marginTop: theme.spacing(6),
  },
  registrationFormInner: {
    background: 'white',
    padding: theme.spacing(3),
    color: 'black',
    display: 'inline-block',
    borderRadius: '4px',
  },
  contributeAmount: {
    // width: '100%',
    maxWidth: '300px',
  },
  overviewLinksBuy: {
    backgroundImage: 'linear-gradient(to right,#f15a91 0,#603cab 51%,#f15a91 100%)',
    backgroundSize: '200% auto',
    borderRadius: '24px',
    color: 'white',
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 'bold',
    height: '50px',
    marginBottom: 0,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    minWidth: '160px',
    paddingLeft: '35px',
    paddingRight: '35px',
    position: 'relative',
    textAlign: 'center',
    transition: 'all .3s ease',
    whiteSpace: 'nowrap',

    [theme.breakpoints.up("md")]: {
      marginTop: 0,
    },

    '&:hover': {
      backgroundPosition: 'right center',
    },
  },

  // Token
  tokenStructure: {
    marginTop: theme.spacing(6),
  },
  tokenInfoLabel: {
    color: grey[500],
  },
}));

export default function LandingPagePresale(props) {
  const classes = useStyles();

  const {
    // txHash,
    connectWallet,
    enqueueSnackbar,
    logoutWallet,
    removeDynamicTitleAndSetNew,
    walletAddress,
  } = props;

  const
    cleaned = useRef(false),
    timeoutPresaleListByAddress = useRef();

  const [addressKey, setAddressKey] = useLocalStorage('addressKey');

  useEffect(() => {
    removeDynamicTitleAndSetNew("Presale");

    cleaned.current = false;

    if (!addressKey) {
      setAddressKey(makeid(42));
    }

    return function cleanup() {
      cleaned.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [amount, setAmount] = useState('');



  // presaleListByAddress
  const [presaleListByAddress, setPresaleListByAddress] = useState(null);
  const [updatingPresaleListByAddress, setUpdatingPresaleListByAddress] = useState();

  const updatePresaleListByAddress = () => {
    if (!updatingPresaleListByAddress) {
      setUpdatingPresaleListByAddress(true);
      getPresaleListByAddress(walletAddress).then(result => {
        if (!cleaned.current) {
          if (result && result.length) {
            const
              value = result[0];

            setPresaleListByAddress(value);
          } else {
            setPresaleListByAddress(false);
          }

          timeoutPresaleListByAddress.current = setTimeout(updatePresaleListByAddress, CONSTANT.DELAY_TIME);

          setUpdatingPresaleListByAddress(false);
        }
      });
    }
  }



  // registerPresale
  const [updatingRegisterPresale, setUpdatingRegisterPresale] = useState();

  const registerPresaleFunction = () => {
    const
      amountFloat = parseFloat(amount);

    if (!amountFloat || amountFloat < CONSTANT.PRESALE_SALE_MIN_BUY_BNB || amountFloat > CONSTANT.PRESALE_SALE_MAX_BUY_BNB) {
      enqueueSnackbar(`Please enter amount from ${CONSTANT.PRESALE_SALE_MIN_BUY_BNB} to ${CONSTANT.PRESALE_SALE_MAX_BUY_BNB}`);
      return false;
    }

    if (!updatingRegisterPresale) {
      setUpdatingRegisterPresale(true);
      registerPresale(walletAddress, addressKey, amountFloat).then(result => {
        if (!cleaned.current) {
          if (result && result.length) {
            const
              value = result[0];

            setPresaleListByAddress(value);
          } else {
            setPresaleListByAddress(false);
          }

          setUpdatingRegisterPresale(false);
        }
      });
    }
  }



  // Update wallet address
  useEffect(() => {
    if (walletAddress) {
      updatePresaleListByAddress();
    } else {
      clearTimeout(timeoutPresaleListByAddress.current);

      setPresaleListByAddress(null);
    }

    return function cleanup() {
      clearTimeout(timeoutPresaleListByAddress.current);

      setPresaleListByAddress(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return (
    <Container>
      <Box className={classes.block}>
        <Typography variant="h2" className={classes.blockTitle}>
          LIVE PRESALE
          <div className="living"></div>
        </Typography>

        <Typography variant="body2" className={classes.blockSub} component="div" align="center">
          Meo.tools Launchpad
        </Typography>

        <Box className={classes.walletAddress} align="center">
          {!walletAddress &&
            <Button variant="outlined" color="inherit" onClick={connectWallet}>CONNECT</Button>
          }

          {walletAddress &&
            <Button variant="outlined" className={classes.logout} color="inherit" onClick={logoutWallet}>LOGOUT ({getShortToken(walletAddress)})</Button>
          }
        </Box>

        {walletAddress &&
          <>
            <Box className={classes.wallet}>
              <Box className={clsx(classes.walletCard, classes.walletCardAlone)}>
                <Box className={classes.walletTokenName}>
                  BNB
                </Box>
                <Box className={classes.walletTitle}>
                  Your registration
                </Box>
                <Box className={classes.walletToken}>
                  {!presaleListByAddress && `0 BNB`}

                  {presaleListByAddress &&
                    `${formatToken(presaleListByAddress.amount, 0)} BNB`
                  }
                </Box>
                <Typography variant="body2">
                  To purchase Presale
                </Typography>
              </Box>
            </Box>

            {presaleListByAddress === false && false &&
              <Box className={classes.registrationForm} align="center">
                <Box className={classes.registrationFormInner}>
                  {/* <Box className={props.classes.marginBottom}>
                    ● Connect your wallet to Binance Smart Chain (BSC)
                  </Box> */}

                  <TextField
                    label="0.1 BNB - 2 BNB"
                    className={classes.contributeAmount}
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value) }}
                  />

                  <Button className={classes.overviewLinksBuy} onClick={registerPresaleFunction}>
                    Register
                  </Button>
                </Box>
              </Box>
            }
          </>
        }

        <PresaleList
          {...props}
        />

        <Grid container spacing={3} className={classes.tokenStructure}>
          <Grid item md={6} sm={12} xs={12}>
            <Typography variant="body2" component="div">
              <p>Token Metrics:</p>
              <p>
                <span className={classes.tokenInfoLabel}>Token Name:</span> Meo.tools<br />
                <span className={classes.tokenInfoLabel}>Token Symbol:</span> MEO<br />
                <span className={classes.tokenInfoLabel}>Token Decimals:</span> 9<br />
                <span className={classes.tokenInfoLabel}>Token Type:</span> BEP-20<br />
              </p>
              <p>The number of tokens for the IDO is:</p>
              <ul>
                <li>Private Sale: <strong>400,000 MEO / BNB ~ $0.001148 USD</strong></li>
                <li>Presale: <strong>360,000 MEO / BNB ~ $0.001275 USD</strong></li>
                <li>Public Sale: <strong>324,000 MEO / BNB ~ $0.001417 USD</strong></li>
              </ul>
              <p>The token subscribed by IDO will be fully released and will not be locked</p>
              <p>Your tokens will be airdropped right after launch, you don't need to claim and lost the fee.</p>
            </Typography>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Typography variant="body2" component="div">
              <p>Presale Information:</p>
              <ul>
                <li><span className={classes.tokenInfoLabel}>Total Supply:</span> 1,000,000,000 MEO</li>
                <li><span className={classes.tokenInfoLabel}>Tokens For Presale:</span> 108,000,000 MEO</li>
                <li><span className={classes.tokenInfoLabel}>Tokens For Liquidity:</span> 86,400,000 MEO</li>
                <li><span className={classes.tokenInfoLabel}>Soft Cap:</span> 150 BNB</li>
                <li><span className={classes.tokenInfoLabel}>Hard Cap:</span> 300 BNB</li>
                <li><span className={classes.tokenInfoLabel}>Presale Rate:</span> 360,000 MEO per BNB</li>
                <li><span className={classes.tokenInfoLabel}>PancakeSwap Listing Rate:</span> 324,000 MEO per BNB</li>
                <li><span className={classes.tokenInfoLabel}>PancakeSwap Liquidity %:</span> 80%</li>
                <li><span className={classes.tokenInfoLabel}>Minimum Contribution:</span> {CONSTANT.PRESALE_SALE_MIN_BUY_BNB} BNB</li>
                <li><span className={classes.tokenInfoLabel}>Maximum Contribution:</span> {CONSTANT.PRESALE_SALE_MAX_BUY_BNB} BNB</li>
                <li><span className={classes.tokenInfoLabel}>Presale Start Time:</span> 21 Sep 2021 at 00:00 UTC</li>
                <li><span className={classes.tokenInfoLabel}>Presale End Time:</span> 23 Sep 2021 at 00:00 UTC</li>
                <li><span className={classes.tokenInfoLabel}>Launch Time:</span> 25 Sep 2021 at 00:00 UTC</li>
                <li><span className={classes.tokenInfoLabel}>Liquidity Unlock Date:</span> 25 Mar 2022 at 00:00 UTC</li>
              </ul>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}