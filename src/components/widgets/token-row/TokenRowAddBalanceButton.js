// Packages
import { useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

// Library
import {
  useStateAdvance,
} from 'components/libraries/Common';

// Styles
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0.4),
    padding: theme.spacing(0.6),
  },
}));

export default function TokenRowAddBalanceButton(props) {
  const classes = useStyles();

  const [open, setOpen] = useStateAdvance('open', false);
  const [balance, setBalance] = useStateAdvance('balance', '');

  const {
    row,
    updateTokenBalanceInWatchListByAddress,
  } = props;

  const openDialog = () => {
    setBalance(row.balance);
    setOpen(true);
  }

  const submit = () => {
    updateTokenBalanceInWatchListByAddress(row.address, balance);
    setOpen(false);
  }

  useEffect(() => {
    setBalance(row.balance);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Tooltip title="Add your banlance" placement="top" arrow>
        <IconButton className={classes.margin}
          onClick={openDialog} size="small">
          <EditIcon className={props.classes.icon} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => {
        setOpen(false);
      }} aria-labelledby="form-dialog-title">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <DialogTitle id="form-dialog-title">Add Your Balance</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your balance, example: 10.00
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Balance"
              type="number"
              inputProps={{
                step: "any"
              }}
              fullWidth
              value={balance}
              onChange={(e) => { setBalance(e.target.value) }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={submit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}