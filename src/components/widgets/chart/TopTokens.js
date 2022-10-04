// Packages
import { Link } from "react-router-dom";
import { round } from "lodash";
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

// Widgets
import PriceChange from 'components/widgets/price/PriceChange';

// Services
import {
  getTopTokens,
} from 'components/services/Tokens';

// Library
import {
  getShortToken,
} from 'components/libraries/Common';

// Variable
import { CONSTANT } from 'config/Constant';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  network: {
    textTransform: 'uppercase',
  },
  avatar: {
    width: 24,
    height: 24,
    float: 'left',
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.8),
  },
  priceColumn: {
    paddingRight: 0,
  },
  iconColumn: {
    paddingLeft: theme.spacing(1),
    whiteSpace: 'nowrap',
    fontSize: 12,
    '& > svg': {
      marginTop: 2,
      width: 12,
      height: 12,
      float: 'left',
      marginRight: 2,
    },
  },
  symbol: {
    color: '#808a9d',
    fontSize: 13,
  },
}));

export default function TopTokens(props) {
  const classes = useStyles();

  const {
    languages,
  } = props;

  const
    cleaned = useRef(false),
    timeoutTopTokens = useRef();

  const [topTokens, setTopTokens] = useState([]);
  const [updatingTopTokens, setUpdatingTopTokens] = useState();

  const updateTopTokens = () => {
    if (!updatingTopTokens) {
      setUpdatingTopTokens(true);
      getTopTokens().then(result => {
        if (!cleaned.current) {
          if (result && result.data) {
            setTopTokens(result.data);
          }

          timeoutTopTokens.current = setTimeout(updateTopTokens, CONSTANT.DELAY_TIME);

          setUpdatingTopTokens(false);
        }
      });
    }
  }

  // First init
  useEffect(() => {
    cleaned.current = false;
    updateTopTokens();

    return function cleanup() {
      clearTimeout(timeoutTopTokens.current);
      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNetworkClass = network => {
    if (network === 'bsc') {
      return clsx(classes.network, props.classes.colorOrange);
    } else if (network === 'polygon') {
      return clsx(classes.network, props.classes.colorPurple);
    } else {
      return classes.network;
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={props.classes.marginBottom}>
        {languages.TopTokensBy24hVolume}
        <div className="living"></div>
      </Typography>

      <TableContainer component={Paper} square>
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{languages.Token}</TableCell>
              <TableCell align="center">{languages.Network}</TableCell>
              <TableCell align="right">{languages.Volume24h}</TableCell>
              <TableCell align="right">{languages.Liquidity}</TableCell>
              <TableCell align="right" className={classes.priceColumn}>{languages.Price}</TableCell>
              <TableCell className={classes.iconColumn}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {updatingTopTokens && topTokens && topTokens.length === 0 &&
              <TableRow>
                <TableCell align="center" colSpan="5">
                  <Box className={props.classes.loading}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            }

            {!updatingTopTokens && topTokens && topTokens.length === 0 &&
              <TableRow>
                <TableCell align="center" colSpan="5">
                  No results found
                </TableCell>
              </TableRow>
            }

            {topTokens && topTokens.length !== 0 &&
              topTokens.map((topToken, key) => (
                <TableRow className={classes.row} key={key}>
                  <TableCell component="td" scope="row">
                    {topToken.logoURI &&
                      <Link to={`/token/${topToken.address}`}>
                        <Avatar alt={topToken.name} src={topToken.logoURI} className={classes.avatar} />
                      </Link>
                    }

                    <Link to={`/token/${topToken.address}`} className={props.classes.meoLinkV1}>
                      {topToken.name}
                    </Link>
                    <br />
                    <span className={classes.symbol}>
                      {getShortToken(topToken.address)}
                    </span>
                  </TableCell>
                  <TableCell component="td" scope="row" align="center" className={getNetworkClass(topToken.network)}>
                    {topToken.network}
                  </TableCell>
                  <TableCell component="td" scope="row" align="right">
                    {topToken.volume24hUSD &&
                      <PriceChange
                        {...props}
                        price={Math.round(topToken.volume24hUSD)}
                        minimumFractionDigits={0}
                      />
                    }
                  </TableCell>
                  <TableCell component="td" scope="row" align="right">
                    {topToken.liquidityUSD &&
                      <PriceChange
                        {...props}
                        price={Math.round(topToken.liquidityUSD)}
                        minimumFractionDigits={0}
                      />
                    }
                  </TableCell>
                  <TableCell component="td" scope="row" align="right" className={classes.priceColumn}>
                    {topToken.priceUSD &&
                      <PriceChange
                        {...props}
                        price={topToken.priceUSD}
                      />
                    }
                  </TableCell>
                  <TableCell component="td" scope="row" className={topToken.priceUSDChange24h < 0 ? clsx('color-red', classes.iconColumn) : clsx('color-green', classes.iconColumn)}>
                    {topToken.priceUSDChange24h < 0 &&
                      <VerticalAlignBottomIcon />
                    }
                    {topToken.priceUSDChange24h >= 0 &&
                      <VerticalAlignTopIcon />
                    }

                    {topToken.priceUSDChange24h === 0 && '0.00'}
                    {topToken.priceUSDChange24h !== 0 &&
                      round(Math.abs(topToken.priceUSDChange24h * 100), 2).toFixed(2)
                    }
                    %
                  </TableCell>
                </TableRow>
              ))
            }

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}