// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InstagramIcon from '@material-ui/icons/Instagram';
import RedditIcon from '@material-ui/icons/Reddit';
import TelegramIcon from '@material-ui/icons/Telegram';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterIcon from '@material-ui/icons/Twitter';

// Images
import mediumIcon from 'images/medium_icon.svg';

// Styles
const useStyles = makeStyles((theme) => ({
  icon: {
    marginLeft: theme.spacing(0.5),
    color: 'white',
  },
  iconLarge: {
    width: 35,
  },
  iconMedium: {
    width: 24,
  },
}));

export default function Social(props) {
  const classes = useStyles();

  const {
    fontSize,
  } = props;

  return (
    <>
      <Tooltip
        title="Go to Telegram channel Meo.tools - Announcements"
        placement="top"
        arrow
        className={classes.icon}
      >
        <IconButton
          target="_blank"
          href={`https://t.me/meo_tools_announceme`}
        >
          <Badge color="secondary" variant="dot">
            <TelegramIcon
              fontSize={fontSize}
            />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to Telegram group Meo.tools - Official Main Chat"
        placement="top"
        arrow
        className={classes.icon}
      >
        <IconButton
          target="_blank"
          href={`https://t.me/meo_tools`}
        >
          <TelegramIcon
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to Twitter channel"
        placement="top"
        arrow
        className={classes.icon}
      >
        <IconButton
          target="_blank"
          href={`https://twitter.com/MeoTools`}
        >
          <TwitterIcon
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to Instagram channel"
        placement="top"
        arrow
        className={classes.icon}
      >
        <IconButton
          target="_blank"
          href={`https://www.instagram.com/meo_tools/`}
        >
          <InstagramIcon
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to Medium channel"
        placement="top"
        arrow
        className={classes.icon}
      >
        <IconButton
          target="_blank"
          href={`https://medium.com/@MeoTools`}
        >
          <img src={mediumIcon} alt="medium icon" className={fontSize === "large" ? classes.iconLarge : classes.iconMedium} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Go to Reddit channel"
        placement="top"
        arrow
        className={classes.icon}
      >
        <IconButton
          target="_blank"
          href={`https://www.reddit.com/r/MeoTools/`}
        >
          <RedditIcon
            fontSize={fontSize}
          />
        </IconButton>
      </Tooltip>
    </>
  );
}