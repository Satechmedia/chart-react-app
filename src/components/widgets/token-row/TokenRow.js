// Packages
import { Link } from "react-router-dom";
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Collapse from '@material-ui/core/Collapse';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

// Images
import bscscan from 'images/bscscan_40x40.png';
import etherscan from 'images/etherscan_40x40.png';
import polygonscan from 'images/polygonscan_40x40.png';

// Services
import {
  getTokenPriceFromDexGuru,
} from 'components/services/Tokens';

// Variable
import { CONSTANT } from 'config/Constant';

// Library
import {
  formatPrice,
  formatToken,
  formatTokenPrice,
  getShortToken,
  usePrevious,
  useStateAdvance,
} from 'components/libraries/Common';

// Widgets
import TokenRowAddBalanceButton from 'components/widgets/token-row/TokenRowAddBalanceButton';
import TokenRowDeleteButton from 'components/widgets/token-row/TokenRowDeleteButton';
import TokenRowAlerts from 'components/widgets/token-row-alerts/TokenRowAlerts';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  margin: {
    margin: theme.spacing(0.4),
    padding: theme.spacing(0.6),
  },
  symbol: {
    color: '#808a9d',
    fontSize: 13,
  },
  iconLogo: {
    width: theme.spacing(3),
  },
  highlight: {
    // backgroundColor: "rgb(255, 244, 229)",
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
}));

