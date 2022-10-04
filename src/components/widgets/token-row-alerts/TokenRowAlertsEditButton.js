// Packages
import { useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

// Library
import {
  formatTokenPrice,
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

export default function TokenRowAlertsEditButton(props) {
  const classes = useStyles();

  const [open, setOpen] = useStateAdvance('open', false);

  const DEFAULT_ALERT_TYPE = 'price-ries-above';
  const DEFAULT_ALERT_VALUE = '';

  const [alertTpye, setAlertType] = useStateAdvance('alertType', DEFAULT_ALERT_TYPE);
  const [value, setValue] = useStateAdvance('value', DEFAULT_ALERT_VALUE);

  const {
    alert,
    editAlertOfAddress,
    index,
    languages,
    row,
  } = props;

  const openDialog = () => {
    setAlertType(alert.alertType);
    setValue(alert.value);
    setOpen(true);
  }

  const submit = () => {
    editAlertOfAddress(row.address, index, alertTpye, value);

    setOpen(false);
  }

  useEffect(() => {
    setAlertType(alert.alertType);
    setValue(alert.value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Tooltip title="Update this alert" placement="top" arrow>
        <IconButton className={classes.margin}
          onClick={openDialog} size="small">
          <EditIcon />
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
          <DialogTitle id="form-dialog-title">Update Alert</DialogTitle>
          <DialogContent>
            <FormControl className={classes.formControl}>
              <InputLabel>{languages.AlertType}</InputLabel>
              <Select
                value={alertTpye}
                onChange={(e) => { setAlertType(e.target.value) }}
              >
                <MenuItem value="price-ries-above">{languages.PriceRisesAbove}</MenuItem>
                <MenuItem value="price-drops-to">{languages.PriceDropsTo}</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <TextField
                autoFocus
                margin="dense"
                label={languages.Value}
                type="number"
                inputProps={{
                  step: "any"
                }}
                value={value}
                onChange={(e) => { setValue(e.target.value) }}
              />
              <FormHelperText>{languages.CurrentPrice}: {formatTokenPrice(row.priceUSD)}</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              {languages.Cancel}
            </Button>
            <Button onClick={submit} color="primary">
              Update Alert
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}