// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

export default function TokenViewHistories(props) {
  const classes = useStyles();

  const {
    goToChart,
    removeTokenViewHistoriesByAddress,
    setTokenViewHistories,
    tokenViewHistories,
  } = props;

  const handleDelete = address => {
    removeTokenViewHistoriesByAddress(address);
  };

  const handleClick = address => {
    goToChart(address);
  };

  return (
    <Box className={classes.root}>
      {tokenViewHistories.length === 0 &&
        <Box className={props.classes.empty}>
          Empty history
        </Box>
      }

      {tokenViewHistories.length !== 0 &&
        <>
          <Typography variant="body2" align="center">
            <Link href="/" onClick={(e) => {
              e.preventDefault();

              setTokenViewHistories([]);
            }}>Clear history</Link>
          </Typography>

          <Divider className={classes.divider} />

          {
            tokenViewHistories.map((value, key) => (
              <Chip
                key={key}
                label={`${value.name} (${value.symbol})`}
                onClick={() => {
                  handleClick(value.address);
                }}
                onDelete={() => {
                  handleDelete(value.address);
                }}
              />
            ))
          }
        </>
      }
    </Box>
  );
}