export default function TokenRow(props) {
  const classes = useStyles();

  const [update, setUpdate] = useStateAdvance('update', false);
  const [updating, setUpdating] = useStateAdvance('updating');
  const [priceClass, setPriceClass] = useStateAdvance('priceClass', '');

  const {
    addAlertToAddress,
    copyToClipboard,
    countTotalAlert,
    deleteAlertOfAddress,
    deleteTokenInWatchListByAddress,
    editAlertOfAddress,
    enqueueSnackbar,
    getAlertsByAddress,
    history,
    isViewTokenPage,
    languages,
    row,
    scrollTo,
    toggleAlertOfAddress,
    token,
    updateTokenAlertHighlightInWatchListByAddress,
    updateTokenAlertOpenInWatchListByAddress,
    updateTokenBalanceInWatchListByAddress,
    updateTokenPriceInWatchListByAddress,
  } = props;

  const [open, setOpen] = useStateAdvance('open', row.alertOpen);

  const
    alerts = getAlertsByAddress(row.address);

  const prevProps = usePrevious({ row });

  let
    cleaned = useRef(false),
    timeout = useRef();

  const updatePrice = () => {
    if (!updating) {
      setUpdating(true);
      getTokenPriceFromDexGuru(row.address, row.network).then(result => {
        if (!cleaned.current) {
          if (result && result.priceUSD) {
            updateTokenPriceInWatchListByAddress(row.address, result.priceUSD);
          }
          timeout.current = setTimeout(updatePrice, CONSTANT.DELAY_TIME);
          setUpdating(false);
        }
      });
    }
  }

  const toggleAlertOpen = () => {
    const
      value = !open;

    setOpen(value);
    updateTokenAlertOpenInWatchListByAddress(row.address, value);
    if (!value) {
      updateTokenAlertHighlightInWatchListByAddress(row.address, value);
    }
  }

  useEffect(() => {
    cleaned.current = false;
    updatePrice();

    return function cleanup() {
      clearTimeout(timeout.current);
      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateColor = () => {
    if (prevProps && prevProps.row) {
      if (row.priceUSD > prevProps.row.priceUSD) {
        setPriceClass('');
        if (!cleaned.current) {
          setTimeout(() => {
            setPriceClass('price_green');
          });
        }
      } else {
        setPriceClass('');
        if (!cleaned.current) {
          setTimeout(() => {
            setPriceClass('price_red');
          });
        }
      }
    }
  }

  useEffect(() => {
    updateColor();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.priceUSD]);

  useEffect(() => {
    // Re-render
    setUpdate(!update);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.alerts]);

  // chartClassName
  let
    chartClassName = classes.margin;

  if (isViewTokenPage() && token === row.address) {
    chartClassName = clsx(classes.margin, 'chartLiving');
  }

  return (
    <>
      <TableRow className={classes.root} id={`watchlist-row-${row.address}`}>
        <TableCell>
          {alerts.length !== 0 &&
            <Badge color="primary" variant="dot">
              <IconButton aria-label="expand row" size="small" onClick={toggleAlertOpen}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Badge>
          }

          {alerts.length === 0 &&
            <IconButton aria-label="expand row" size="small" onClick={toggleAlertOpen}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
        <TableCell>
          <Link to={`/token/${row.address}`} className={props.classes.meoLinkV1}>
            {row.name || row.description}
          </Link>
          <br />
          <span className={classes.symbol}>
            {getShortToken(row.address)}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className={classes.symbol}>{row.symbol}</span><br />
          <span className={priceClass}>
            {formatTokenPrice(row.priceUSD)}
          </span>
        </TableCell>
        <TableCell align="right">
          <span className={classes.symbol}>
            {row.balance && formatToken(row.balance, 4)}
            {!row.balance && 0}
          </span><br />

          {!row.balance && <span className={classes.symbol}>{languages.YourBalanceHere}</span>}

          {row.balance &&
            <span className={priceClass}>
              {formatPrice(row.balance * row.priceUSD)}
            </span>
          }
        </TableCell>
        <TableCell align="center" className={classes.nowrap}>

          <Tooltip title="Copy address" placement="top" arrow>
            <IconButton className={classes.margin}
              onClick={() => {
                copyToClipboard(row.address)
                  .then(() => enqueueSnackbar('Copied to Clipboard'))
                  .catch(() => enqueueSnackbar('Error when copy to Clipboard'));
              }} size="small">
              <FileCopyIcon className={props.classes.icon} />
            </IconButton>
          </Tooltip>

          {row.network === 'bsc' &&
            <Tooltip title="Go to bscscan" placement="top" arrow>
              <IconButton className={classes.margin} target="_blank" href={`https://bscscan.com/token/${row.address}`} size="small">
                <img src={bscscan} className={classes.iconLogo} alt="bscscan" />
              </IconButton>
            </Tooltip>
          }

          {row.network === 'polygon' &&
            <Tooltip title="Go to polygonscan" placement="top" arrow>
              <IconButton className={classes.margin} target="_blank" href={`https://polygonscan.com/token/${row.address}`} size="small">
                <img src={polygonscan} className={classes.iconLogo} alt="polygonscan" />
              </IconButton>
            </Tooltip>
          }

          {row.network === 'eth' &&
            <Tooltip title="Go to etherscan" placement="top" arrow>
              <IconButton className={classes.margin} target="_blank" href={`https://etherscan.com/token/${row.address}`} size="small">
                <img src={etherscan} className={classes.iconLogo} alt="etherscan" />
              </IconButton>
            </Tooltip>
          }

          <Tooltip title="View chart" placement="top" arrow>
            <IconButton className={chartClassName}
              href={`/token/${row.address}`}
              onClick={(e) => {
                e.preventDefault();
                history.push(`/token/${row.address}`);
                scrollTo('chart-section');
              }} size="small">
              <InsertChartIcon className={props.classes.icon} />
            </IconButton>
          </Tooltip>

        </TableCell>
        <TableCell align="center" className={classes.nowrap}>
          <TokenRowAddBalanceButton
            {...props}
            row={row}
            updateTokenBalanceInWatchListByAddress={updateTokenBalanceInWatchListByAddress}
          />
          <TokenRowDeleteButton
            {...props}
            row={row}
            deleteTokenInWatchListByAddress={deleteTokenInWatchListByAddress}
          />
        </TableCell>
      </TableRow >
      <TableRow className={row.alertHighlight ? classes.highlight : null}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TokenRowAlerts
              {...props}
              row={row}
              getAlertsByAddress={getAlertsByAddress}
              addAlertToAddress={addAlertToAddress}
              editAlertOfAddress={editAlertOfAddress}
              deleteAlertOfAddress={deleteAlertOfAddress}
              toggleAlertOfAddress={toggleAlertOfAddress}
              countTotalAlert={countTotalAlert}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}