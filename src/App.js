// Packages
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useRef, useState, useEffect } from 'react';
import Push from 'push.js';
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnect from "@walletconnect/client";

// Material UI
import { amber, green, grey, red, orange, purple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

// Other
import Transport from 'components/Transport';

// Variable
import { CONSTANT, MESSAGE } from 'config/Constant';
import { LANGUAGES } from 'languages/Languages';

// Library
import history from 'components/libraries/History';
import {
  formatPrice,
  formatToken,
  formatTokenPrice,
  useLocalStorage,
} from 'components/libraries/Common';

// Services
import {
  sendTelegramMessage,
} from 'components/services/Telegrams';

import {
  getTokenPriceFromDexGuru,
} from 'components/services/Tokens';

// Css
import '@fontsource/roboto';

// Constant
const
  greyColor = '#4E5661';

// Styles
const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  amberButton: {
    color: theme.palette.getContrastText(amber[500]),
    backgroundColor: amber[500],
    '&:hover': {
      backgroundColor: amber[700],
    },
  },

  snackBarIcon: {
    padding: theme.spacing(1),
  },
  snackBarClose: {
    color: 'white',
  },

  linkButton: {
    backgroundColor: grey[100],
    padding: theme.spacing(0.6, 1),
    textDecoration: 'none',
    color: grey[900],
    fontWeight: 600,
    borderRadius: '0.375rem',
    display: 'inline-block',
    position: 'relative',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: grey[200],
      color: green[500],
    },
    '&>svg': {
      width: 14,
      height: 14,
      float: 'left',
      marginTop: 3,
      marginRight: 6,
    },
    '&>img': {
      width: 18,
      height: 18,
      float: 'left',
      marginTop: 1,
      marginRight: 6,
    },
  },
  spanButton: {
    backgroundColor: grey[100],
    padding: theme.spacing(0.6, 1),
    textDecoration: 'none',
    color: grey[900],
    fontWeight: 600,
    borderRadius: '0.375rem',
    display: 'inline-block',
    position: 'relative',
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

  loading: {
    padding: theme.spacing(6, 0),
    textAlign: 'center',
  },

  empty: {
    padding: theme.spacing(6, 0),
    textAlign: 'center',
  },

  colorGreen: {
    color: green[500],
  },
  colorRed: {
    color: red[500],
  },
  colorOrange: {
    color: orange[500],
  },
  colorPurple: {
    color: purple[500],
  },

  meoLink: {
    color: '#3f51b5',
    textDecoration: 'none',
  },
  meoLinkV1: {
    color: '#62D2CF',
    textDecoration: 'none',
    transition: 'all .3s ease',

    '&:hover': {
      color: 'white',
    },
  },

  divider: {
    margin: theme.spacing(1, 0, 2),
    clear: 'both',
  },

  image100MaxWidth: {
    maxWidth: '100%',
  },

  icon: {
    color: greyColor,
    transition: 'all .3s ease',

    '&:hover': {
      color: 'white',
    },
  },
}));

