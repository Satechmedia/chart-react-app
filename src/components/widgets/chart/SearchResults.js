// Material UI
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Library
import {
  capitalizeFirstLetter,
  getShortToken,
} from 'components/libraries/Common';

// Styles
const useStyles = makeStyles((theme) => ({
  info: {
    margin: theme.spacing(1, 0),
  },
  root: {
    marginTop: theme.spacing(1),
    maxHeight: 300,
  },
  click: {
    cursor: 'pointer',
  },
}));

export default function SearchResults(props) {
  const classes = useStyles();

  const {
    addWatchList,
    findTokenInWatchList,
    goToChart,
    result,
    search,
  } = props;

  const searchWithoutCache = (e) => {
    e.preventDefault();

    search(false);
  }

  return (
    <>
      {result.cache &&
        <Alert severity="info" square className={classes.info}>
          <Typography variant="body2">
            This is the results from the cache. Please
            {' '}
            <Link href="/" onClick={searchWithoutCache}>click here</Link>
            {' '}
            to get the latest data
          </Typography>
        </Alert>
      }

      <TableContainer className={classes.root} component={Paper} square>
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Address</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(result.value.msg || result.value.length === 0) &&
              <TableRow>
                <TableCell align="center" colSpan="4">
                  {(result.value.msg && capitalizeFirstLetter(result.value.msg)) || `No results found`}
                </TableCell>
              </TableRow>
            }
            {!result.value.msg && result.value.length !== 0 &&
              result.value.map((row, key) => (
                <TableRow
                  key={key}
                  hover>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.click}
                    onClick={() => {
                      goToChart(row.address);
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    className={classes.click}
                    onClick={() => {
                      goToChart(row.address);
                    }}
                  >{row.symbol}</TableCell>
                  <TableCell
                    className={classes.click}
                    onClick={() => {
                      goToChart(row.address);
                    }}
                  >
                    {getShortToken(row.address)}
                  </TableCell>
                  <TableCell>
                    {!findTokenInWatchList(row.address) &&
                      <Tooltip title="Add this token to My Watchlist - Portfolio" placement="top" arrow>
                        <IconButton
                          onClick={() => {
                            addWatchList(row);
                          }} size="small">
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    }

                    {findTokenInWatchList(row.address) &&
                      <Tooltip title="This token has added to My Watchlist - Portfolio" placement="top" arrow>
                        <IconButton
                          size="small">
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
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
