// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
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

  formControl: {
    width: "100%",
  },
}));

export default function TokenRowAlertsDeleteButton(props) {
  const classes = useStyles();

  const [open, setOpen] = useStateAdvance('open', false);

  const {
    row,
    index,
    deleteAlertOfAddress,
  } = props;

  return (
    <>
      <Tooltip title="Delete this alert" placement="top" arrow>
        <IconButton className={classes.margin}
          onClick={() => {
            setOpen(true);
          }}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => {
        setOpen(false);
      }} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete this alert?<br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
          }}>
            NO
          </Button>
          <Button onClick={() => {
            deleteAlertOfAddress(row.address, index);
          }} color="primary" autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}