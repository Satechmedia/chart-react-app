// Packages
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Services
import {
  getTokenPriceFromDexGuru,
} from 'components/services/Tokens';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'block' : 'none',
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default function TestArea(props) {
  const classes = useStyles();

  const {
    className,
    emptyTikiAlert,
    testPush,
    toggleDekoAlert,
  } = props;

  const getTestAPI = async (url) => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const
        value = await res.json();

      console.log(value);
    }
    catch (error) {
      console.error(error);
    }
  }

  const searchTokenFromCoingecko = async () => {
    const
      url = 'https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0x580de58c1bd593a43dadcf0a739d504621817c05';

    getTestAPI(url);
  }

  const getBabyDogePriceFromDexGuru = async () => {
    const
      token = '0xc748673057861a797275cd8a068abb95a902e8de';

    getTokenPriceFromDexGuru(token, 'bsc').then(result => {
      console.log(result);
    });
  }

  return (
    <Paper square className={clsx(className, classes.root)}>
      <Box padding={2}>
        <Typography variant="h5" className={props.classes.marginBottom}>
          Test area
        </Typography>

        <Typography variant="body2" className={props.classes.marginBottom}>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </Typography>

        <Button variant="contained" onClick={emptyTikiAlert} className={classes.button} size="small">Empty Tiki Alerts</Button>
        <Button variant="contained" onClick={toggleDekoAlert} className={classes.button} size="small">Toggle Deko Alert</Button>
        <Button variant="contained" onClick={testPush} className={classes.button} size="small">Test Push</Button>
        <Button variant="contained" onClick={searchTokenFromCoingecko} className={classes.button} size="small">Search token from Coingecko</Button>
        <Button variant="contained" onClick={getBabyDogePriceFromDexGuru} className={classes.button} size="small">Get BabyDoge price from Dex.guru</Button>
      </Box>
    </Paper>
  );
}