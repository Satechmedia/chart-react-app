// Packages
import { useState } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Widgets
import ChartTradingHistory from 'components/widgets/chart/ChartTradingHistory';
import ChartWidget from 'components/widgets/chart/ChartWidget';
import SearchToken from 'components/widgets/chart/SearchToken';
import TopTokens from 'components/widgets/chart/TopTokens';

export default function ChartSection(props) {
  const {
    className,
    isViewTokenPage,
    languages,
    token,
  } = props;

  const [network, setNetwork] = useState();

  return (
    <Paper square className={className} id="chart-section">
      <Box padding="20px">
        <Typography variant="h5" className={props.classes.marginBottom}>
          {languages.PriceChartEthereumBSCPolygon}
        </Typography>

        <SearchToken
          {...props}
        />

        {!isViewTokenPage() &&
          <TopTokens
            {...props}
          />
        }

        {isViewTokenPage() &&
          <>
            <ChartWidget
              {...props}
              className={props.classes.marginBottom}
              network={network}
              setNetwork={setNetwork}
              token={token}
            />

            <ChartTradingHistory
              {...props}
              token={token}
              network={network}
            />
          </>
        }
      </Box>
    </Paper >
  );
}