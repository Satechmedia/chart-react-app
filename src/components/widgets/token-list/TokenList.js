// Material UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Widgets
import TokenViewHistories from 'components/widgets/token-list/TokenViewHistories';
import Wallet from 'components/widgets/token-list/Wallet';
import Watchlist from 'components/widgets/token-list/Watchlist';

// Styles
const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(0.1),
  },
}));

export default function TokenList(props) {
  const classes = useStyles();

  const {
    className,
    isViewTokenPage,
    languages,
    token,
    tokenListActivedTab,
    tokenListHandleChange,
  } = props;

  return (
    <div className={className}>
      <AppBar position="static" color="default">
        <Tabs
          value={tokenListActivedTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={tokenListHandleChange}
        >
          <Tab label={languages.Watchlist} value="watchlist" />
          <Tab label={languages.Wallet} value="wallet" />
          <Tab label={languages.History} value="history" />
        </Tabs>
      </AppBar>

      <Paper square className={classes.content}>
        <Box padding={2}>

          {tokenListActivedTab === "watchlist" &&
            <Watchlist
              {...props}
              isViewTokenPage={isViewTokenPage}
              token={token}
            />
          }

          {tokenListActivedTab === "wallet" &&
            <Wallet
              {...props}
              isViewTokenPage={isViewTokenPage}
              token={token}
            />
          }

          {tokenListActivedTab === "history" &&
            <TokenViewHistories
              {...props}
            />
          }

        </Box>
      </Paper>
    </div>
  );
}