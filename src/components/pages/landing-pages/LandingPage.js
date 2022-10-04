// Packages
import { Route, Switch, Link } from "react-router-dom";
import { useState } from 'react';
import clsx from 'clsx';

// Material UI
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
// import FormControl from '@material-ui/core/FormControl';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';

// Images
import logo from 'images/logo_52x52.png';
import mainBackgroundMobile from 'images/top-bg_01.jpeg';

// Pages
import LandingPageHome from 'components/pages/landing-pages/LandingPageHome';
import LandingPagePresale from 'components/pages/landing-pages/LandingPagePresale';
import Social from 'components/pages/landing-pages/Social';

// Library
import {
  getShortToken,
} from 'components/libraries/Common';

// package.json
var pjson = require('../../../../package.json');

// Constant
const
  backgroundColor = '#1e124f',
  appBarBackgroundColor = '#100736',
  drawerBackgroundColor = '#1e1250',
  drawerWidth = 220;

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
    padding: theme.spacing(1, 0),
    position: 'relative',
    zIndex: 1,

    [theme.breakpoints.up("md")]: {
      background: 'transparent',
      boxShadow: 'none',
    },
  },
  appBarContainer: {
    padding: theme.spacing(0),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  titleMenu: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  logout: {
    paddingLeft: '5px',
    paddingRight: '5px',

    [theme.breakpoints.up(375)]: {
      paddingLeft: '15px',
      paddingRight: '15px',
    },
  },
  logo: {
    width: 30,
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: 48,
    },
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },

  // Drawer
  drawerPaper: {
    background: drawerBackgroundColor,
    width: drawerWidth,
    color: 'white',
  },

  // Main
  main: {
    paddingTop: theme.spacing(6),
    position: 'relative',

    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(12),
    },

    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(16),
    },
  },
  mainBackground: {
    backgroundImage: `url(${mainBackgroundMobile})`,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '896px',
    backgroundPosition: 'center top',
    opacity: 0.3,
    backgroundRepeat: 'no-repeat',

    [theme.breakpoints.up("md")]: {
      top: '-80px',
    }
  },

  // Footer
  footer: {
    marginTop: theme.spacing(6),
    background: appBarBackgroundColor,
    paddingTop: theme.spacing(3),
    textAlign: 'center',

    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(12),
    },
  },
  footerTop: {
    paddingBottom: theme.spacing(1),
  },
  footerTopText: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 5),
  },
  footerDivider: {
    background: '#ffffff54',
  },
  footerBottom: {
    paddingBottom: theme.spacing(2),
  },


  // Zoom
  zoom: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.zoom}>
        {children}
      </div>
    </Zoom>
  );
}

export default function LandingPage(props) {
  const classes = useStyles();

  const {
    connectWallet,
    history,
    logoutWallet,
    walletAddress,
  } = props;

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        className={classes.appBar}
      >
        <Container className={classes.appBarContainer}>
          <Toolbar id="back-to-top-anchor">

            <Hidden mdUp>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>

            <Link to="/">
              <img src={logo} className={classes.logo} alt="logo" />
            </Link>


            <Typography variant="h6" className={classes.title}>
              <Hidden only="xs">
                <Link to="/" className={classes.link}>
                  meo.tools
                </Link>
              </Hidden>
            </Typography>

            <Hidden smDown>
              {/* <Typography variant="h6" className={classes.titleMenu}>
                <Link
                  to="/presale"
                  className={classes.link}
                >
                  Presale
                </Link>
              </Typography> */}
              <Typography variant="h6" className={classes.titleMenu}>
                <a
                  href="https://pancakeswap.finance/swap?outputCurrency=0x7dff85eeb321957a429fa220ec2664774240b766"
                  target="_blank"
                  className={classes.link}
                  rel="noreferrer"
                >
                  Buy on PancakeSwap
                </a>
              </Typography>
              <Typography variant="h6" className={classes.titleMenu}>
                <a
                  href="https://drive.google.com/file/d/1nf0u4ByqCbXXdvXI2dO--e1X6EKcrUxD/view"
                  target="_blank"
                  className={classes.link}
                  rel="noreferrer"
                >
                  Whitepaper
                </a>
              </Typography>
              <Typography variant="h6" className={classes.titleMenu}>
                <a
                  href="https://www.certik.org/projects/meo-tools"
                  target="_blank"
                  className={classes.link}
                  rel="noreferrer"
                >
                  Certik Audit
                </a>
              </Typography>
              <Typography variant="h6" className={classes.titleMenu}>
                <a
                  href="https://docs.meo.tools/"
                  target="_blank"
                  className={classes.link}
                  rel="noreferrer"
                >
                  Docs
                </a>
              </Typography>
              <Typography variant="h6" className={classes.titleMenu}>
                <Link
                  to="/app/"
                  className={classes.link}
                >
                  App (v. {pjson.version})
                </Link>
              </Typography>
            </Hidden>

            {walletAddress &&
              <Button variant="outlined" className={classes.logout} color="inherit" onClick={logoutWallet}>LOGOUT ({getShortToken(walletAddress)})</Button>
            }

            {!walletAddress &&
              <Button variant="outlined" color="inherit" onClick={connectWallet}>CONNECT</Button>
            }

          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        open={open}
        onClose={handleDrawerClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              history.push(`/`);
            }}
          >
            <ListItemText primary="Homepage" />
          </ListItem>
          {/* <ListItem
            button
            onClick={() => {
              history.push(`/presale`);
            }}
          >
            <ListItemText primary="Presale" />
          </ListItem> */}
          <ListItem
            button
            component="a"
            href="https://pancakeswap.finance/swap?outputCurrency=0x7dff85eeb321957a429fa220ec2664774240b766"
            target="_blank"
          >
            <ListItemText primary="Buy on PancakeSwap" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://drive.google.com/file/d/1nf0u4ByqCbXXdvXI2dO--e1X6EKcrUxD/view"
            target="_blank"
          >
            <ListItemText primary="Whitepaper" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://www.certik.org/projects/meo-tools"
            target="_blank"
          >
            <ListItemText primary="Certik Audit" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://docs.meo.tools/"
            target="_blank"
          >
            <ListItemText primary="Docs" />
          </ListItem>
        </List>
        <Divider style={{ background: grey[500], }} />
        <List>
          <ListItem
            button
            onClick={() => {
              history.push(`/app/`);
            }}
          >
            <ListItemText primary={`App (v. ${pjson.version})`} />
          </ListItem>
        </List>
      </Drawer>

      <main className={classes.main}>
        <Switch>
          <Route exact path="/">
            <Box className={classes.mainBackground}></Box>
            <LandingPageHome {...props} />
          </Route>
          <Route path="/presale">
            <LandingPagePresale {...props} />
          </Route>
        </Switch>
      </main>

      <footer className={classes.footer}>
        <Container>
          <Box className={classes.footerTop}>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
            <Typography variant="body2" className={classes.footerTopText}>
              All-in-one crypto ecosystem, the next tracking dashboard generation
            </Typography>
          </Box>

          <Divider className={clsx(props.classes.divider, classes.footerDivider)} />

          <Box className={classes.footerBottom}>
            <Typography variant="body2" className={classes.footerBottom}>
              <Social />
            </Typography>

            <Typography variant="body2">
              {'Copyright ©'}
              <strong>
                {' meo.tools '}
              </strong>
              {new Date().getFullYear()}
            </Typography>
          </Box>
        </Container>
      </footer>

      <ScrollTop {...props}>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div >
  );
}