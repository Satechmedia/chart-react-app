// Packages
import { useEffect, useState } from 'react';
// import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
// import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';

// Widgets
import ChartSection from 'components/widgets/chart/ChartSection';
import Configuration from 'components/widgets/configuration/Configuration';
// import PrivateSale from 'components/widgets/sales/PrivateSale';
import TestArea from 'components/widgets/others/TestArea';
import TokenList from 'components/widgets/token-list/TokenList';
import Welcome from 'components/widgets/others/Welcome';

// Services
import {
  searchTokenFromDexGuru,
} from 'components/services/Tokens';

// Library
import {
  usePrevious,
} from 'components/libraries/Common';

// Variable
import { CONSTANT } from 'config/Constant';

// Images
// import bannerDesktop from 'images/banner_desktop.png';
// import bannerTablet from 'images/banner_tablet.png';
// import bannerMobile from 'images/banner_mobile.png';

// Styles
const useStyles = makeStyles((theme) => ({
  banner: {
    textAlign: 'center',
  },
  leftCol: {
    overflow: 'auto',
  },
}));

export default function Home(props) {
  const classes = useStyles();

  const {
    addWatchList,
    category,
    enqueueSnackbar,
    findTokenInWatchList,
    history,
    match,
    removeDynamicTitleAndSetNew,
    updateTokenAlertHighlightInWatchListByAddress,
    updateTokenAlertOpenInWatchListByAddress,
  } = props;

  const { match: { params } } = props;

  const isViewTokenPage = () => {
    return params && params.token && category === "token";
  }

  const isAddTokenPage = () => {
    return params && params.token && category === "add";
  }

  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isViewTokenPage()) {
      removeDynamicTitleAndSetNew(CONSTANT.DEFAULT_TITLE);
    }

    if (isAddTokenPage()) {
      const
        address = params.token;

      if (findTokenInWatchList(address)) {
        enqueueSnackbar('This token has already existed on the watch list. Press the ADD ALERT button to get started adding alerts.');
        updateTokenAlertOpenInWatchListByAddress(address, true);
        updateTokenAlertHighlightInWatchListByAddress(address, true);

        history.push(`/token/${address}`);
      } else {
        if (!searching) {
          setSearching(true);
          searchTokenFromDexGuru(address).then(result => {
            if (result && result.value && result.value.length > 0) {
              addWatchList(result.value[0]);
              updateTokenAlertOpenInWatchListByAddress(address, true);
              updateTokenAlertHighlightInWatchListByAddress(address, true);
              history.push(`/token/${address}`);
            } else {
              enqueueSnackbar('Can not file token');
            }
            setSearching(false);
          });
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // Change URL
  const prevProps = usePrevious({ match });

  useEffect(() => {
    if (prevProps && prevProps.match && prevProps.match.url) {
      if (prevProps.match.url !== match.url) {
        if (!isViewTokenPage()) {
          removeDynamicTitleAndSetNew(CONSTANT.DEFAULT_TITLE);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.url]);



  return (
    <Container maxWidth={false}>

      {/* <Hidden smDown>
        <Box className={clsx(classes.banner, props.classes.marginBottom)}>
          <img src={bannerDesktop} className={props.classes.image100MaxWidth} alt="The first token chart platform on Ethereum, Binance Smart Chain and Polygon with ALERTS feature" />
        </Box>
      </Hidden>

      <Hidden only={['xs', 'md', 'lg', 'xl']}>
        <Box className={clsx(classes.banner, props.classes.marginBottom)}>
          <img src={bannerTablet} className={props.classes.image100MaxWidth} alt="The first token chart platform on Ethereum, Binance Smart Chain and Polygon with ALERTS feature" />
        </Box>
      </Hidden>

      <Hidden smUp>
        <Box className={clsx(classes.banner, props.classes.marginBottom)}>
          <img src={bannerMobile} className={props.classes.image100MaxWidth} alt="The first token chart platform on Ethereum, Binance Smart Chain and Polygon with ALERTS feature" />
        </Box>
      </Hidden> */}

      <Grid container spacing={3}>

        <Grid item md={6} sm={12} xs={12} className={classes.leftCol}>

          {/* <PrivateSale
            {...props}
            className={props.classes.marginBottom}
          /> */}

          <ChartSection
            {...props}
            isViewTokenPage={isViewTokenPage}
            token={params.token}
          />

        </Grid>

        <Grid item md={6} sm={12} xs={12}>

          <TokenList
            {...props}
            className={props.classes.marginBottom}
            isViewTokenPage={isViewTokenPage}
            token={params.token}
          />

          <Configuration {...props} className={props.classes.marginBottom} />

          <Welcome {...props} className={props.classes.marginBottom} />

          <TestArea {...props} className={props.classes.marginBottom} />

        </Grid>

      </Grid>

      <Backdrop className={props.classes.backdrop} open={searching}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </Container>
  );
}