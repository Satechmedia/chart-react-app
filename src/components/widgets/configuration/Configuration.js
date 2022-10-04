// Material UI
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Widgets
import AlertViaTelegram from 'components/widgets/configuration/AlertViaTelegram';

export default function Configuration(props) {
  const {
    className,
    languages,
  } = props;

  return (
    <Paper square className={className}>
      <Box padding={2}>
        <Typography variant="h5" className={props.classes.marginBottom}>
          {languages.Configuration}
        </Typography>

        <AlertViaTelegram
          {...props}
        />
      </Box>
    </Paper>
  );
}