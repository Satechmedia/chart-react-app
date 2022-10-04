// Packages
import { useEffect, useRef, useState } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// Library
import {
  formatPrice,
  formatToken,
  usePrevious,
} from 'components/libraries/Common';

// Services
import {
  getTokenSwaps,
} from 'components/services/Tokens';

// Variable
import { CONSTANT } from 'config/Constant';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 400,
  },
  row: {
    '& > td': {
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(0.7),
      },
    }
  },
}));

export default function ChartTradingHistory(props) {
  const classes = useStyles();

  const {
    match,
    network,
    token,
  } = props;

  const
    cleaned = useRef(false),
    timeoutSwap = useRef(),
    tokenRef = useRef(),
    networkRef = useRef();

  const [swaps, setSwaps] = useState([]);
  const [updatingSwaps, setUpdatingSwaps] = useState();

  const updateSwaps = () => {
    if (tokenRef.current && networkRef.current) {
      if (!updatingSwaps) {
        setUpdatingSwaps(true);
        getTokenSwaps(tokenRef.current, networkRef.current).then(result => {
          if (!cleaned.current) {
            if (result && result.data) {
              setSwaps(result.data);

              if (result.data.length === 0) {
                timeoutSwap.current = setTimeout(updateSwaps, 1000);
              } else {
                timeoutSwap.current = setTimeout(updateSwaps, CONSTANT.DELAY_TIME);
              }
            } else {
              timeoutSwap.current = setTimeout(updateSwaps, CONSTANT.DELAY_TIME);
            }

            setUpdatingSwaps(false);
          }
        });
      }
    }
  }

  useEffect(() => {
    if (token && network) {
      tokenRef.current = token;
      networkRef.current = network;
      updateSwaps();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, network]);

  // First init
  useEffect(() => {
    if (token) {
      cleaned.current = false;
      setSwaps([]);

      return function cleanup() {
        clearTimeout(timeoutSwap.current);
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
        clearTimeout(timeoutSwap.current);

        cleaned.current = false;
        setSwaps([]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.url]);

  const getClassName = swap => {
    if (token === swap.token0Address) {
      if (swap && swap.amount0Out > 0) {
        // return props.classes.colorGreen;
        return 'color-green';
      } else {
        // return props.classes.colorRed;
        return 'color-red';
      }
    } else {
      if (swap && swap.amount1Out > 0) {
        // return props.classes.colorGreen;
        return 'color-green';
      } else {
        // return props.classes.colorRed;
        return 'color-red';
      }
    }
  }

  const getType = swap => {
    if (token === swap.token0Address) {
      if (swap && swap.amount0Out > 0) {
        return 'Buy';
      } else {
        return 'Sell';
      }
    } else {
      if (swap && swap.amount1Out > 0) {
        return 'Buy';
      } else {
        return 'Sell';
      }
    }
  }

  const getTokenAmount = swap => {
    if (token === swap.token0Address) {
      if (swap && swap.amount0Out > 0) {
        return formatToken(swap.amount0Out);
      } else {
        return formatToken(swap.amount0In);
      }
    } else {
      if (swap && swap.amount1Out > 0) {
        return formatToken(swap.amount1Out);
      } else {
        return formatToken(swap.amount1In);
      }
    }
  }

  return (
    <>
      <Typography variant="h6" className={props.classes.marginBottom}>
        Trading History
        <div className="living"></div>
      </Typography>

      <TableContainer className={classes.root} component={Paper} square>
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Tokens</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="center">Tx</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {updatingSwaps && swaps && swaps.length === 0 &&
              <TableRow>
                <TableCell align="center" colSpan="5">
                  <Box className={props.classes.loading}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            }

            {!updatingSwaps && swaps && swaps.length === 0 &&
              <TableRow>
                <TableCell align="center" colSpan="5">
                  No results found
                </TableCell>
              </TableRow>
            }

            {swaps && swaps.length !== 0 &&
              swaps.map((swap, key) => (
                <TableRow className={classes.row} key={key}>
                  <TableCell component="td" scope="row" align="center" className={getClassName(swap)}>
                    {getType(swap)}
                  </TableCell>
                  <TableCell component="td" scope="row" align="right" className={getClassName(swap)}>
                    {getTokenAmount(swap)}
                  </TableCell>
                  <TableCell component="td" scope="row" align="right" className={getClassName(swap)}>
                    {swap && swap.amountUSD && formatPrice(swap.amountUSD)}
                  </TableCell>
                  <TableCell component="td" scope="row" align="right" className={getClassName(swap)}>
                    {swap && swap.timestamp &&
                      new Intl.DateTimeFormat('default', {
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZoneName: 'short',
                      }).format(new Date(swap.timestamp * 1000))
                    }
                  </TableCell>
                  <TableCell component="td" scope="row" align="center" className={getClassName(swap)}>
                    {swap && swap.transactionAddress && network === 'bsc' &&
                      <Link href={`https://bscscan.com/tx/${swap.transactionAddress}`} target="_blank">{swap.transactionAddress.substr(0, 6)}</Link>
                    }
                    {swap && swap.transactionAddress && network === 'polygon' &&
                      <Link href={`https://polygonscan.com/tx/${swap.transactionAddress}`} target="_blank">{swap.transactionAddress.substr(0, 6)}</Link>
                    }
                    {swap && swap.transactionAddress && network === 'eth' &&
                      <Link href={`https://etherscan.com/tx/${swap.transactionAddress}`} target="_blank">{swap.transactionAddress.substr(0, 6)}</Link>
                    }
                  </TableCell>
                </TableRow>
              ))
            }

          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}