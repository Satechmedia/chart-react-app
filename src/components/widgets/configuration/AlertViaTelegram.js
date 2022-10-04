// Packages
import { useState, useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';

// Services
import {
  connectTelegramBot,
  sendTelegramMessage,
} from 'components/services/Telegrams';

// Library
import {
  makeid,
  useStateAdvance,
  useLocalStorage,
} from 'components/libraries/Common';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  connected: {
    marginLeft: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginTop: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(2),
  },
  stepper: {
    padding: theme.spacing(2),
  },
}));

export default function AlertViaTelegram(props) {
  const classes = useStyles();

  const {
    enqueueSnackbar,
    languages,
  } = props;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [telegramKey, setTelegramKey] = useLocalStorage('telegramKey');
  const [telegramId, setTelegramId] = useLocalStorage('telegramId');
  const [connecting, setConnecting] = useStateAdvance('connecting');

  const getTelegramId = telegramId && telegramId !== 'null' ? telegramId : null;

  const getSteps = () => {
    return [languages.OpenTheMeoToolsBOT, languages.StartBot, languages.ConnectToTheMeoToolsBOT, languages.SendATestMessage];
  }

  const steps = getSteps();

  let
    defaultStep = 0;
  if (getTelegramId) {
    defaultStep = steps.length;
  }
  const [activeStep, setActiveStep] = useState(defaultStep);

  const connectTelegramBotSubmit = () => {
    if (telegramKey) {
      setConnecting(true);
      connectTelegramBot(telegramKey).then(result => {
        if (result && result.id) {
          setTelegramId(result.id);
        } else {
          enqueueSnackbar('Can not connect to the Meo.tools BOT');
        }
        setConnecting(false);
      });
    } else {
      enqueueSnackbar('Something went wrong!')
    }
  }

  const [testing, setTesting] = useStateAdvance('testing');

  const sendTestTelegramMessageSubmit = () => {
    if (getTelegramId) {
      setTesting(true);
      sendTelegramMessage(getTelegramId, 'Hello from meo.tools').then(result => {
        if (!result) {
          enqueueSnackbar('Can not send a test message via Telegram');
        }
        setTesting(false);
      });
    } else {
      enqueueSnackbar('Something went wrong!')
    }
  }

  const [expanded, setExpanded] = useState(!getTelegramId);

  useEffect(() => {
    if (!telegramKey) {
      setTelegramKey(makeid(22));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Divider />

      <Accordion
        square
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading} component="div">
            {languages.AlertViaTelegram}
            {getTelegramId && <Chip label="Connected" color="primary" size="small" className={classes.connected} />}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 &&
                      <Typography variant="body2">
                        Click on the link below to open Meo.tools BOT (you need to install Telegram and log in to your account)<br />
                        <Link href={`https://t.me/meotools_bot?start=${telegramKey}`} target="_blank">
                          https://t.me/meotools_bot?start={telegramKey}
                        </Link>
                      </Typography>
                    }

                    {index === 1 &&
                      <Typography variant="body2">
                        Click <strong>Start</strong> button on Telegram
                      </Typography>
                    }

                    {index === 2 && !getTelegramId &&
                      <Typography variant="body2">
                        Click on the <strong>CONNECT</strong> button below to connect to the Meo.tools BOT
                      </Typography>
                    }

                    {index === 2 && getTelegramId &&
                      <Typography variant="body2">
                        You are now connected to the Meo.tools BOT. Please click on the <strong>NEXT</strong> button
                      </Typography>
                    }

                    {index === 3 &&
                      <Typography variant="body2">
                        Click on the <strong>SEND TEST MESSAGE</strong> button below. If you can receive the message from Meo.tools BOT via Telegram, click on the <strong>FINISH</strong> to complete this configuration.
                      </Typography>
                    }

                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className={classes.button}
                          size="small"
                        >
                          Back
                        </Button>

                        {index === 2 && !getTelegramId &&
                          <Button
                            className={classes.button}
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={connectTelegramBotSubmit}
                            disabled={connecting}
                          >
                            Connect
                          </Button>
                        }

                        {index === 3 && getTelegramId &&
                          <Button
                            className={classes.button}
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={sendTestTelegramMessageSubmit}
                            disabled={testing}
                          >
                            SEND TEST MESSAGE
                          </Button>
                        }

                        {(index !== 2 || (index === 2 && getTelegramId)) &&
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                            size="small"
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        }

                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>{languages.AllStepsCompletedYouReFinished}</Typography>
                <Button onClick={handleReset} className={classes.button}>
                  {languages.Reset}
                </Button>
              </Paper>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}