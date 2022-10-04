// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

// Library
import {
  formatPrice,
} from 'components/libraries/Common';

// Widgets
// import AddTokenSection from 'components/widgets/token-list/AddTokenSection';
import TokenRow from 'components/widgets/token-row/TokenRow';

// Styles
const useStyles = makeStyles((theme) => ({
  info: {
    fontSize: 16,
    marginLeft: theme.spacing(0.5),
  },
  bottom: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default function Watchlist(props) {
  const classes = useStyles();

  const {
    getTotalBalance,
    languages,
    watchlist,
  } = props;

  return (
    <>

      <Typography variant="h5" className={props.classes.marginBottom}>
        {languages.MyWatchlistPortfolio}
        {Object.keys(watchlist).length !== 0 &&
          <div className="living"></div>
        }
      </Typography>

      {/* <Box component="div" display="block" className={props.classes.marginBottom}>
          <AddTokenSection
            {...props}
          />
        </Box> */}

      <TableContainer component={Paper} square>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>{languages.Alert}</TableCell>
              <TableCell>{languages.Token}</TableCell>
              <TableCell align="right">{languages.Price}</TableCell>
              <TableCell align="right">
                {languages.Balance}
                <Tooltip title="You can add your token balance to track your porfolio" placement="top" arrow>
                  <InfoIcon className={classes.info} />
                </Tooltip>
              </TableCell>
              <TableCell align="center">{languages.Address}</TableCell>
              <TableCell align="center">{languages.Control}</TableCell>
            </TableRow>
          </TableHead>

          {Object.keys(watchlist).length !== 0 &&
            <>
              <TableBody>
                {Object.keys(watchlist).map(key => (
                  <TokenRow
                    key={key}
                    row={watchlist[key]}
                    {...props}
                  />
                ))}
              </TableBody>

              {getTotalBalance() !== 0 &&
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="right" className={classes.bottom}>
                      <strong>{languages.TotalBalance}</strong>
                    </TableCell>
                    <TableCell align="right" className={classes.bottom}>{formatPrice(getTotalBalance(), 3)}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              }
            </>
          }

          {Object.keys(watchlist).length === 0 &&
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className={props.classes.empty}>
                  <Typography variant="h6" className={props.classes.marginBottom}>
                    Your Watchlist - Portfolio is empty
                  </Typography>
                  <Typography variant="body2">
                    Please search and add a token to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          }

        </Table>
      </TableContainer>

    </>
  );
}