function App(props) {
  const classes = useStyles();
  const
    location = window.location;

  const { enqueueSnackbar } = useSnackbar();

  const pushGaViewPage = (title, path) => {
    const
      pageTitle = title ? title : document.title,
      pagePath = path ? path : window.location.pathname + window.location.search;

    window.gtag('config', process.env.REACT_APP_API_URL, {
      'page_title': pageTitle,
      'page_path': pagePath,
    });
  }

  const removeDynamicTitleAndSetNew = title => {
    document.title = title;

    pushGaViewPage(title);
  }

  const [watchlist, setWatchlist] = useLocalStorage('watchlist', {});
  const latestWatchlist = () => {
    let
      result = watchlist;

    result = JSON.parse(localStorage.getItem('watchlist')) || {};
    return result;
  }

  const getTotalBalance = () => {
    let result = 0;

    Object.keys(latestWatchlist()).forEach(key => {
      const row = latestWatchlist()[key];

      if (row.balance * row.priceUSD) {
        result += row.balance * row.priceUSD;
      }
    });

    return result;
  }

  const canAddWatchList = () => {
    const
      totalToken = Object.keys(latestWatchlist()).length;

    return !(totalToken >= CONSTANT.MAXIMUM_TOKEN_IN_A_WATCHLIST);
  }

  const addWatchList = (token) => {
    const
      address = token && token.address ? token.address : '';

    if (address && latestWatchlist() && !latestWatchlist()[address]) {
      if (!canAddWatchList()) {
        enqueueSnackbar(MESSAGE.MAXIMUM_TOKEN_IN_A_WATCHLIST);
      } else {
        const cloneWatchList = { ...latestWatchlist() };
        cloneWatchList[address] = token;
        setWatchlist(cloneWatchList);
      }
    }
  }

  const findTokenInWatchList = (address) => {
    return address && latestWatchlist() && latestWatchlist()[address];
  }

  const deleteTokenInWatchListByAddress = (address) => {
    if (findTokenInWatchList(address)) {
      const cloneWatchList = { ...latestWatchlist() };
      delete cloneWatchList[address];
      setWatchlist(cloneWatchList);
    }
  }

  const meoAlert = text => {
    enqueueSnackbar(text, {
      style: { whiteSpace: 'pre-line' }
    });

    Push.create(text, {
      onClick: function () {
        window.focus();
        this.close();
      }
    });

    // Alert via Telegram
    const
      telegramId = localStorage.getItem('telegramId');
    if (telegramId) {
      sendTelegramMessage(telegramId, encodeURIComponent(text)).then(result => {
        if (!result) {
          enqueueSnackbar('Can not send a message via Telegram');
        }
      });
    }
  }

  const checkAlert = (token, priceUSD) => {
    if (token && priceUSD) {
      const
        alerts = getAlertsByAddress(token.address);

      let
        text = '';

      if (alerts.length !== 0) {
        alerts.forEach((alert, index) => {
          if (alert['checked']) {
            // price-ries-above
            if (alert['alertType'] === "price-ries-above") {
              if (priceUSD > alert['value']) {
                text = `${token.symbol} is above ${formatTokenPrice(alert['value'])}`;
                if (token.balance) {
                  text += `\nYour ${token.symbol} token is ${formatToken(token.balance)}`;
                  text += `\nYour ${token.symbol} balance now is ${formatPrice(token.balance * priceUSD)}`;
                }
                meoAlert(text);
                setTimeout(() => {
                  toggleAlertOfAddress(token.address, index);
                });
              }
            }

            // price-drops-to
            if (alert['alertType'] === "price-drops-to") {
              if (priceUSD < alert['value']) {
                text = `${token.symbol} is below ${formatTokenPrice(alert['value'])}`;
                if (token.balance) {
                  text += `\nYour ${token.symbol} token is ${formatToken(token.balance)}`;
                  text += `\nYour ${token.symbol} balance now is ${formatPrice(token.balance * priceUSD)}`;
                }
                meoAlert(text);
                setTimeout(() => {
                  toggleAlertOfAddress(token.address, index);
                });
              }
            }
          }
        });
      }
    }
  }

  const updateTokenPriceInWatchListByAddress = (address, priceUSD) => {
    if (findTokenInWatchList(address)) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        checkAlert(latestWatchlist()[address], priceUSD);

        const cloneWatchList = { ...latestWatchlist() };
        cloneWatchList[address]['priceUSD'] = priceUSD;
        setWatchlist(cloneWatchList);
      }
    }
  }

  const updateTokenBalanceInWatchListByAddress = (address, balance) => {
    if (findTokenInWatchList(address)) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const cloneWatchList = { ...latestWatchlist() };
        cloneWatchList[address]['balance'] = balance;
        setWatchlist(cloneWatchList);
      }
    }
  }

  const updateTokenAlertOpenInWatchListByAddress = (address, value) => {
    if (findTokenInWatchList(address)) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const cloneWatchList = { ...latestWatchlist() };
        cloneWatchList[address]['alertOpen'] = value;
        setWatchlist(cloneWatchList);
      }
    }
  }

  const updateTokenAlertHighlightInWatchListByAddress = (address, value) => {
    if (findTokenInWatchList(address)) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const cloneWatchList = { ...latestWatchlist() };
        cloneWatchList[address]['alertHighlight'] = value;
        setWatchlist(cloneWatchList);
      }
    }
  }

  // Alerts
  const getAlertsByAddress = (address) => {
    let
      results = [];

    if (findTokenInWatchList(address)) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        results = latestWatchlist()[address]['alerts'] || [];
      }
    }

    return results;
  }

  const addAlertToAddress = (address, alertType, value) => {
    if (findTokenInWatchList(address) && alertType && value) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const
          alerts = latestWatchlist()[address]['alerts'] || [],
          cloneWatchList = { ...latestWatchlist() };

        alerts.push({
          alertType: alertType,
          value: value,
          checked: true,
        });

        cloneWatchList[address]['alerts'] = alerts;
        setWatchlist(cloneWatchList);
      }
    }
  }

  const editAlertOfAddress = (address, index, alertType, value) => {
    if (findTokenInWatchList(address) && index !== undefined && alertType && value) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const
          alerts = latestWatchlist()[address]['alerts'] || [],
          cloneWatchList = { ...latestWatchlist() };

        if (alerts && alerts[index]) {
          alerts[index]['alertType'] = alertType;
          alerts[index]['value'] = value;

          cloneWatchList[address]['alerts'] = alerts;
          setWatchlist(cloneWatchList);
        }
      }
    }
  }

  const deleteAlertOfAddress = (address, index) => {
    if (findTokenInWatchList(address) && index !== undefined) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const
          alerts = latestWatchlist()[address]['alerts'] || [],
          cloneWatchList = { ...latestWatchlist() };

        if (alerts && alerts[index]) {
          cloneWatchList[address]['alerts'].splice(index, 1);;
          setWatchlist(cloneWatchList);
        }
      }
    }
  }

  const toggleAlertOfAddress = (address, index) => {
    if (findTokenInWatchList(address) && index !== undefined) {
      if (latestWatchlist() && latestWatchlist()[address]) {
        const
          alerts = latestWatchlist()[address]['alerts'] || [],
          cloneWatchList = { ...latestWatchlist() };

        if (alerts && alerts[index]) {
          cloneWatchList[address]['alerts'][index]['checked'] = !cloneWatchList[address]['alerts'][index]['checked'];
          setWatchlist(cloneWatchList);
        }
      }
    }
  }

  const countTotalAlert = () => {
    let
      count = 0;

    Object.keys(latestWatchlist()).forEach(key => {
      const row = latestWatchlist()[key];

      if (row.alerts) {
        count += row.alerts.length;
      }
    });

    return count;
  }

  // Test
  const emptyTikiAlert = () => {
    const
      address = '0x9b76d1b12ff738c113200eb043350022ebf12ff0';

    if (latestWatchlist() && latestWatchlist()[address]) {
      const cloneWatchList = { ...latestWatchlist() };
      delete cloneWatchList[address]['alerts'];

      setWatchlist(cloneWatchList);
    }
  }

  const toggleDekoAlert = () => {
    const
      address = '0x648259243f8a060c38b20dc16214cf0f928f49f1';

    if (latestWatchlist() && latestWatchlist()[address]) {
      const
        alerts = latestWatchlist()[address]['alerts'] || [],
        cloneWatchList = { ...latestWatchlist() };

      if (alerts) {
        cloneWatchList[address]['alerts'][0]['checked'] = !cloneWatchList[address]['alerts'][0]['checked'];

        setWatchlist(cloneWatchList);
      }
    }
  }

  const testPush = () => {
    Push.create("Hello world!", {
      body: "How's it hangin'?",
      timeout: 20000,
      onClick: function () {
        window.focus();
        this.close();
      }
    });
  }

  const scrollTo = id => {
    if (document.getElementById(id)) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', });
    }
  }

  const goToChart = address => {
    if (address) {
      history.push(`/token/${address}`);
      scrollTo("chart-widget");
    }
  }

  const [tokenListActivedTab, setTokenListActivedTab] = useLocalStorage('tokenListActivedTab', 'watchlist');
  const tokenListHandleChange = (event, value) => {
    setTokenListActivedTab(value);
  }

  // tokenViewHistories
  const [tokenViewHistories, setTokenViewHistories] = useLocalStorage('tokenViewHistories', []);

  const addTokenViewHistories = (token) => {
    const
      address = token && token.address ? token.address : '';

    let
      cloneTokenViewHistories = [...tokenViewHistories];

    if (address) {
      // Delete old token in token view histories
      cloneTokenViewHistories = cloneTokenViewHistories.filter(value => {
        return value.address !== address;
      })

      // Add to the begining of the list
      cloneTokenViewHistories.unshift(token);

      // Limit length
      if (cloneTokenViewHistories.length > 60) {
        cloneTokenViewHistories.length = 60;
      }

      setTokenViewHistories(cloneTokenViewHistories);
    }
  }

  const removeTokenViewHistoriesByAddress = address => {
    const filtered = tokenViewHistories.filter(value => {
      return value.address !== address;
    });
    setTokenViewHistories(filtered);
  }



  // Create a connector
  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
  });

  // Subscribe to connection events
  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Get provided accounts and chainId
    const { accounts } = payload.params[0];

    if (accounts && accounts.length) {
      setWalletAddress(accounts[0]);
    }
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }

    // Get updated accounts and chainId
    const { accounts } = payload.params[0];

    if (accounts && accounts.length) {
      setWalletAddress(accounts[0]);
    }
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Delete connector
    logoutWallet();
  });

  // walletAddress
  const [walletAddress, setWalletAddress] = useLocalStorage('walletAddress');

  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      // Meta Mask
      const walletAddresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (walletAddresses.length > 0 && walletAddresses[0]) {
        setWalletAddress(walletAddresses[0]);
        return walletAddresses[0];
      }
    } else if (!connector.connected) {
      // Wallet Connect
      connector.createSession();
    } else {
      logoutWallet();

      setTimeout(() => {
        connector.createSession();
      }, 500);
    }
  }

  const logoutWallet = () => {
    setWalletAddress('');

    if (connector.connected) {
      connector.killSession();
    }
  }

  const changeToBSCNetwork = async () => {
    if (window.ethereum) {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.BSC_CHAIN_ID : CONSTANT.MAIN_NET.BSC_CHAIN_ID }], // chainId must be in hexadecimal numbers
        });

        return true;
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.BSC_CHAIN_ID : CONSTANT.MAIN_NET.BSC_CHAIN_ID,
                  chainName: CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.BSC_CHAIN_NAME : CONSTANT.MAIN_NET.BSC_CHAIN_NAME,
                  nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                  },
                  rpcUrls: [CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.BSC_CHAIN_URL : CONSTANT.MAIN_NET.BSC_CHAIN_URL],
                  blockExplorerUrls: [CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.BSC_CHAIN_EXPLORER_URL : CONSTANT.MAIN_NET.BSC_CHAIN_EXPLORER_URL],
                },
              ],
            });

            return true;
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    } else {
      enqueueSnackbar('MetaMask is not installed!');
    }
  }

  const [txHash, setTxHash] = useState();

  const sendBNBToMeoPrivateSaleWallet = async (walletAddress, bnb) => {
    setTxHash(null);

    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: walletAddress,
            to: CONSTANT.USE_TEST_NET ? CONSTANT.TEST_NET.PRIVATE_SALE_WALLET : CONSTANT.MAIN_NET.PRIVATE_SALE_WALLET,
            value: (bnb * 10 ** CONSTANT.BNB_DECIMALS).toString(16),
            // gas: "0x2710",
            // gasPrice: "0x09184e72a000",
          },
        ],
      })
      .then((txHash) => setTxHash(txHash))
      .catch((error) => console.error);
  }

  const checkWalletAddress = async () => {
    if (!walletAddress) {
      const walletAddress = await connectWallet();

      return walletAddress;
    } else {
      return walletAddress;
    }
  }

  const buyPrivateSale = async (bnb) => {
    const changeNetwork = await changeToBSCNetwork();

    if (changeNetwork) {
      const walletAddress = await checkWalletAddress();

      if (walletAddress) {
        sendBNBToMeoPrivateSaleWallet(walletAddress, bnb);
      }
    }
  }



  const copyToClipboard = textToCopy => {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
  }



  const [languages, setLanguages] = useState({});

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



  // Get BNB and MEO price
  let
    cleaned = useRef(false),
    timeoutBNB = useRef(),
    timeoutMEO = useRef();

  // BNB
  const [updatingBNB, setUpdatingBNB] = useState();
  const [priceBNB, setPriceBNB] = useState(0);

  const updatePriceBNB = () => {
    if (!updatingBNB) {
      setUpdatingBNB(true);
      getTokenPriceFromDexGuru(CONSTANT.BNB_ADDRESS, 'bsc').then(result => {
        if (!cleaned.current) {
          if (result && result.priceUSD) {
            setPriceBNB(result.priceUSD);
          }
          timeoutBNB.current = setTimeout(updatePriceBNB, CONSTANT.DELAY_TIME);
          setUpdatingBNB(false);
        }
      });
    }
  }

  // MEO
  const [updatingMEO, setUpdatingMEO] = useState();
  const [priceMEO, setPriceMEO] = useState(0);

  const updatePriceMEO = () => {
    if (!updatingMEO) {
      setUpdatingMEO(true);
      getTokenPriceFromDexGuru(CONSTANT.MAIN_NET.MEO_CONTRACT_ADDRESS, 'bsc').then(result => {
        if (!cleaned.current) {
          if (result && result.priceUSD) {
            setPriceMEO(result.priceUSD);
          }
          timeoutMEO.current = setTimeout(updatePriceMEO, CONSTANT.DELAY_TIME);
          setUpdatingMEO(false);
        }
      });
    }
  }

  useEffect(() => {
    cleaned.current = false;

    if (location.pathname.substr(0, 13) !== '/token/chart/') {
      updatePriceBNB();
      updatePriceMEO();
    }

    return function cleanup() {
      clearTimeout(timeoutBNB.current);
      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <Transport
      {...props}
      addAlertToAddress={addAlertToAddress}
      addTokenViewHistories={addTokenViewHistories}
      addWatchList={addWatchList}
      buyPrivateSale={buyPrivateSale}
      canAddWatchList={canAddWatchList}
      classes={classes}
      connectWallet={connectWallet}
      copyToClipboard={copyToClipboard}
      countTotalAlert={countTotalAlert}
      deleteAlertOfAddress={deleteAlertOfAddress}
      deleteTokenInWatchListByAddress={deleteTokenInWatchListByAddress}
      editAlertOfAddress={editAlertOfAddress}
      emptyTikiAlert={emptyTikiAlert}
      enqueueSnackbar={enqueueSnackbar}
      findTokenInWatchList={findTokenInWatchList}
      getAlertsByAddress={getAlertsByAddress}
      getTotalBalance={getTotalBalance}
      goToChart={goToChart}
      history={history}
      languages={languages}
      logoutWallet={logoutWallet}
      priceBNB={priceBNB}
      priceMEO={priceMEO}
      pushGaViewPage={pushGaViewPage}
      removeDynamicTitleAndSetNew={removeDynamicTitleAndSetNew}
      removeTokenViewHistoriesByAddress={removeTokenViewHistoriesByAddress}
      scrollTo={scrollTo}
      setLanguages={setLanguages}
      setTokenListActivedTab={setTokenListActivedTab}
      setTokenViewHistories={setTokenViewHistories}
      testPush={testPush}
      toggleAlertOfAddress={toggleAlertOfAddress}
      toggleDekoAlert={toggleDekoAlert}
      tokenListActivedTab={tokenListActivedTab}
      tokenListHandleChange={tokenListHandleChange}
      tokenViewHistories={tokenViewHistories}
      txHash={txHash}
      updateTokenAlertHighlightInWatchListByAddress={updateTokenAlertHighlightInWatchListByAddress}
      updateTokenAlertOpenInWatchListByAddress={updateTokenAlertOpenInWatchListByAddress}
      updateTokenBalanceInWatchListByAddress={updateTokenBalanceInWatchListByAddress}
      updateTokenPriceInWatchListByAddress={updateTokenPriceInWatchListByAddress}
      walletAddress={walletAddress}
      watchlist={watchlist}
    />
  );
}

export default function IntegrationNotistack(props) {
  const classes = useStyles();

  // add action to all snackbars
  const
    notistackRef = useRef();

  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
  }

  return (
    <SnackbarProvider
      maxSnack={6}
      ref={notistackRef}
      action={(key) => (
        <IconButton className={classes.snackBarIcon} onClick={onClickDismiss(key)}>
          <CloseIcon className={classes.snackBarClose} />
        </IconButton>
      )}
    >
      <App {...props} />
    </SnackbarProvider>
  );
}