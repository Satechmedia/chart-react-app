// Packages
import { round } from "lodash";
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import React from 'react';

// Material UI
// import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GitHubIcon from '@material-ui/icons/GitHub';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Link from '@material-ui/core/Link';
import NotificationsIcon from '@material-ui/icons/Notifications';
import StarIcon from '@material-ui/icons/Star';
import TelegramIcon from '@material-ui/icons/Telegram';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterIcon from '@material-ui/icons/Twitter';
import Typography from '@material-ui/core/Typography';

// Library
import {
  formatPrice,
  formatToken,
  formatTokenPrice,
  getHostnameWithoutWww,
  getShortToken,
  usePrevious,
} from 'components/libraries/Common';

// Services
import {
  getTokenInfoFromCoingecko,
  getTokenSupplyFromBscscan,
  getTokenSupplyFromPolygonscan,
  getTokenSupplyFromEtherscan,
  searchTokenFromDexGuru,
} from 'components/services/Tokens';

// Variable
import { CONSTANT } from 'config/Constant';

// Images
import bscscan from 'images/bscscan_40x40.png';
import etherscan from 'images/etherscan_40x40.png';
import polygonscan from 'images/polygonscan_40x40.png';

// Styles
const useStyles = makeStyles((theme) => ({
  // Token Info
  tokenInfo: {
    textAlign: 'left',
    fontWeight: 600,
    lineHeight: '40px',
    paddingBottom: theme.spacing(1),
  },
  tokenInfoAvatar: {
    width: '40px',
    height: '40px',
    float: 'left',
    marginRight: '10px',
  },
  tokenInfoName: {
    fontSize: '24px',
    marginRight: '20px',
  },
  tokenInfoNetwork: {
    fontSize: '24px',
    color: '#F3BA2F',
  },
  tokenStatus: {
    float: 'right',
    fontSize: '12px',
    marginTop: '16px',
    lineHeight: 'normal',
  },
  tokenStatusDown: {
    color: '#ED524F',
  },
  tokenStatusUp: {
    color: '#63D0CF',
  },
  tokenStatusIcon: {
    float: 'left',
    marginTop: '-3px',
  },
  tokenPrice: {
    float: 'right',
    marginRight: '10px',
    fontSize: '24px',
  },

  // Token Buttons
  tokenButtons: {
    marginTop: '20px',
  },
  tokenButtonsColumn: {
    marginBottom: '18px',
  },
  tokenButtonLine: {
    marginBottom: '5px',
  },
  tokenButtonLabel: {
    marginRight: '20px',
  },
  tokenButtonLinkButton: {
    background: '#62D2CF',
    padding: '0 16px',
    borderRadius: '0.375rem',
    display: 'inline-block',
    position: 'relative',
    fontSize: '10px',
    color: '#103469 !important',
    fontWeight: 600,
    marginRight: '6px',
    transition: 'all .3s ease',
    height: '24px',
    lineHeight: '24px',

    '&:hover': {
      textDecoration: 'none',
      background: 'white',
    },

    '&>svg': {
      width: 16,
      height: 16,
      float: 'left',
      marginTop: 3,
      marginRight: 6,
    },
    '&>img': {
      width: 16,
      height: 16,
      float: 'left',
      marginTop: 4,
      marginRight: 10,
    },
  },
  tokenButtonCopy: {
    margin: theme.spacing(0.4),
    padding: theme.spacing(0.6),
  },
  tokenButtonIcon: {
    width: 16,
    height: 16,
  },

  boxButton: {
    textAlign: 'right',
    marginBottom: 5,
  },
  button: {
    width: '224px',
    height: '36px',
    borderRadius: 18,
    fontSize: 12,
    fontWeight: 600,
    color: '#103469',
    background: 'white !important',

    '&:hover': {
      backgroundColor: '#C2C2C2 !important',
    },
  },
  warningButton: {
    background: '#E26400 !important',
    color: 'white !important',

    '&:hover': {
      backgroundColor: '#FF9E51 !important',
    },
  },
  tradeButton: {
    background: '#7ED321 !important',

    '&:hover': {
      backgroundColor: '#BEFE77 !important',
    },
  },

  // Token Stats
  tokenStats: {
    background: '#111E31',
    borderRadius: 4,
    padding: '14px 20px',
    marginBottom: '18px',
    lineHeight: '26px',
  },
  tokenStatsRight: {
    textAlign: 'right',
  },
}));

