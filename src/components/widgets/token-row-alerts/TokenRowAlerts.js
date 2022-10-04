// Packages
import { useEffect } from 'react';
import React from 'react';

// Material UI
import { Alert } from '@material-ui/lab';
import { green, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

// Library
import {
  formatTokenPrice,
  useStateAdvance,
} from 'components/libraries/Common';

// Variable
import { CONSTANT, MESSAGE } from 'config/Constant';

// Widgets
import TokenRowAlertsAddButton from 'components/widgets/token-row-alerts/TokenRowAlertsAddButton';
import TokenRowAlertsEditButton from 'components/widgets/token-row-alerts/TokenRowAlertsEditButton';
import TokenRowAlertsDeleteButton from 'components/widgets/token-row-alerts/TokenRowAlertsDeleteButton';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
  },
  title: {
    paddingTop: theme.spacing(2),
  },
  iconRed: {
    backgroundColor: red[500],
    width: 24,
    height: 24,
  },
  iconGreen: {
    backgroundColor: green[500],
    width: 24,
    height: 24,
  },
  icon: {
    width: 16,
    height: 16,
  },
}));

export default function TokenRowAlerts(props) {
  const classes = useStyles();

  const [update, setUpdate] = useStateAdvance('update', false);

  const {
    addAlertToAddress,
    countTotalAlert,
    deleteAlertOfAddress,
    editAlertOfAddress,
    getAlertsByAddress,
    languages,
    row,
    toggleAlertOfAddress,
  } = props;

  const
    alerts = getAlertsByAddress(row.address);

  const getAvatarClass = (alertType) => {
    switch (alertType) {
      case 'price-ries-above':
        return classes.iconGreen;

      case 'price-drops-to':
        return classes.iconRed;

      default:
        return null;
    }
  }

  const getAvatarIcon = (alertType) => {
    switch (alertType) {
      case 'price-ries-above':
        return <VerticalAlignTopIcon className={classes.icon} />;

      case 'price-drops-to':
        return <VerticalAlignBottomIcon className={classes.icon} />;

      default:
        return null;
    }
  }

  const getText = (alertType, alert) => {
    switch (alertType) {
      case 'price-ries-above':
        return `${languages.PriceRisesAbove} ${formatTokenPrice(alert)}`;

      case 'price-drops-to':
        return `${languages.PriceDropsTo} ${formatTokenPrice(alert)}`;

      default:
        return '';
    }
  }

  useEffect(() => {
    // Re-render
    setUpdate(!update);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.alerts]);

  return (
    <Box className={classes.root}>
      <Divider />

      <Typography variant="h6" align="center" className={classes.title}>
        {languages.Alerts}
      </Typography>

      {alerts.length !== 0 &&
        <List>
          {alerts.map((alert, key) => (
            <React.Fragment key={key}>
              <Divider />

              <ListItem>
                <ListItemAvatar>
                  <Avatar className={getAvatarClass(alert.alertType)}>
                    {getAvatarIcon(alert.alertType)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={getText(alert.alertType, alert.value)} />

                <Switch
                  checked={alert.checked}
                  onChange={() => { toggleAlertOfAddress(row.address, key) }}
                  color="primary"
                />

                <TokenRowAlertsEditButton
                  {...props}
                  row={row}
                  alert={alert}
                  index={key}
                  editAlertOfAddress={editAlertOfAddress}
                />

                <TokenRowAlertsDeleteButton
                  {...props}
                  row={row}
                  index={key}
                  deleteAlertOfAddress={deleteAlertOfAddress}
                />

              </ListItem>
            </React.Fragment>
          ))}
        </List>
      }

      {
        alerts.length === 0 &&
        <Typography variant="body2" align="center">
          {languages.PressTheButtonBelowToGetStartedAddingAlerts}
        </Typography>
      }

      {
        alerts.length < CONSTANT.MAXIMUM_ALERT_OF_A_TOKEN &&
        countTotalAlert() < CONSTANT.MAXIMUM_ALERT_OF_ALL_TOKEN &&
        <TokenRowAlertsAddButton
          {...props}
          row={row}
          addAlertToAddress={addAlertToAddress}
        />
      }

      {
        countTotalAlert() < CONSTANT.MAXIMUM_ALERT_OF_ALL_TOKEN &&
        alerts.length >= CONSTANT.MAXIMUM_ALERT_OF_A_TOKEN &&
        <Alert severity="warning">{MESSAGE.MAXIMUM_ALERT_OF_A_TOKEN}</Alert>
      }

      {
        countTotalAlert() >= CONSTANT.MAXIMUM_ALERT_OF_ALL_TOKEN &&
        <Alert severity="warning">{MESSAGE.MAXIMUM_ALERT_OF_ALL_TOKEN}</Alert>
      }
    </Box >
  );
}