/* eslint-disable no-unused-vars */
// Packages
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';

// Material UI
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Container from '@material-ui/core/Container';
import FileCopyIcon from '@material-ui/icons/FileCopy';
// import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Variable
import { CONSTANT } from 'config/Constant';

// Images
import auditCertik from 'images/audit_certik.png';
import avatarAlicia from 'images/avatar_alicia.jpg';
import avatarArsal from 'images/avatar_arsal_2.jpg';
import avatarDefault from 'images/avatar_default.jpg';
import avatarMeo from 'images/avatar_meo.jpg';
import avatarRoha from 'images/avatar_roha.jpg';
import avatarSutriono from 'images/avatar_sutriono.jpg';
import binanceLogo from 'images/binance_logo.svg';
import coingeckoLogo from 'images/coingecko-logo.png';
import coinmarketcapLogo from 'images/coinmarketcap-logo.svg';
import customizableDashboard from 'images/customizable_dashboard.png';
import dashboardMacbook from 'images/dashboard_macbook.png';
import ethereumLogo from 'images/ethereum_logo.svg';
import meoToolsEcosystem from 'images/meo_tools_ecosystem.png';
import polygonLogo from 'images/polygon_logo.svg';
import preSaleFundsAllocation from 'images/pre_sale_funds_allocation.png';
import tokenAlerting from 'images/token_alerting.png';
import tokenTracker from 'images/token_tracker.png';

// Pages
import Social from 'components/pages/landing-pages/Social';

// Library
import {
  formatToken,
  getShortToken,
} from 'components/libraries/Common';

// Services
import {
  getAirdropListByAddress,
  getPrivateSaleList,
  getPrivateSaleListByAddress,
  // verifyAirdropByAddress,
} from 'components/services/Sales';

// package.json
var pjson = require('../../../../package.json');

// Constant
const
  backgroundColor = '#1e124f';