export default function ChartInfo(props) {
  const classes = useStyles();

  const {
    addTokenViewHistories,
    addWatchList,
    copyToClipboard,
    enqueueSnackbar,
    findTokenInWatchList,
    match,
    pushGaViewPage,
    scrollTo,
    setNetwork,
    setTokenListActivedTab,
    token,
    updateTokenAlertHighlightInWatchListByAddress,
    updateTokenAlertOpenInWatchListByAddress,
  } = props;

  let
    cleaned = useRef(false),
    timeoutPrice = useRef(),
    timeoutInfoDexGuru = useRef(),
    timeoutInfoCoingecko = useRef(),
    timeoutTokenSupplyBscscan = useRef(),
    timeoutTokenSupplyPolygonscan = useRef(),
    timeoutTokenSupplyEtherscan = useRef();



  // currentPrice
  // currentPriceClass
  const [currentPrice, setCurrentPrice] = useState();
  const prevCurrentPriceRef = useRef();
  const prevCurrentPrice = prevCurrentPriceRef.current;
  const [currentPriceClass, setCurrentPriceClass] = useState(classes.price);

  useEffect(() => {
    if (currentPrice) {
      // Title
      if (infoDexGuru && infoDexGuru.name && infoDexGuru.symbol) {
        const
          title = `${formatTokenPrice(currentPrice)} - ${infoDexGuru.symbol} - ${infoDexGuru.name} price charts and alerts`;

        document.title = title;
      }

      prevCurrentPriceRef.current = currentPrice;

      if (prevCurrentPrice) {
        if (currentPrice > prevCurrentPrice) {
          setCurrentPriceClass(classes.price);
          if (!cleaned.current) {
            setTimeout(() => {
              setCurrentPriceClass(clsx(classes.price, 'price_green'));
            });
          }
        } else {
          setCurrentPriceClass(classes.price);
          if (!cleaned.current) {
            setTimeout(() => {
              setCurrentPriceClass(clsx(classes.price, 'price_red'));
            });
          }
        }
      }
    } else {
      updateInfoDexGuru();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice]);



  // marketCap
  // marketCapClass
  const [marketCap, setMarketCap] = useState();
  const prevMarketCapRef = useRef();
  const prevMarketCap = prevMarketCapRef.current;
  const [marketCapClass, setMarketCapClass] = useState(classes.statsPrice);

  useEffect(() => {
    if (marketCap) {
      prevMarketCapRef.current = marketCap;
      if (prevMarketCap) {
        if (marketCap > prevMarketCap) {
          setMarketCapClass(classes.statsPrice);
          if (!cleaned.current) {
            setTimeout(() => {
              setMarketCapClass(clsx(classes.statsPrice, 'price_green'));
            });
          }
        } else {
          setMarketCapClass(classes.statsPrice);
          if (!cleaned.current) {
            setTimeout(() => {
              setMarketCapClass(clsx(classes.statsPrice, 'price_red'));
            });
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketCap]);



  // infoDexGuru
  const [infoDexGuru, setInfoDexGuru] = useState();
  const [updatingInfoDexGuru, setUpdatingInfoDexGuru] = useState();

  const updateInfoDexGuru = () => {
    if (!updatingInfoDexGuru) {
      setUpdatingInfoDexGuru(true);
      searchTokenFromDexGuru(token, {
        enabledCache: false,
      }).then(result => {
        if (!cleaned.current) {
          if (result && result.value && result.value.length > 0) {
            setInfoDexGuru(result.value[0]);

            if (result.value[0] && result.value[0].priceUSD && !currentPrice) {
              setCurrentPrice(result.value[0].priceUSD);
            }

            // gaTitle
            if (result.value[0] && result.value[0].name && result.value[0].symbol) {
              const
                gaTitle = `${result.value[0].symbol} - ${result.value[0].name} price charts and alerts`;
              pushGaViewPage(gaTitle);
            }
          }
          timeoutInfoDexGuru.current = setTimeout(updateInfoDexGuru, CONSTANT.DELAY_TIME_TOKEN_DEX_GURU);
          setUpdatingInfoDexGuru(false);
        }
      });
    }
  }



  // tokenSupplyBscscan
  const [tokenSupplyBscscan, setTokenSupplyBscscan] = useState();
  const [updatingTokenSupplyBscscan, setUpdatingTokenSupplyBscscan] = useState();

  const updateTokenSupplyBscscan = () => {
    if (!updatingTokenSupplyBscscan) {
      setUpdatingTokenSupplyBscscan(true);
      getTokenSupplyFromBscscan(token).then(result => {
        if (!cleaned.current) {
          if (result && result.message === 'OK') {
            setTokenSupplyBscscan(result);
          }

          timeoutTokenSupplyBscscan.current = setTimeout(updateTokenSupplyBscscan, CONSTANT.DELAY_TIME_TOKEN_BSCSCAN_POLYGONSCAN);
          setUpdatingTokenSupplyBscscan(false);
        }
      });
    }
  }



  // tokenSupplyPolygonscan
  const [tokenSupplyPolygonscan, setTokenSupplyPolygonscan] = useState();
  const [updatingTokenSupplyPolygonscan, setUpdatingTokenSupplyPolygonscan] = useState();

  const updateTokenSupplyPolygonscan = () => {
    if (!updatingTokenSupplyPolygonscan) {
      setUpdatingTokenSupplyPolygonscan(true);
      getTokenSupplyFromPolygonscan(token).then(result => {
        if (!cleaned.current) {
          if (result && result.message === 'OK') {
            setTokenSupplyPolygonscan(result);
          }

          timeoutTokenSupplyPolygonscan.current = setTimeout(updateTokenSupplyPolygonscan, CONSTANT.DELAY_TIME_TOKEN_BSCSCAN_POLYGONSCAN);
          setUpdatingTokenSupplyPolygonscan(false);
        }
      });
    }
  }



  // tokenSupplyEtherscan
  const [tokenSupplyEtherscan, setTokenSupplyEtherscan] = useState();
  const [updatingTokenSupplyEtherscan, setUpdatingTokenSupplyEtherscan] = useState();

  const updateTokenSupplyEtherscan = () => {
    if (!updatingTokenSupplyEtherscan) {
      setUpdatingTokenSupplyEtherscan(true);
      getTokenSupplyFromEtherscan(token).then(result => {
        if (!cleaned.current) {
          if (result && result.message === 'OK') {
            setTokenSupplyEtherscan(result);
          }

          timeoutTokenSupplyEtherscan.current = setTimeout(updateTokenSupplyEtherscan, CONSTANT.DELAY_TIME_TOKEN_BSCSCAN_POLYGONSCAN);
          setUpdatingTokenSupplyEtherscan(false);
        }
      });
    }
  }



  // liquidityUSD
  const [liquidityUSD, setLiquidityUSD] = useState();

  // Coingecko handle
  const [coingeckoHanddled, setCoingeckoHanddled] = useState(false);

  // addedTokenViewHistories
  const [addedTokenViewHistories, setAddedTokenViewHistories] = useState(false);

  useEffect(() => {
    if (infoDexGuru) {
      setNetwork(infoDexGuru.network);

      const
        getLiquidityUSD = infoDexGuru.liquidityUSD ? infoDexGuru.liquidityUSD : null;

      if (getLiquidityUSD) {
        setLiquidityUSD(getLiquidityUSD);
      }

      // Check data from Coingecko
      if (!coingeckoHanddled) {
        getTokenInfoFromCoingecko(token, infoDexGuru.network).then(result => {
          if (!cleaned.current) {
            if (result) {
              setInfoCoingecko(result);
            }
          }
        });

        setCoingeckoHanddled(true);
      }

      // Add to token view histories
      if (!addedTokenViewHistories) {
        addTokenViewHistories(infoDexGuru);

        setAddedTokenViewHistories(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoDexGuru]);

  // liquidityUSDClass
  const prevLiquidityUSDRef = useRef();
  const prevLiquidityUSD = prevLiquidityUSDRef.current;
  const [liquidityUSDClass, setLiquidityUSDClass] = useState(classes.statsPrice);

  useEffect(() => {
    if (liquidityUSD) {
      prevLiquidityUSDRef.current = liquidityUSD;
      if (prevLiquidityUSD) {
        if (liquidityUSD > prevLiquidityUSD) {
          setLiquidityUSDClass(classes.statsPrice);
          if (!cleaned.current) {
            setTimeout(() => {
              setLiquidityUSDClass(clsx(classes.statsPrice, 'price_green'));
            });
          }
        } else {
          setLiquidityUSDClass(classes.statsPrice);
          if (!cleaned.current) {
            setTimeout(() => {
              setLiquidityUSDClass(clsx(classes.statsPrice, 'price_red'));
            });
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityUSD]);



  // infoCoingecko
  const [infoCoingecko, setInfoCoingecko] = useState();
  const [updatingInfoCoingecko, setUpdatingInfoCoingecko] = useState();

  const updateInfoCoingecko = () => {
    if (!updatingInfoCoingecko) {
      setUpdatingInfoCoingecko(true);
      getTokenInfoFromCoingecko(token, infoDexGuru.network).then(result => {
        if (!cleaned.current) {
          if (result) {
            setInfoCoingecko(result);
          }
          timeoutInfoCoingecko.current = setTimeout(updateInfoCoingecko, CONSTANT.DELAY_TIME_TOKEN_COINGECKO);
          setUpdatingInfoCoingecko(false);
        }
      });
    }
  }



  // totalSupply
  // image
  // websites
  // twitterScreenName
  // telegramChannelIdentifier
  // github
  const [totalSupply, setTotalSupply] = useState();
  const [image, setImage] = useState();
  const [websites, setWebsites] = useState([]);
  const [twitterScreenName, setTwitterScreenName] = useState();
  const [telegramChannelIdentifier, setTelegramChannelIdentifier] = useState();
  const [github, setGithub] = useState();

  useEffect(() => {
    if (infoCoingecko) {
      const
        marketData = infoCoingecko.market_data ? infoCoingecko.market_data : null,
        getTotalSupply = marketData && marketData.total_supply ? marketData.total_supply : null,
        getImage = infoCoingecko.image ? infoCoingecko.image : null,
        getWebsites = [],
        links = infoCoingecko.links ? infoCoingecko.links : null,
        homepages = links && links.homepage ? links.homepage : null,
        announcementUrls = links && links.announcement_url ? links.announcement_url : null,
        getTwitterScreenName = links && links.twitter_screen_name ? links.twitter_screen_name : null,
        getTelegramChannelIdentifier = links && links.telegram_channel_identifier ? links.telegram_channel_identifier : null,
        reposUrl = links && links.repos_url ? links.repos_url : null,
        getGithub = reposUrl && reposUrl.github && reposUrl.github.length > 0 ? reposUrl.github[0] : null;

      if (getTotalSupply) {
        setTotalSupply(getTotalSupply);
      }

      if (getImage) {
        if (getImage.large) {
          setImage(getImage.large);
        } else if (getImage.small) {
          setImage(getImage.small);
        } else if (getImage.thumb) {
          setImage(getImage.thumb);
        }
      }

      if (homepages) {
        homepages.forEach(homepage => {
          if (homepage) {
            getWebsites.push(homepage);
          }
        });
      }
      if (announcementUrls) {
        announcementUrls.forEach(announcementUrl => {
          if (announcementUrl) {
            getWebsites.push(announcementUrl);
          }
        });
      }
      if (getWebsites) {
        setWebsites(getWebsites);
      }

      if (getTwitterScreenName) {
        setTwitterScreenName(getTwitterScreenName);
      }

      if (getTelegramChannelIdentifier) {
        setTelegramChannelIdentifier(getTelegramChannelIdentifier);
      }

      if (getGithub) {
        setGithub(getGithub);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoCoingecko]);



  // totalSupply handdle
  const [totalSupplyHanddled, setTotalSupplyHanddled] = useState(false);

  useEffect(() => {
    if (infoDexGuru && infoCoingecko) {
      if (!totalSupplyHanddled) {
        if (!infoCoingecko.error) {
          timeoutInfoCoingecko.current = setTimeout(updateInfoCoingecko, CONSTANT.DELAY_TIME_TOKEN_COINGECKO);
        } else {
          if (infoDexGuru.network === 'bsc') {
            updateTokenSupplyBscscan();
          }
          if (infoDexGuru.network === 'polygon') {
            updateTokenSupplyPolygonscan();
          }
          if (infoDexGuru.network === 'eth') {
            updateTokenSupplyEtherscan();
          }
        }

        setTotalSupplyHanddled(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoDexGuru, infoCoingecko]);



  // totalSupply by Bscscan
  useEffect(() => {
    const
      anotherTokenSupply = tokenSupplyBscscan || tokenSupplyPolygonscan || tokenSupplyEtherscan;

    if (infoDexGuru && anotherTokenSupply) {
      if (anotherTokenSupply && anotherTokenSupply.result && infoDexGuru.decimals) {
        const
          getTotalSupply = anotherTokenSupply.result / Math.pow(10, infoDexGuru.decimals);

        if (getTotalSupply) {
          setTotalSupply(getTotalSupply);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoDexGuru, tokenSupplyBscscan, tokenSupplyPolygonscan, tokenSupplyEtherscan]);





  // marketCap
  useEffect(() => {
    if (totalSupply && currentPrice) {
      const
        getMarketCap = currentPrice * totalSupply;
      setMarketCap(getMarketCap);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSupply, currentPrice]);



  // Init
  const init = () => {
    if (token) {
      cleaned.current = false;

      // Reset data
      window.localStorage.removeItem('currentPrice');
      setCoingeckoHanddled(false);
      setTotalSupplyHanddled(false);
      setCurrentPrice(null);
      setCurrentPriceClass(classes.price);
      setMarketCap(null);
      setMarketCapClass(classes.statsPrice);
      setInfoDexGuru(null);
      setLiquidityUSD(null);
      setLiquidityUSDClass(classes.statsPrice);
      setInfoCoingecko(null);
      setTokenSupplyBscscan(null);
      setTokenSupplyPolygonscan(null);
      setTokenSupplyEtherscan(null);
      setTotalSupply(null);
      setImage(null);
      setWebsites([]);
      setTwitterScreenName(null);
      setTelegramChannelIdentifier(null);
      setGithub(null);
      setAddedTokenViewHistories(false);



      const
        getCurrentPrice = window.localStorage.getItem('currentPrice');

      if (getCurrentPrice) {
        setCurrentPrice(getCurrentPrice);
      }

      timeoutPrice.current = setInterval(() => {
        const
          getCurrentPrice = window.localStorage.getItem('currentPrice');

        if (getCurrentPrice) {
          setCurrentPrice(getCurrentPrice);
        }
      }, 500);
    }
  }



  // First init
  useEffect(() => {
    if (token) {
      init();

      return function cleanup() {
        clearTimeout(timeoutPrice.current);
        clearTimeout(timeoutInfoDexGuru.current);
        clearTimeout(timeoutInfoCoingecko.current);
        clearTimeout(timeoutTokenSupplyBscscan.current);
        clearTimeout(timeoutTokenSupplyPolygonscan.current);
        clearTimeout(timeoutTokenSupplyEtherscan.current);
        cleaned.current = true;
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // Change URL
  const prevProps = usePrevious({ match });

  useEffect(() => {
    if (prevProps && prevProps.match && prevProps.match.url) {
      if (prevProps.match.url !== match.url) {
        clearTimeout(timeoutPrice.current);
        clearTimeout(timeoutInfoDexGuru.current);
        clearTimeout(timeoutInfoCoingecko.current);
        clearTimeout(timeoutTokenSupplyBscscan.current);
        clearTimeout(timeoutTokenSupplyPolygonscan.current);
        clearTimeout(timeoutTokenSupplyEtherscan.current);

        init();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.url]);



  const addTokenToWatchlist = token => {
    if (findTokenInWatchList(token)) {
      enqueueSnackbar('This token has already existed on the watchlist.');
      activeWatchlistAndScrollTo(`watchlist-row-${token}`);
    } else {
      searchTokenFromDexGuru(token).then(result => {
        if (result && result.value && result.value.length > 0) {
          addWatchList(result.value[0]);
          enqueueSnackbar('This token has been added to the watchlist already.');
          activeWatchlistAndScrollTo(`watchlist-row-${token}`);
        } else {
          enqueueSnackbar('Can not file token');
        }
      });
    }
  }

  const addAlerts = token => {
    if (findTokenInWatchList(token)) {
      enqueueSnackbar('This token has already existed on the watchlist. Press the ADD ALERT button to get started adding alerts.');
      updateTokenAlertOpenInWatchListByAddress(token, true);
      updateTokenAlertHighlightInWatchListByAddress(token, true);
      activeWatchlistAndScrollTo(`watchlist-row-${token}`);
    } else {
      searchTokenFromDexGuru(token).then(result => {
        if (result && result.value && result.value.length > 0) {
          addWatchList(result.value[0]);
          updateTokenAlertOpenInWatchListByAddress(token, true);
          updateTokenAlertHighlightInWatchListByAddress(token, true);
          enqueueSnackbar('This token has been added to the watchlist already. Press the ADD ALERT button to get started adding alerts.');
          activeWatchlistAndScrollTo(`watchlist-row-${token}`);
        } else {
          enqueueSnackbar('Can not file token');
        }
      });
    }
  }

  const activeWatchlistAndScrollTo = id => {
    setTokenListActivedTab("watchlist");
    setTimeout(() => {
      scrollTo(id);
    });
  }



  return (
    <>
      <Grid container className={classes.tokenInfo}>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          {image &&
            <Avatar alt={infoDexGuru && infoDexGuru.name} src={image} className={classes.tokenInfoAvatar} />
          }
          <span className={classes.tokenInfoName}>
            {infoDexGuru && infoDexGuru.name}
            {` `}
            {infoDexGuru && infoDexGuru.symbol &&
              `(${infoDexGuru.symbol})`
            }
          </span>
          {infoDexGuru &&
            <>
              {infoDexGuru.network === 'bsc' &&
                <span className={clsx(classes.tokenInfoNetwork, 'color-bsc')}>BSC</span>
              }
              {infoDexGuru.network === 'polygon' &&
                <span className={clsx(classes.tokenInfoNetwork, 'color-polygon')}>POLY</span>
              }
              {infoDexGuru.network === 'eth' &&
                <span className={clsx(classes.tokenInfoNetwork, 'color-eth')}>ETH</span>
              }
            </>
          }
          <div className="living"></div>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          <span className={clsx(classes.tokenStatus, infoDexGuru && infoDexGuru.priceUSDChange24h < 0 ? classes.tokenStatusDown : classes.tokenStatusUp)}>
            {infoDexGuru && infoDexGuru.priceUSDChange24h < 0 &&
              <KeyboardArrowDownIcon className={classes.tokenStatusIcon} />
            }
            {infoDexGuru && infoDexGuru.priceUSDChange24h >= 0 &&
              <KeyboardArrowUpIcon className={clsx(classes.tokenStatusIcon, classes.tokenStatusIconUp)} />
            }

            {infoDexGuru && infoDexGuru.priceUSDChange24h === 0 && '0.00'}
            {infoDexGuru && infoDexGuru.priceUSDChange24h !== 0 &&
              round(Math.abs(infoDexGuru.priceUSDChange24h * 100), 2).toFixed(2)
            }
            %
          </span>
          <span className={clsx(classes.tokenPrice, currentPriceClass)}>{formatTokenPrice(currentPrice)}</span>
        </Grid>
      </Grid>

      <Grid container className={classes.tokenButtons}>

        <Grid item lg={6} md={12} sm={12} xs={12} className={classes.tokenButtonsColumn}>
          {websites.length > 0 &&
            <Typography variant="body2" className={classes.tokenButtonLine}>
              <span className={classes.tokenButtonLabel}>Website:</span>
              {websites.map((website, key) => (
                <React.Fragment key={key}>
                  {getHostnameWithoutWww(website) &&
                    <Link href={website} className={classes.tokenButtonLinkButton} target="_blank">{getHostnameWithoutWww(website)}</Link>
                  }
                  {` `}
                </React.Fragment>
              ))}
            </Typography>
          }

          {infoDexGuru &&
            <Typography variant="body2" className={classes.tokenButtonLine}>
              <span className={classes.tokenButtonLabel}>Explorers:</span>
              {/* <Link href="https://meo.tools" className={classes.tokenButtonLinkButton} target="_blank"><img src={bscscan} className={classes.iconLogo} alt="bscscan" /> bscscan</Link> */}
              {infoDexGuru.network === 'bsc' &&
                <Link href={`https://bscscan.com/token/${token}`} className={classes.tokenButtonLinkButton} target="_blank"><img src={bscscan} className={classes.iconLogo} alt="bscscan" /> bscscan</Link>
              }

              {infoDexGuru.network === 'polygon' &&
                <Link href={`https://polygonscan.com/token/${token}`} className={classes.tokenButtonLinkButton} target="_blank"><img src={polygonscan} className={classes.iconLogo} alt="polygonscan" /> polygonscan</Link>
              }

              {infoDexGuru.network === 'eth' &&
                <Link href={`https://etherscan.com/token/${token}`} className={classes.tokenButtonLinkButton} target="_blank"><img src={etherscan} className={classes.iconLogo} alt="etherscan" /> etherscan</Link>
              }
            </Typography>

          }

          <Typography variant="body2" className={classes.tokenButtonLine}>
            <span className={classes.tokenButtonLabel}>Contract:</span>
            <Link
              className={classes.tokenButtonLinkButton}
              onClick={() => {
                copyToClipboard(token)
                  .then(() => enqueueSnackbar('Copied to Clipboard'))
                  .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
              }}>
              {getShortToken(token)}
            </Link>

            <Tooltip title="Copy address" placement="top" arrow>
              <IconButton className={classes.tokenButtonCopy}
                onClick={() => {
                  copyToClipboard(token)
                    .then(() => enqueueSnackbar('Copied to Clipboard'))
                    .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
                }}
                size="small">
                <FileCopyIcon size={16} className={clsx(props.classes.icon, classes.tokenButtonIcon)} />
              </IconButton>
            </Tooltip>
          </Typography>

          {(twitterScreenName || telegramChannelIdentifier) &&
            <Typography variant="body2" className={classes.tokenButtonLine}>
              <span className={classes.tokenButtonLabel}>Community:</span>
              {twitterScreenName &&
                <Link href={`https://twitter.com/${twitterScreenName}`} className={classes.tokenButtonLinkButton} target="_blank"><TwitterIcon /> Twitter</Link>
              }
              {telegramChannelIdentifier &&
                <Link href={`https://t.me/${telegramChannelIdentifier}`} className={classes.tokenButtonLinkButton} target="_blank"><TelegramIcon /> Telegram</Link>
              }
            </Typography>
          }

          {github &&
            <Typography variant="body2" className={classes.line}>
              <span className={classes.tokenButtonLabel}>Source Code:</span> <Link href={github} className={classes.tokenButtonLinkButton} target="_blank"><GitHubIcon /> Github</Link>
            </Typography>
          }
        </Grid>

        <Grid item lg={6} md={12} sm={12} xs={12} className={classes.tokenButtonsColumn}>
          <Box className={classes.boxButton}>
            <Button
              variant="contained"
              startIcon={<StarIcon />}
              className={classes.button}
              onClick={() => {
                addTokenToWatchlist(token);
              }}
            >Add to Watchlist</Button>
          </Box>

          <Box className={classes.boxButton}>
            <Button
              variant="contained"
              startIcon={<NotificationsIcon />}
              className={clsx(classes.button, classes.warningButton)}
              onClick={() => {
                addAlerts(token);
              }}
            >Add alerts</Button>
          </Box>

          {/* <Box className={classes.boxButton}>
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              className={clsx(classes.button, classes.tradeButton)}
            >Trade</Button>
          </Box> */}
        </Grid>
      </Grid>

      {(totalSupply || marketCap || liquidityUSD) &&
        <Box className={classes.tokenStats}>
          <Grid container>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              {/* Daily volume: <strong>$1,201,364.27</strong><br />
              Pooled BNB: <strong>128,113.20</strong><br />
              Pooled MEO: <strong>391,226,165.78</strong><br /> */}
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} className={classes.tokenStatsRight}>
              {totalSupply &&
                <>
                  Total Supply: <strong><span className={classes.statsPrice}>{formatToken(Math.round(totalSupply), 0)}</span></strong><br />
                </>
              }
              {marketCap &&
                <>
                  Market Cap: <strong><span className={marketCapClass}>{formatPrice(marketCap)}</span></strong><br />
                </>
              }
              {liquidityUSD &&
                <>
                  Liquidity: <strong><span className={liquidityUSDClass}>{formatPrice(liquidityUSD)}</span></strong><br />
                </>
              }
            </Grid>
          </Grid>
        </Box>
      }
    </>
  );
}