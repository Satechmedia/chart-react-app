// Packages
import { Router, Route, Switch, Link, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
// import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import TelegramIcon from '@material-ui/icons/Telegram';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Css
import './Transport.scss';

// Images
import logo from 'images/logo_52x52.png';

// Pages
import Chart from 'components/pages/Chart';
import Home from 'components/pages/Home';
import LandingPage from 'components/pages/landing-pages/LandingPage';
// import V1 from 'components/pages/V1';

// Variable
import { CONSTANT } from 'config/Constant';
import { LANGUAGES } from 'languages/Languages';

// Library
import {
  formatTokenPrice,
  getShortToken,
} from 'components/libraries/Common';

// package.json
var pjson = require('./../../package.json');

// Constant
const
  backgroundColor = '#111E31',
  appBarBackgroundColor = '#212A3A',
  greyColor = '#4E5661';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    background: backgroundColor,
    minHeight: '100vh',
    color: 'white',
  },

  // AppBar
  appBar: {
    background: appBarBackgroundColor,
    boxShadow: 'none',
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    width: 36,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: 30,
    },
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },

  divider: {
    height: 64,
    marginRight: '20px',
    background: greyColor,

    [theme.breakpoints.up("sm")]: {
      marginRight: '30px',
    },
  },

  coin: {
    marginRight: '20px',
    fontSize: '15px',
    fontWeight: 600,

    [theme.breakpoints.up("sm")]: {
      marginRight: '50px',
    },
  },
  avatar: {
    width: '22px',
    height: '22px',
    float: 'left',
    marginRight: '6px',
  },
  coinName: {
    color: '#F3BA2F',
    marginRight: '10px',
    float: 'left',
  },
  coinPrice: {
    marginRight: '10px',
    float: 'left',
  },
  coinStatus: {
    color: '#63D0CF',
    fontSize: '12px',
  },
  coinStatusIcon: {
    float: 'left',
  },

  // Main
  main: {
    marginTop: '20px',
  },

  // Footer
  footer: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    textAlign: 'center',
    background: appBarBackgroundColor,
  },
  footerTooltip: {
    marginLeft: theme.spacing(1),
  },
  footerIcon: {
    marginLeft: theme.spacing(1),
  },
}));

function App(props) {
  const classes = useStyles();
  const location = useLocation();

  const {
    connectWallet,
    languages,
    logoutWallet,
    setLanguages,
    walletAddress,
  } = props;

  // Change URL
  useEffect(() => {
    let
      language = 'en';

    if (location.pathname.substr(3, 1) === '/') {
      language = location.pathname.substr(1, 2);
    }

    const
      languages = LANGUAGES[language] ? LANGUAGES[language] : LANGUAGES['en'];

    setLanguages(languages);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={clsx(classes.root, 'v1')}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>

          <Link to="/">
            <img src={logo} className={classes.logo} alt="logo" />
          </Link>

          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              meo.tools
            </Link>
          </Typography>

          <Hidden smDown>
            <Box className={classes.coin}>
              <Link to={`/token/${CONSTANT.BNB_ADDRESS}`}>
                <Avatar alt="BNB" src="https://assets.coingecko.com/coins/images/12591/large/binance-coin-logo.png?1600947313" className={classes.avatar} />
                <span className={classes.coinName}>BNB</span>
              </Link>
              {props.priceBNB !== 0 &&
                <span className={classes.coinPrice}>{formatTokenPrice(props.priceBNB)}</span>
              }
              {/* <span className={classes.coinStatus}><KeyboardArrowUpIcon className={classes.coinStatusIcon} /> 7.45%</span> */}
            </Box>

            <Box className={classes.coin}>
              <Link to={`/token/${CONSTANT.MAIN_NET.MEO_CONTRACT_ADDRESS}`}>
                <Avatar alt="MEO" src="https://assets.coingecko.com/coins/images/18620/large/logo_200x200_%283%29.png?1632701201" className={classes.avatar} />
                <span className={classes.coinName}>MEO</span>
              </Link>
              {props.priceMEO !== 0 &&
                <span className={classes.coinPrice}>{formatTokenPrice(props.priceMEO)}</span>
              }
              {/* <span className={classes.coinStatus}><KeyboardArrowUpIcon className={classes.coinStatusIcon} /> 0.26%</span> */}
            </Box>
          </Hidden>

          <Hidden mdUp>
            <Box className={classes.coin}>
              <Link to={`/token/${CONSTANT.MAIN_NET.MEO_CONTRACT_ADDRESS}`}>
                <Avatar alt="MEO" src="https://assets.coingecko.com/coins/images/18620/large/logo_200x200_%283%29.png?1632701201" className={classes.avatar} />
                <span className={classes.coinName}>MEO</span>
              </Link>
            </Box>
          </Hidden>

          <Divider className={classes.divider} orientation="vertical" />

          {/* <IconButton
            edge="start"
            color="inherit"
            style={{ marginRight: 20 }}
          >
            <NotificationsIcon
              className={props.classes.icon}
              style={{ fontSize: 30 }}
            />
          </IconButton> */}

          {walletAddress &&
            <Button color="inherit" onClick={logoutWallet}>{languages.Logout} ({getShortToken(walletAddress)})</Button>
          }

          {!walletAddress &&
            <IconButton
              edge="start"
              color="inherit"
              onClick={connectWallet}
            >
              <AccountBalanceWalletIcon
                className={props.classes.icon}
                style={{ fontSize: 30 }}
              />
            </IconButton>
          }

        </Toolbar>
      </AppBar>

      <main className={classes.main}>
        <Switch>
          <Route
            exact
            path="/app"
            render={
              (propsRoute) => <Home
                {...propsRoute}
                {...props}
              />} />
          <Route
            exact
            path="/:language/app"
            render={
              (propsRoute) => <Home
                {...propsRoute}
                {...props}
              />} />

          <Route
            exact
            path="/add/:token"
            render={
              (propsRoute) => <Home
                {...propsRoute}
                {...props}
                category="add"
              />} />

          <Route
            exact
            path="/token/:token"
            render={
              (propsRoute) => <Home
                {...propsRoute}
                {...props}
                category="token"
              />} />

          <Route
            exact
            path="/token/chart/:version/:token"
            render={
              (propsRoute) => <Chart
                {...propsRoute}
                {...props}
                category="token"
              />} />

        </Switch>
      </main>

      <footer className={classes.footer}>
        <Container>
          <Typography variant="body2">

            {languages.Copyright}
            {` ©`}
            <strong>
              {' meo.tools '}
            </strong>
            {new Date().getFullYear()}
            . {languages.Version} {pjson.version}

            <Tooltip
              title="Go to Telegram channel"
              placement="top"
              arrow
              className={classes.footerTooltip}
            >
              <IconButton
                target="_blank"
                href={`https://t.me/meo_tools`}
                size="small"
              >
                <TelegramIcon
                  className={props.classes.icon}
                />
              </IconButton>
            </Tooltip>

          </Typography>
        </Container>
      </footer>
    </div>
  )
}

export default function Transport(props) {
  return (
    <Router history={props.history}>
      <Switch>
        <Route exact path="/">
          <LandingPage {...props} />
        </Route>
        <Route path="/presale">
          <LandingPage {...props} />
        </Route>
        {/* <Route path="/v1">
          <V1 {...props} />
        </Route> */}
        <Route>
          <App {...props} />
        </Route>
      </Switch>
    </Router >
  );
}