// Styles
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0.4),
    padding: theme.spacing(0.6),
  },
  copyIcon: {
    color: 'white',
    width: '18px',
  },

  // Overview
  overview: {
    position: 'relative',
    zIndex: 1,
  },
  overviewH1: {
    fontSize: 32,
    lineHeight: '36px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
    position: 'relative',

    [theme.breakpoints.up("md")]: {
      fontSize: 40,
      lineHeight: '44px',
    },

    [theme.breakpoints.up("lg")]: {
      fontSize: 54,
      lineHeight: '60px',
    },

    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      bottom: '-35px',
      left: 0,
      width: '60px',
      height: '3px',
      background: 'linear-gradient(to right,#67d9c0,#2d2fa0)',
    },
  },
  overviewSub: {
    marginTop: theme.spacing(8),
    paddingRight: theme.spacing(12),
    fontSize: 18,
  },
  overviewButtonWrap: {
    marginTop: theme.spacing(4),
  },
  overviewButton: {
    background: '0 0',
    backgroundImage: `linear-gradient(to right,#603cab 0,#f15a91 51%,#603cab 100%)`,
    color: 'white',
    borderRadius: '45px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: 'none',
    fontSize: 14,
    display: 'inline-block',
    padding: theme.spacing(2, 4),
    textDecoration: 'none',
    position: 'relative',
    transition: 'all .3s ease',

    [theme.breakpoints.up("sm")]: {
      backgroundSize: '200%',

      '&:hover': {
        backgroundPosition: 'right center',
      },
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      borderRadius: '50px',
      boxShadow: '0px 10px 20px 0px rgb(96 60 171 / 50%)',
    },
  },
  presaleButton: {
    marginTop: theme.spacing(1),

    [theme.breakpoints.up("sm")]: {
      marginTop: 0,
      marginLeft: theme.spacing(2),
    },
  },
  auditCertik: {
    maxWidth: '80%',
    marginTop: theme.spacing(3),

    [theme.breakpoints.up("md")]: {
      maxWidth: '70%',
    },
  },
  socials: {
    marginTop: theme.spacing(4),

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(8),
    },
  },
  coinmarketcapCommingSon: {
    fontStyle: 'italic',
    fontSize: 11,
  },
  dashboardMacbook: {
    marginTop: theme.spacing(6),

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(12),
    },
  },
  overviewCommingSon: {
    marginTop: theme.spacing(1),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  overviewYoutube: {
    marginTop: theme.spacing(3),
    paddingBottom: theme.spacing(6),

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6),
    },

    '& iframe': {
      maxWidth: '100%',
    },
  },
  overviewCountdown: {
    backgroundImage: 'linear-gradient(to right,#000159,#205db3)',
    marginTop: theme.spacing(6),
    borderRadius: '9px',

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(12),
    },
  },
  overviewCountdownTitle: {
    fontSize: 30,
    marginTop: theme.spacing(1),
  },
  overviewCountdownTitleHighlight: {
    color: '#00ffe9',
  },
  overviewProgress: {
    position: 'relative',
    padding: '30px 0',
    marginTop: theme.spacing(2),
  },
  overviewProgressSoftcap: {
    position: 'absolute',
    top: '4px',
    height: '60px',
  },
  overviewProgressSoftcapLabel: {
    fontSize: 10,
    lineHeight: '18px',

    [theme.breakpoints.up(425)]: {
      fontSize: 12,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 14,
    },

    '&:after': {
      content: '""',
      position: 'absolute',
      top: '23px',
      left: 0,
      height: '22px',
      width: '1px',
      backgroundColor: '#fff',
      zIndex: 20,
    }
  },
  overviewProgressSoftcapHolder: {
    height: '30px',
  },
  overviewProgressSoftcapLabel2: {
    fontSize: 12,
  },
  overviewProgressHardcap: {
    position: 'absolute',
    right: 0,
    top: '4px',
    textAlign: 'right',
    height: '60px',
  },
  overviewProgressHardcapLabel: {
    fontSize: 10,
    lineHeight: '18px',

    [theme.breakpoints.up(425)]: {
      fontSize: 12,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 14,
    },
  },
  overviewProgressHardcapHolder: {
    height: '30px',
  },
  overviewProgressHardcapLabel2: {
    fontSize: 12,
  },
  overviewProgressBar: {
    position: 'relative',
    height: '15px',
    background: 'rgba(255,255,255,.25)',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  overviewProgressCompleted: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: 'linear-gradient(to right,#f15a91,#603cab)',
  },
  overviewProgressCompletedStriped: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
    animation: `$progress-bar-stripes 2s linear infinite`,
    backgroundSize: '40px 40px',
    transition: 'width .6s ease',
  },
  "@keyframes progress-bar-stripes": {
    "from": {
      backgroundPosition: '40px 0',
    },
    "to": {
      backgroundPosition: '0 0',
    }
  },
  overviewLinks: {
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: theme.spacing(2),

    [theme.breakpoints.up("sm")]: {
      display: 'flex',
    }
  },
  overviewLinksDescription: {
    fontSize: 18,
    fontWeight: 600,

    [theme.breakpoints.up("md")]: {
      lineHeight: "50px",
    },
  },
  overviewInvest: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(1),
    },
  },
  overviewInvestSelect: {
    color: 'white',

    '&:before': {
      borderBottomColor: grey[500],
    },

    '&:hover': {
      '&:before': {
        borderBottomColor: 'white !important',
      },
    },

    '& .MuiSelect-icon': {
      color: 'white',
    },
  },
  overviewLinksBuy: {
    display: 'inline-block',
    backgroundSize: '200% auto',
    backgroundImage: 'linear-gradient(to right,#f15a91 0,#603cab 51%,#f15a91 100%)',
    marginBottom: 0,
    paddingLeft: '35px',
    paddingRight: '35px',
    fontWeight: 'bold',
    fontSize: 14,
    height: '50px',
    borderRadius: '24px',
    color: 'white',
    whiteSpace: 'nowrap',
    transition: 'all .3s ease',
    textAlign: 'center',
    minWidth: '160px',
    marginTop: theme.spacing(1),
    position: 'relative',

    [theme.breakpoints.up("md")]: {
      marginTop: 0,
    },

    '&:hover': {
      backgroundPosition: 'right center',
    },
  },
  sendToWallet: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    wordBreak: 'break-all',
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

  // Block
  block: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),

    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
  },
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
  whiteBlock: {
    color: backgroundColor,
  },
  blockSub: {
    marginTop: theme.spacing(10),
  },

  // Supporting Network
  supportingNetwork: {
    marginTop: theme.spacing(4),
    textAlign: 'center',

    '& img': {
      maxWidth: '60%',

      [theme.breakpoints.up("sm")]: {
        maxWidth: '100%',
      },

      [theme.breakpoints.up("lg")]: {
        maxWidth: '80%',
      },
    },
  },

  // Meo.tools ecosystem
  meoToolsEcosystem: {
    marginTop: theme.spacing(10),
  },

  // Token tracker
  tokenTracker: {
    marginTop: theme.spacing(4),
  },

  // Token alerting
  tokenAlerting: {
    marginTop: theme.spacing(4),

    '& img': {
      maxWidth: '80%',

      [theme.breakpoints.up("sm")]: {
        maxWidth: '360px',
      },
    }
  },

  // Token
  tokenStructure: {
    marginTop: theme.spacing(6),

    [theme.breakpoints.up("md")]: {
      display: 'flex',
    },
  },
  token: {
    position: 'relative',
    margin: '0 0 30px',
    minWidth: '40px',
  },
  tokenBar: {
    padding: '9px 10px',
    fontSize: 12,
    textAlign: 'right',
    borderRadius: '20px',

    [theme.breakpoints.up("md")]: {
      fontSize: 15,
    }
  },
  tokenBarLast: {
    paddingRight: '5px',
    paddingLeft: 0,

    [theme.breakpoints.up("md")]: {
      paddingRight: '2px',
    }
  },
  tokenLabel: {
    position: 'relative',
    lineHeight: '18px',
    fontSize: 12,
    fontWeight: 500,
    minWidth: '250px',
    maxWidth: '80vw',
    top: '11px',

    [theme.breakpoints.up("md")]: {
      top: 0,
      paddingTop: 20,
      minWidth: 'unset',
      maxWidth: 'unset',

      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-10px',
        left: 0,
        width: '1px',
        height: '27px',
        borderRight: '1px dashed #8785a3',
      },
    },
  },
  tokenInformation: {
    marginTop: theme.spacing(3),
  },
  tokenInfoLabel: {
    color: grey[500],
  },
  tokenInfoH5: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
  },
  tokenInfoBody: {
    wordBreak: 'break-all',
  },

  // Roadmap
  timeline: {
    marginTop: theme.spacing(10),
  },
  timelineItem: {
    display: 'flex',
    minHeight: '120px',
  },
  timelineItemDate: {
    flex: '0 0 50%',
    maxWidth: 'calc(50% - 38px)',
    textAlign: 'right',
    paddingRight: '38px',
    position: 'relative',

    '&:before': {
      content: '""',
      width: '20px',
      height: '20px',
      position: 'absolute',
      display: 'block',
      top: 0,
      right: 0,
      borderRadius: '50%',
      backgroundImage: 'linear-gradient(to right,#e0dee4,#6d5f64)',
    },

    '&:after': {
      content: '""',
      position: 'absolute',
      width: '2px',
      height: 'auto',
      top: '25px',
      bottom: '5px',
      display: 'block',
      backgroundColor: '#564d7b',
      right: '9px',
    },
  },
  timelineItemDatePast: {
    '&:before': {
      backgroundImage: 'linear-gradient(to right,#643daa,#e85790)',
    },
  },
  timelineItemDatePresent: {
    '&:before': {
      backgroundImage: 'linear-gradient(to right,#06a3fa,#22dcdd)',
    },
  },
  timelineItemTime: {
    color: '#f15a91',
    letterSpacing: '-.64px',
    fontSize: 16,
    lineHeight: '22px',
  },
  timelineItemTimePresent: {
    '&:before': {
      content: '""',
      display: 'block',
      width: '26px',
      height: '26px',
      border: '2px #26ebdc solid',
      borderRadius: '50%',
      position: 'absolute',
      right: '-5px',
      top: '-5px',
    },
  },
  timelineItemTitle: {
    fontSize: '18px',
    fontWeight: 500,
    letterSpacing: '-.6px',
  },
  timelineItemContent: {
    flex: '0 0 50%',
    maxWidth: 'calc(50% - 20px)',
    paddingLeft: '20px',
    fontSize: 16,
    letterSpacing: '-.32px',
    lineHeight: '30px',
    fontWeight: 400,
    paddingTop: '4px',

    '& ul': {
      paddingLeft: '1em',
    },
  },

  // Team
  teams: {
    marginTop: theme.spacing(6),

    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(9),
    },

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(12),
    },
  },
  teamAvatarWrap: {
    position: 'relative',
    width: '195px',
  },
  teamAvatar: {
    width: '195px',
    height: 'auto',
  },
  teamName: {
    fontSize: '24px',
    marginTop: theme.spacing(1.4),
  },
  teamIconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#0077b5',
    color: 'white',

    '&:hover': {
      backgroundColor: '#15a7f3',
    }
  },

  // Bonus
  bonusStructure: {
    marginTop: theme.spacing(6),
  },
  bonusCardHeading: {
    background: 'linear-gradient(to right,#0095ff,#28efdb)',
    padding: '25px 0',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600,
    borderRadius: '10px 10px 0 0',
  },
  bonusCardHeading2: {
    background: 'linear-gradient(to right,#603cab,#f15a91)',
  },
  bonusCardContent: {
    padding: '25px 15px 30px',
    textAlign: 'center',
    backgroundColor: '#100736',
    borderRadius: '0 0 10px 10px',
  },
  bonusCardContentTitle: {
    fontSize: 18,
    marginBottom: '25px',
  },
  bonusLabel: {
    position: 'relative',
    marginLeft: '26px',
    display: 'inline-block',
  },
  bonusIcon: {
    position: 'absolute',
    left: '-30px',
    color: '#59c1ec',
  },
  bonusIcon2: {
    color: '#a84b9e',
  },
}));

