// Packages
import { useState, useRef, useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClearIcon from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';

// Widgets
import SearchHistories from 'components/widgets/chart/SearchHistories';
import SearchResults from 'components/widgets/chart/SearchResults';

// Services
import {
  searchTokenFromDexGuru,
} from 'components/services/Tokens';

// Library
import {
  useLocalStorage,
} from 'components/libraries/Common';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    background: '#212A3A',
    border: 'solid #3E4553 1px',
    // background: '#212A3A !important',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: '450px',
    fontSize: '14px',
  },
  iconButton: {
    padding: 4,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchToken(props) {
  const classes = useStyles();

  let
    autoSearch = useRef(false);

  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState();
  const [result, setResult] = useState();
  const [showHistories, setShowHistories] = useState();

  const [searchHistories, setSearchHistories] = useLocalStorage('searchHistories', []);

  const {
    enqueueSnackbar,
    goToChart,
    languages,
  } = props;

  const search = (enabledCache = true) => {
    if (address) {
      if (address.length >= 2) {
        // Add address to search histories
        let
          cloneSearchHistories = [...searchHistories];

        cloneSearchHistories = cloneSearchHistories.filter(value => {
          return value !== address;
        });

        cloneSearchHistories.unshift(address);

        if (cloneSearchHistories.length > 20) {
          cloneSearchHistories.length = 20;
        }

        setSearchHistories(cloneSearchHistories);
        // Add address to search histories



        if (!searching) {
          setSearching(true);
          searchTokenFromDexGuru(address, {
            enabledCache: enabledCache,
          }).then(result => {
            if (result && result.value) {
              setResult(result);

              // Go to token detail page
              if (!result.value.msg && result.value.length === 1 && result.value[0].address) {
                goToChart(result.value[0].address);
                setShowHistories(false);
              }

              if (document.getElementById("token_search")) {
                document.getElementById("token_search").focus();
              }
            } else {
              enqueueSnackbar('Can not file token');
            }
            setSearching(false);
          });
        }
      } else {
        enqueueSnackbar('Please enter more than 2 characters');
      }
    } else {
      enqueueSnackbar('Please enter a token name / address (Ethereum, BSC or Polygon)');
    }
  }

  useEffect(() => {
    // Auto search
    if (autoSearch.current) {
      search();
      autoSearch.current = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const searchByAddress = addr => {
    if (!searching) {
      autoSearch.current = true;
      setAddress(addr);
    }
  }

  const submit = () => {
    search();
  }

  const resetSearch = () => {
    setAddress('');
    setResult(null);
    setShowHistories(false);
  }

  const removeSearchHistoriesByAddress = address => {
    const filtered = searchHistories.filter(value => {
      return value !== address;
    });
    setSearchHistories(filtered);
  }

  return (
    <>
      <Paper
        component="form"
        className={classes.root}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        square
        autoComplete="off"
      >
        <InputBase
          className={classes.input}
          id="token_search"
          placeholder={languages.EnterATokenNameAddressEthereumBSCOrPolygon}
          inputProps={{ 'aria-label': languages.EnterATokenNameAddressEthereumBSCOrPolygon }}
          value={address}
          onChange={(e) => { setAddress(e.target.value) }}
          disabled={searching}
          onFocus={() => {
            setShowHistories(true);
          }}
        />

        {address &&
          <IconButton
            type="reset"
            className={classes.iconButton}
            onClick={resetSearch}
          >
            <ClearIcon className={props.classes.icon} />
          </IconButton>
        }
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          type="submit"
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          disabled={searching}
        >
          {!searching && <SearchIcon className={props.classes.icon} />}
          {searching && <CircularProgress className={props.classes.icon} size={24} />}
        </IconButton>
      </Paper >

      {showHistories && searchHistories && searchHistories.length > 0 &&
        <SearchHistories
          {...props}
          removeSearchHistoriesByAddress={removeSearchHistoriesByAddress}
          searchByAddress={searchByAddress}
          searchHistories={searchHistories}
          setSearchHistories={setSearchHistories}
          setShowHistories={setShowHistories}
        />
      }

      {result &&
        <SearchResults
          {...props}
          resetSearch={resetSearch}
          result={result}
          search={search}
        />
      }
    </>
  );
}