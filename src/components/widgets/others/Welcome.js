// Packages
import clsx from 'clsx';

// Material UI
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// Variable
import { MESSAGE } from 'config/Constant';

// Styles
const useStyles = makeStyles((theme) => ({
  h1: {
    fontSize: 20,
  },
  h2: {
    fontSize: 18,
  },
  ul: {
    padding: 0,
  },
  ulChild: {
    paddingLeft: theme.spacing(2),
  },
  quotation: {
    width: 20,
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(0.6),
  },
}));

export default function Welcome(props) {
  const classes = useStyles();

  const {
    className,
    languages,
  } = props;

  return (
    <Alert severity="info" square className={className}>
      <AlertTitle className={props.classes.marginBottom}>{languages.WelcomeTo} <strong>meo.tools</strong></AlertTitle>

      <Typography variant="h1" className={clsx(classes.h1, props.classes.marginBottom)}>
        {languages.TheUltimateCombinationBetweenLong}
      </Typography>

      <Typography variant="h2" className={clsx(classes.h2, props.classes.marginBottom)}>
        {languages.Features}:
      </Typography>

      <Typography variant="body2" component="div" className={props.classes.marginBottom}>
        <ul className={classes.ul}>
          <li>{languages.TrackYourTokenWatchlistPortfolioInRealTime}</li>
          <li>
            <span>{languages.NeverMissAnOpportunityWithTokenAlerting}</span>
            <ul className={classes.ulChild}>
              <li>{MESSAGE.MAXIMUM_TOKEN_IN_A_WATCHLIST}</li>
              <li>{MESSAGE.MAXIMUM_ALERT_OF_A_TOKEN}</li>
              <li>{MESSAGE.MAXIMUM_ALERT_OF_ALL_TOKEN}</li>
            </ul>
          </li>
        </ul>
      </Typography>

      <Typography variant="body2" component="div">
        <FormatQuoteIcon className={classes.quotation} />
        {languages.AKindlyNoticeThatTheCurrentVersionLong} <Link href="https://t.me/meo_tools/49" target="_balnk">https://t.me/meo_tools/49</Link>
      </Typography>
    </Alert>
  );
}