export default function LandingPageHome(props) {
  const classes = useStyles();

  const {
    // buyPrivateSale,
    connectWallet,
    copyToClipboard,
    enqueueSnackbar,
    logoutWallet,
    removeDynamicTitleAndSetNew,
    // txHash,
    walletAddress,
  } = props;

  useEffect(() => {
    removeDynamicTitleAndSetNew(CONSTANT.DEFAULT_TITLE);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const
    cleaned = useRef(false),
    timeoutPrivateSaleList = useRef(),
    timeoutPrivateSaleListByAddress = useRef(),
    timeoutAirdropListByAddress = useRef();

  // pivateSaleList
  const [pivateSaleList, setPrivateSaleList] = useState(null);
  const [updatingPrivateSaleList, setUpdatingPrivateSaleList] = useState();

  const updatePrivateSaleList = () => {
    if (!updatingPrivateSaleList) {
      setUpdatingPrivateSaleList(true);
      getPrivateSaleList(walletAddress).then(result => {
        if (!cleaned.current) {
          if (result && result.length) {
            let
              value = 0;

            result.forEach(each => {
              if (each.invested) {
                value += each.invested;
              }
            });

            setPrivateSaleList(value);
          } else {
            setPrivateSaleList(false);
          }

          // timeoutPrivateSaleList.current = setTimeout(updatePrivateSaleList, CONSTANT.DELAY_TIME);

          setUpdatingPrivateSaleList(false);
        }
      });
    }
  }

  // pivateSaleListByAddress
  const [pivateSaleListByAddress, setPrivateSaleListByAddress] = useState(null);
  const [updatingPrivateSaleListByAddress, setUpdatingPrivateSaleListByAddress] = useState();

  const updatePrivateSaleListByAddress = () => {
    if (!updatingPrivateSaleListByAddress) {
      setUpdatingPrivateSaleListByAddress(true);
      getPrivateSaleListByAddress(walletAddress).then(result => {
        if (!cleaned.current) {
          if (result && result.length) {
            const
              value = result[0];

            if (!value.invested) {
              value.invested = 0;
            }

            setPrivateSaleListByAddress(value);
          } else {
            setPrivateSaleListByAddress(false);
          }

          timeoutPrivateSaleListByAddress.current = setTimeout(updatePrivateSaleListByAddress, CONSTANT.DELAY_TIME);

          setUpdatingPrivateSaleListByAddress(false);
        }
      });
    }
  }

  // airdropListByAddress
  const [airdropListByAddress, setAirdropListByAddress] = useState(null);
  const [updatingAirdropListByAddress, setUpdatingAirdropListByAddress] = useState();

  const updateAirdropListByAddress = () => {
    if (!updatingAirdropListByAddress) {
      setUpdatingAirdropListByAddress(true);
      getAirdropListByAddress(walletAddress).then(result => {
        if (!cleaned.current) {
          if (result && result.length) {
            let
              value = result[0];

            if (value && value.amount && !value.verified) {
              // Verify address

              // Turn of verifyAirdropByAddress function
              // setTimeout(() => {
              //   verifyAirdropByAddress(walletAddress).then(result => {
              //     if (!cleaned.current) {
              //       if (result && result.length) {
              //         value = result[0];

              //         if (value && value.amount && value.verified) {
              //           setAirdropListByAddress(value);
              //         }
              //       }
              //     }
              //   });
              // }, 1000);
            }

            setAirdropListByAddress(value);
          } else {
            setAirdropListByAddress(false);
          }

          timeoutAirdropListByAddress.current = setTimeout(updateAirdropListByAddress, CONSTANT.DELAY_TIME);

          setUpdatingAirdropListByAddress(false);
        }
      });
    }
  }

  // Update wallet address
  useEffect(() => {
    cleaned.current = false;

    if (walletAddress) {
      updatePrivateSaleList();
      updatePrivateSaleListByAddress();
      updateAirdropListByAddress();
    } else {
      clearTimeout(timeoutPrivateSaleList.current);
      clearTimeout(timeoutPrivateSaleListByAddress.current);
      clearTimeout(timeoutAirdropListByAddress.current);

      setPrivateSaleList(null);
      setPrivateSaleListByAddress(null);
      setAirdropListByAddress(null);

      cleaned.current = true;
    }

    return function cleanup() {
      // clearTimeout(timeoutPrivateSaleList.current);
      clearTimeout(timeoutPrivateSaleListByAddress.current);
      clearTimeout(timeoutAirdropListByAddress.current);

      setPrivateSaleList(null);
      setPrivateSaleListByAddress(null);
      setAirdropListByAddress(null);

      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  // const [invest, setInvest] = useState(1);

  return (
    <>
      <Container>

        {/* OVERVIEW */}
        <Box className={classes.overview}>
          <Grid container spacing={1}>
            <Grid item md={7} sm={12} xs={12}>
              <Typography variant="h1" className={classes.overviewH1}>
                All-in-one crypto ecosystem, the next tracking dashboard generation
              </Typography>

              <Typography variant="body2" className={classes.overviewSub}>
                The ultimate combination between MetaMask, PooCoin, PancakeSwap, and Alert tool to only one platform including desktop, mobile, and app version.
              </Typography>

              <Box className={classes.overviewButtonWrap}>
                <Link to="/app/" className={classes.overviewButton}>
                  CURRENT VERSION (V. {pjson.version})
                </Link>
                <a href="https://pancakeswap.finance/swap?outputCurrency=0x7dff85eeb321957a429fa220ec2664774240b766" target="_blank" className={clsx(classes.overviewButton, classes.presaleButton)} rel="noreferrer">
                  BUY ON PANCAKESWAP
                </a>
              </Box>
            </Grid>
            <Grid item md={5} sm={12} xs={12} align="center">
              <a
                href="https://www.certik.org/projects/meo-tools"
                target="_blank"
                rel="noreferrer"
              >
                <img src={auditCertik} className={classes.auditCertik} alt="Certik Audit" />
              </a>
            </Grid>
          </Grid>

          <Box className={classes.socials} align="center">
            <Social fontSize="large" />

            <Box>
              <a href="https://www.coingecko.com/en/coins/meo-tools" target="_blank" rel="noreferrer">
                <img src={coingeckoLogo} alt="Coingecko" style={{ width: '150px' }} />
              </a>
            </Box>

            <Box>
              <a href="https://coinmarketcap.com/currencies/meo-tools/" target="_blank" rel="noreferrer">
                <img src={coinmarketcapLogo} alt="Coinmarketcap" style={{ width: '220px', marginTop: 10, }} />
              </a>
              {/* <Typography variant="body2" className={classes.coinmarketcapCommingSon}>
                Coinmarketcap will coming soon
              </Typography> */}
            </Box>
          </Box>

          <img src={dashboardMacbook} className={clsx(props.classes.image100MaxWidth, classes.dashboardMacbook)} alt="All-in-one crypto ecosystem, the next tracking dashboard generation" />

          <Typography variant="body2" className={classes.overviewCommingSon}>
            Version 1 is ready now
          </Typography>

          <Box className={classes.overviewYoutube} align="center">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/KH5XVPBn0jc" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </Box>

          <Box className={classes.overviewCountdown} padding={3} style={{ display: 'none', }}>
            <Typography variant="h4" className={classes.overviewCountdownTitle} align="center">
              <span className={classes.overviewCountdownTitleHighlight}>Private sale</span> is opening: <a rel="noreferrer" href="https://forms.gle/HXfQGQzLNqmLT77e9" target="_blank" style={{ color: 'white', }}>Participate here</a>
            </Typography>

            <Box className={classes.overviewProgress}>

              <Box
                className={classes.overviewProgressSoftcap}
                style={{ left: '66.67%', }}
              >
                <Box className={classes.overviewProgressSoftcapLabel}>
                  100 BNB
                </Box>
                <Box className={classes.overviewProgressSoftcapHolder}></Box>
                <Box className={classes.overviewProgressSoftcapLabel2}>
                  Softcap
                </Box>
              </Box>

              <Box className={classes.overviewProgressBar}>
                <Box
                  className={classes.overviewProgressCompleted}
                  style={{ width: `${pivateSaleList / 150 * 100}%`, }}
                ></Box>
                <Box
                  className={classes.overviewProgressCompletedStriped}
                  style={{ width: `${pivateSaleList / 150 * 100}%`, }}
                ></Box>
              </Box>

              <Box
                className={classes.overviewProgressHardcap}
              >
                <Box className={classes.overviewProgressHardcapLabel}>
                  150 BNB
                </Box>
                <Box className={classes.overviewProgressHardcapHolder}></Box>
                <Box className={classes.overviewProgressHardcapLabel2}>
                  Hardcap
                </Box>
              </Box>
            </Box>

            <Box className={classes.overviewLinksDescription} align="center">
              Private Sale Price 1 BNB = 400,000 MEO<br />
              End time: <span className={classes.overviewCountdownTitleHighlight}>3rd September 2021</span>
            </Box>

            {/* <Box className={classes.overviewLinks}>
              <Grid container spacing={1}>

                <Grid item md={6} sm={12} xs={12}>
                  <Box className={classes.overviewLinksDescription}>
                    Private Sale Price 1 BNB = 400,000 MEO
                  </Box>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <FormControl className={classes.overviewInvest}>
                    <Select
                      value={invest}
                      onChange={(e) => { setInvest(e.target.value) }}
                      className={classes.overviewInvestSelect}
                    >
                      {!CONSTANT.USE_TEST_NET && walletAddress === CONSTANT.MAIN_NET.DEV_WALLET.toLowerCase() &&
                        <MenuItem value="0.01">0.01 BNB</MenuItem>
                      }
                      <MenuItem value="1">1 BNB</MenuItem>
                      <MenuItem value="2">2 BNB</MenuItem>
                      <MenuItem value="3">3 BNB</MenuItem>
                      <MenuItem value="4">4 BNB</MenuItem>
                      <MenuItem value="5">5 BNB</MenuItem>
                      <MenuItem value="6">6 BNB</MenuItem>
                    </Select>
                  </FormControl>

                  <Button className={classes.overviewLinksBuy} onClick={() => {
                    buyPrivateSale(invest);
                  }}>
                    BUY TOKENS
                  </Button>
                </Grid>

              </Grid>
            </Box> */}
          </Box>

          {/* {(!window.ethereum || !window.ethereum.isMetaMask) &&
            <Typography variant="body2" className={classes.sendToWallet}>
              MetaMask is not installed! Please send BNB to Meo.tools Private Sale Wallet: <strong>{CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.PRIVATE_SALE_WALLET : CONSTANT.MAIN_NET.PRIVATE_SALE_WALLET}</strong>

              <Tooltip title="Copy address" placement="top" arrow>
                <IconButton className={classes.margin}
                  onClick={() => {
                    copyToClipboard(CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.PRIVATE_SALE_WALLET : CONSTANT.MAIN_NET.PRIVATE_SALE_WALLET)
                      .then(() => enqueueSnackbar('Copied to Clipboard'))
                      .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
                  }} size="small">
                  <FileCopyIcon className={classes.copyIcon} />
                </IconButton>
              </Tooltip>
            </Typography>
          }

          {txHash &&
            <Typography variant="body2" className={classes.overviewCommingSon}>
              View transaction: <a rel="noreferrer" style={{ color: 'white', }} href={`${CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.BSC_CHAIN_EXPLORER_URL : CONSTANT.MAIN_NET.BSC_CHAIN_EXPLORER_URL}tx/${txHash}`} target="_blank">{txHash}</a>
            </Typography>
          } */}
        </Box>
        {/* OVERVIEW */}



        {/* WALLET */}
        <Box className={classes.block} style={{ display: 'none', }}>
          <Typography variant="h2" className={classes.blockTitle}>
            WALLET
            <div className="living"></div>
          </Typography>

          <Box className={classes.walletAddress} align="center">
            {!walletAddress &&
              <Button variant="outlined" color="inherit" onClick={connectWallet}>CONNECT</Button>
            }

            {walletAddress &&
              <Button variant="outlined" className={classes.logout} color="inherit" onClick={logoutWallet}>LOGOUT ({getShortToken(walletAddress)})</Button>
            }
          </Box>

          {/* <Box className={classes.wallet}>
            <Box className={clsx(classes.walletCard, classes.walletCardAlone)}>
              <Box className={classes.walletTokenName}>
                $MEO
              </Box>
              <Box className={classes.walletTitle}>
                Your token
              </Box>
              <Box className={classes.walletToken}>
                {!airdropListByAddress && 0}

                {airdropListByAddress && !airdropListByAddress.verified && 'Verifying...'}

                {airdropListByAddress && airdropListByAddress.verified &&
                  formatToken(airdropListByAddress.amount, 0)
                }
              </Box>
              <Typography variant="body2">
                From Airdrops
              </Typography>
            </Box>
          </Box> */}

          <Grid container spacing={3} className={classes.wallet}>
            <Grid item sm={6} xs={12}>

              <Box className={classes.walletCard}>
                <Box className={classes.walletTokenName}>
                  $MEO
                </Box>
                <Box className={classes.walletTitle}>
                  Your tokens
                </Box>
                <Box className={classes.walletToken}>
                  {!airdropListByAddress && 0}

                  {airdropListByAddress && !airdropListByAddress.verified && 0}

                  {airdropListByAddress && airdropListByAddress.verified &&
                    formatToken(airdropListByAddress.amount, 0)
                  }
                </Box>
                <Typography variant="body2">
                  From Airdrops and other events
                </Typography>
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Box className={classes.walletCard}>
                <Box className={classes.walletTokenName}>
                  $MEO
                </Box>
                <Box className={classes.walletTitle}>
                  Your tokens
                </Box>

                {!pivateSaleListByAddress &&
                  <>
                    <Box className={classes.walletToken}>
                      0
                    </Box>

                    <Typography variant="body2">
                      From Private Sale: <strong style={{ fontSize: 16, }}>0 BNB</strong>
                    </Typography>
                  </>
                }

                {pivateSaleListByAddress &&
                  <>
                    <Box className={classes.walletToken}>
                      {pivateSaleListByAddress.invested &&
                        formatToken(pivateSaleListByAddress.invested * CONSTANT.PRIVATE_SALE_TOKEN_PER_BNB, 0)
                      }
                    </Box>

                    <Typography variant="body2">
                      From Private Sale: <strong style={{ fontSize: 16, }}>{pivateSaleListByAddress.invested} BNB</strong>
                    </Typography>
                  </>
                }
              </Box>
            </Grid>

          </Grid>

          <Typography variant="body2" component="div" align="center">
            <p>The tokens will be partially locked and investors will be able to claim only the following:</p>
            <p>
              ● 50% right after launch<br />
              ● 50% after 2 weeks from launch
            </p>
            <p>The tokens subscribed by Pre-sale will be fully released and will not be locked</p>
            <p>Your tokens can be claimed after added the liquidity</p>
          </Typography>
        </Box>
        {/* WALLET */}

      </Container>



      {/* FEATURES */}

      {/* SUPPORTING NETWORK */}
      <Box className={classes.whiteBackground}>
        <Container>

          <Box className={clsx(classes.block, classes.whiteBlock)}>
            <Typography variant="h2" className={classes.blockTitle}>
              SUPPORTING NETWORK
            </Typography>

            <Typography variant="body2" className={classes.blockSub} component="div" align="center">
              <p>We are currently supporting Ethereum, Binance Smart Chain, and Polygon networks</p>
            </Typography>

            <Grid container spacing={4} className={classes.supportingNetwork}>
              <Grid item sm={4} xs={12}>
                <img src={ethereumLogo} alt="ethereum logo" />
              </Grid>
              <Grid item sm={4} xs={12}>
                <img src={binanceLogo} alt="binance logo" />
              </Grid>
              <Grid item sm={4} xs={12}>
                <img src={polygonLogo} alt="polygon logo" />
              </Grid>
            </Grid>
          </Box>

        </Container>
      </Box>
      {/* SUPPORTING NETWORK */}



      <Container>

        {/* MEO.TOOLS ECOSYSTEM */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            MEO.TOOLS ECOSYSTEM
          </Typography>

          <Box className={classes.meoToolsEcosystem} align="center">
            <img src={meoToolsEcosystem} className={props.classes.image100MaxWidth} alt="meo.tools ecosystem" />
          </Box>
        </Box>
        {/* MEO.TOOLS ECOSYSTEM */}



        {/* TOKEN EXPLORER & TOKEN TRACKER */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            TOKEN EXPLORER & TOKEN TRACKER
          </Typography>

          <Typography variant="body2" className={classes.blockSub} component="div">
            <ul>
              <li>List the top volume, gainers, losers, and new tokens. Search for any new tokens.</li>
              <li>Track your token Watchlist - Portfolio in real-time.</li>
              <li>You can add multiple wallets.</li>
              <li>You can choose any token in any wallet and add it to your watchlist to track easier.</li>
              <li>Add every new token in the supported networks.</li>
            </ul>
          </Typography>

          <Box className={classes.tokenTracker} align="center">
            <img src={tokenTracker} className={props.classes.image100MaxWidth} alt="token tracker" />
          </Box>
        </Box>
        {/* TOKEN EXPLORER & TOKEN TRACKER */}



        {/* TOKEN ALERTING */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            TOKEN ALERTING
          </Typography>

          <Typography variant="body2" className={classes.blockSub} component="div">
            <ul>
              <li>Never miss an opportunity with token alerting.</li>
              <li>Multiple alerting support apps (mail, Telegram, Slack, Skype, ...).</li>
              <li>Set the alerts by many methods (price value, price step, percent, ...).</li>
              <li>Set up the sleeping time, then the alert will keep silent when you sleep.</li>
              <li>Show your token amount and balance also on the notification.</li>
              <li>Set alert for every new token in the supported networks.</li>
            </ul>
          </Typography>

          <Box className={classes.tokenAlerting} align="center">
            <img src={tokenAlerting} alt="token alerting" />
          </Box>
        </Box>
        {/* TOKEN ALERTING */}



        {/* CUSTOMIZABLE DASHBOARD */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            CUSTOMIZABLE DASHBOARD
          </Typography>

          <Typography variant="body2" className={classes.blockSub} component="div" align="center">
            <p>Arrange all your dashboard, chart, information, or anything else in your favorite ways.</p>
          </Typography>

          <Box className={classes.tokenTracker} align="center">
            <img src={customizableDashboard} className={props.classes.image100MaxWidth} alt="customizable dashboard" />
          </Box>
        </Box>
        {/* CUSTOMIZABLE DASHBOARD */}

      </Container>

      {/* FEATURES */}



      <Container>

        {/* TOKEN */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            MEO TOKEN STRUCTURE
          </Typography>

          <Typography variant="body2" className={classes.blockSub} component="div">
            <p>Our tokenomics have been designed to provide both stability and reward holders while sustaining ecosystem development and growth.</p>

            <p>A 7% transaction tax grants at the same time a constant increase of holdings for our investors, liquidity, and funding for our venture.</p>
          </Typography>

          <Box className={classes.tokenStructure}>
            <Box className={classes.token} style={{ width: '80%', }}>
              <Box className={classes.tokenBar} style={{ backgroundColor: '#f15a91', }}>
                80%
              </Box>
              <Box className={classes.tokenLabel}>
                Distributed to Community
              </Box>
            </Box>
            <Box className={classes.token} style={{ width: '7.5%', }}>
              <Box className={classes.tokenBar} style={{ backgroundColor: '#603cab', }}>
                7.5%
              </Box>
              <Box className={classes.tokenLabel}>
                Team
              </Box>
            </Box>
            <Box className={classes.token} style={{ width: '5%', }}>
              <Box className={classes.tokenBar} style={{ backgroundColor: '#004eff', }}>
                5%
              </Box>
              <Box className={classes.tokenLabel}>
                Burn
              </Box>
            </Box>
            <Box className={classes.token} style={{ width: '5%', }}>
              <Box className={classes.tokenBar} style={{ backgroundColor: '#1ebade', }}>
                5%
              </Box>
              <Box className={classes.tokenLabel}>
                Founder
              </Box>
            </Box>
            <Box className={classes.token} style={{ width: '2.5%', }}>
              <Box className={clsx(classes.tokenBar, classes.tokenBarLast)} style={{ backgroundColor: '#05796e', }}>
                2.5%
              </Box>
              <Box className={classes.tokenLabel}>
                Advisors
              </Box>
            </Box>
          </Box>

          <Box className={classes.tokenInformation}>
            <Grid container spacing={1}>
              <Grid item sm={8} xs={12}>
                <Typography variant="h5" className={classes.tokenInfoH5}>
                  Token Metrics
                </Typography>

                <Typography variant="body2" className={classes.tokenInfoBody}>
                  <span className={classes.tokenInfoLabel}>Token Name:</span> Meo.tools<br />
                  <span className={classes.tokenInfoLabel}>Token Symbol:</span> MEO<br />
                  <span className={classes.tokenInfoLabel}>Token Decimals:</span> 9<br />
                  <span className={classes.tokenInfoLabel}>Token Type:</span> BEP-20<br />
                  <span className={classes.tokenInfoLabel}>Contract Address:</span>
                  {` `}
                  {CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.MEO_CONTRACT_ADDRESS : CONSTANT.MAIN_NET.MEO_CONTRACT_ADDRESS}

                  <Tooltip title="Copy address" placement="top" arrow>
                    <IconButton className={classes.margin}
                      onClick={() => {
                        copyToClipboard(CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.MEO_CONTRACT_ADDRESS : CONSTANT.MAIN_NET.MEO_CONTRACT_ADDRESS)
                          .then(() => enqueueSnackbar('Copied to Clipboard'))
                          .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
                      }} size="small">
                      <FileCopyIcon className={classes.copyIcon} />
                    </IconButton>
                  </Tooltip>

                  <br />
                  <span className={classes.tokenInfoLabel}>Total Supply:</span> 1,000,000,000 MEO<br />
                </Typography>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Typography variant="h5" className={classes.tokenInfoH5}>
                  Tokenomics
                </Typography>

                <Typography variant="body2" className={classes.tokenInfoBody}>
                  <span className={classes.tokenInfoLabel}>Re-distribute to Holders:</span> 2%<br />
                  <span className={classes.tokenInfoLabel}>Add to liquidity pool:</span> 4%<br />
                  <span className={classes.tokenInfoLabel}>Funds marketing / development:</span> 1%<br />
                  {/* <span className={classes.tokenInfoLabel}>Funds improvement:</span> 0%<br /> */}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* TOKEN */}



        {/* PRE-SALE FUNDS ALLOCATION */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            PRE-SALE FUNDS ALLOCATION
          </Typography>

          <Box className={classes.meoToolsEcosystem} align="center">
            <img src={preSaleFundsAllocation} className={props.classes.image100MaxWidth} alt="meo.tools ecosystem" />
          </Box>
        </Box>
        {/* PRE-SALE FUNDS ALLOCATION */}



        {/* ROADMAP */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            WHAT STAGE ARE WE AT?
          </Typography>

          <Box className={classes.timeline}>

            <Box className={classes.timelineItem}>
              <Box className={clsx(classes.timelineItemDate, classes.timelineItemDatePast)}>
                <Box className={classes.timelineItemTime}>
                  June 1, 2021
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Platform Idea
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <p>Ideal and draft the tools</p>
              </Box>
            </Box>

            <Box className={classes.timelineItem}>
              <Box className={clsx(classes.timelineItemDate, classes.timelineItemDatePast)}>
                <Box className={classes.timelineItemTime}>
                  June 15, 2021
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Implement the first version of the tool
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <ul>
                  <li>Add tokens to Watchlist - Portfolio</li>
                  <li>Create alerts for the tokens</li>
                  <li>Get alert via browser notification</li>
                  <li>Get alert via Telegram</li>
                </ul>
              </Box>
            </Box>

            <Box className={classes.timelineItem}>
              <Box className={clsx(classes.timelineItemDate, classes.timelineItemDatePast)}>
                <Box className={classes.timelineItemTime}>
                  June 27, 2021
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Launch tools
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <p>Launch the first release on meo.tools domain</p>
              </Box>
            </Box>

            <Box className={classes.timelineItem}>
              <Box className={clsx(classes.timelineItemDate, classes.timelineItemDatePast)}>
                <Box className={classes.timelineItemTime}>
                  July 13, 2021
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Add more features to the tool
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <ul>
                  <li>Implement token chart feature</li>
                  <li>Implement token trade history</li>
                  <li>Connect to Ethereum and Polygon networks</li>
                  <li>Implement top tokens by 24h volume board</li>
                </ul>
              </Box>
            </Box>

            <Box className={classes.timelineItem}>
              <Box className={clsx(classes.timelineItemDate, classes.timelineItemDatePast)}>
                <Box className={classes.timelineItemTime}>
                  August 1, 2021
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Middle of Q3, 2021
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <ul>
                  <li>Develop and deploy smart contracts</li>
                  <li>First Airdrops event</li>
                  <li>Re-design website application</li>
                  <li>Design website, white-paper, media for marketing</li>
                  <li>Complete marketing plan</li>
                  <li>Submit token to Coinmarketcap</li>
                  <li>Open Private Sale</li>
                  <li>Pre-Sale On Meo.tools launchpad</li>
                  <li>Launch On Pancake Swap</li>
                  <li>Submit token to Coingecko</li>
                  <li>Techrate Audit</li>
                  <li>Marketing & Advertising Strategy</li>
                </ul>
              </Box>
            </Box>

            <Box className={classes.timelineItem}>
              <Box className={classes.timelineItemDate}>
                <Box className={classes.timelineItemTime}>
                  October 1, 2021
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Q4 2021
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <ul>
                  <li>Certik Audit</li>
                  <li>Re-submit token to Coinmarketcap</li>
                  <li>Expand team</li>
                  <li>Submit token to DappRadar</li>
                  <li>Logo On Web3 Wallets And Pancake Swap</li>
                  <li>Apply new skin for the tool (v. 1.0.0)</li>
                  <li>Tracking the price on the server-side</li>
                  <li>Alert by step (0.5, 1, 5, 10…)</li>
                  <li>Implement the new version for the tools</li>
                  <li>Implement tier functions</li>
                  <li>Implement trade features</li>
                  <li>Implement other support tools</li>
                </ul>
              </Box>
            </Box>

            <Box className={classes.timelineItem}>
              <Box className={clsx(classes.timelineItemDate, classes.timelineItemDatePresent)}>
                <Box className={clsx(classes.timelineItemTime, classes.timelineItemTimePresent)}>
                  January 1, 2022
                </Box>
                <Box className={classes.timelineItemTitle}>
                  Q1 2022
                </Box>
              </Box>
              <Box className={classes.timelineItemContent}>
                <ul>
                  <li>Implement Mobile app version</li>
                  <li>Extend more networks</li>
                  <li>Extend more products</li>
                </ul>
              </Box>
            </Box>

          </Box>
        </Box>
        {/* ROADMAP */}



        {/* TEAM */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            OUR MOTIVATED TEAM
          </Typography>

          <Grid container spacing={4} className={classes.teams} align="center">

            <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Tony Nguyen" src={avatarMeo} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                  <Tooltip
                    title="Go to Linkedin"
                    placement="top"
                    arrow
                  >
                    <IconButton
                      target="_blank"
                      href={`https://www.linkedin.com/in/tony-nguyen-b2a93968/`}
                      className={classes.teamIconButton}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Tony Nguyen
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Founder - CEO (VN)
                </Typography>
              </Box>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Arsal Rajpoot" src={avatarArsal} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                  <Tooltip
                    title="Go to Linkedin"
                    placement="top"
                    arrow
                  >
                    <IconButton
                      target="_blank"
                      href={`https://www.linkedin.com/in/arsal-rajpoot-166a64220/`}
                      className={classes.teamIconButton}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Arsal Rajpoot
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Marketing Lead (PK)
                </Typography>
              </Box>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Roha Nabeel" src={avatarRoha} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Roha Nabeel
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Content Writer (PK)
                </Typography>
              </Box>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Alicia Do" src={avatarDefault} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Alicia Do
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Digital Marketing Executive (VN)
                </Typography>
              </Box>
            </Grid>

            {/* <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Isabella Cuda" src={avatarIsabella} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Isabella Cuda
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Professional Designer (US)
                </Typography>
              </Box>
            </Grid> */}

          </Grid>
        </Box>
        {/* TEAM */}



        {/* STRATEGIC PARTNERSHIPS */}
        <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            STRATEGIC PARTNERSHIPS
          </Typography>

          <Grid container spacing={4} className={classes.teams} align="center">

            <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Sutriono, S.Pd." src={avatarSutriono} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                  <Tooltip
                    title="Go to Linkedin"
                    placement="top"
                    arrow
                  >
                    <IconButton
                      target="_blank"
                      href={`https://www.linkedin.com/mwlite/in/sutriono-spd-ba7598222`}
                      className={classes.teamIconButton}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Sutriono, S.Pd.
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Strategic Partnerships (ID)
                </Typography>
              </Box>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
              <Box className={classes.team}>
                <Box className={classes.teamAvatarWrap}>
                  <Avatar alt="Kepling" src={avatarDefault} className={clsx(props.classes.image100MaxWidth, classes.teamAvatar)} />
                </Box>
                <Typography variant="h4" className={classes.teamName}>
                  Kepling
                </Typography>
                <Typography variant="body2" className={classes.teamPosition}>
                  Strategic Partnerships (ID)
                </Typography>
              </Box>
            </Grid>

          </Grid>
        </Box>
        {/* STRATEGIC PARTNERSHIPS */}



        {/* BONUS */}
        {/* <Box className={classes.block}>
          <Typography variant="h2" className={classes.blockTitle}>
            BONUS STRUCTURE
          </Typography>

          <Typography variant="body2" className={classes.blockSub} component="div">
            <p>The number of tokens for the IDO is:</p>
            <ul>
              <li>Private Sale: <strong>400,000 MEO / BNB ~ $0.001148 USD</strong></li>
              <li>Pre-sale: <strong>360,000 MEO / BNB ~ $0.001275 USD</strong></li>
              <li>Public Sale: <strong>324,000 MEO / BNB ~ $0.001417 USD</strong></li>
            </ul>
            <p>The token subscribed by IDO will be fully released and will not be locked</p>
            <p>Your tokens will be airdropped right after launch, you don't need to claim and lost the fee.</p>
          </Typography>

          <Grid container spacing={3} className={classes.bonusStructure}>
            <Grid item md={6} sm={12} xs={12}>
              <Box className={classes.bonusCardHeading}>
                Private sale
              </Box>
              <Box className={classes.bonusCardContent}>
                <Typography variant="h6" className={classes.bonusCardContentTitle}>
                  Users registered in the Private Sale
                </Typography>
                <Typography variant="body2">
                  <span className={classes.bonusLabel}>
                    <CheckCircleIcon fontSize="small" className={classes.bonusIcon} />
                    20% Bonus on any purchase amount
                  </span>
                </Typography>
              </Box>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Box className={clsx(classes.bonusCardHeading, classes.bonusCardHeading2)}>
                Pre-sale
              </Box>
              <Box className={classes.bonusCardContent}>
                <Typography variant="h6" className={classes.bonusCardContentTitle}>
                  Calculate token price
                </Typography>
                <Typography variant="body2">
                  <span className={classes.bonusLabel}>
                    <CheckCircleIcon fontSize="small" className={clsx(classes.bonusIcon, classes.bonusIcon2)} />
                    10% Bonus on any purchase amount
                  </span>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box> */}
        {/* BONUS */}

      </Container>
    </>
  );
}