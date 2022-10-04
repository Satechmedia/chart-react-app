// Packages
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    padding: '10px 20px 18px',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    position: 'relative',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  close: {
    position: 'absolute',
    top: 4,
    right: 6,
  },
}));

export default function SearchHistories(props) {
  const classes = useStyles();

  const {
    removeSearchHistoriesByAddress,
    searchByAddress,
    searchHistories,
    setSearchHistories,
    setShowHistories,
  } = props;

  const handleDelete = value => {
    removeSearchHistoriesByAddress(value);
  };

  const handleClick = value => {
    searchByAddress(value);
  };

  const {
    className,
  } = props;

  return (
    <Paper square className={clsx(className, classes.root)}>
      <IconButton
        size="small"
        className={classes.close}
        onClick={() => {
          setShowHistories(false);
        }}
      >
        <ClearIcon className={props.classes.icon} />
      </IconButton>

      <Typography variant="body2" align="center">
        <Link href="/" onClick={(e) => {
          e.preventDefault();

          setSearchHistories([]);
        }}>Clear search history</Link>
      </Typography>

      <Divider className={classes.divider} />

      {
        searchHistories.map((value, key) => (
          <Chip
            key={key}
            label={value}
            onClick={() => {
              handleClick(value);
            }}
            onDelete={() => {
              handleDelete(value);
            }}
          />
        ))
      }
    </Paper >
  );
}
