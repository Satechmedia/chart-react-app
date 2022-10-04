// Packages
import { useEffect } from 'react';

// Material UI
import Typography from '@material-ui/core/Typography';

export default function SwapSection(props) {
  const {
    network,
    token,
  } = props;

  useEffect(() => {
    if (token && network) {
      if (isSwapSupported()) {
        let
          from = '';

        switch (network) {
          case 'eth':
            from = 'ETH';
            break;
          case 'polygon':
            from = 'MATIC';
            break;
          default:
            from = 'BNB';
        }

        // describe widget configuration and saving to a global variable for future use
        var configuration = {
          from: from,
          to: token,
          fromChain: network.toUpperCase(),
          toChain: network.toUpperCase(),
          amount: 1,
          iframe: 'flex',
          hideSelectionFrom: false,
          hideSelectionTo: true,
          theme: 'dark',
          background: '#111E31',
          injectTokens: {
            bsc: [
              token
            ]
          }
        }

        console.log(configuration);

        // prevent accidental changes to the object, for example, when re-creating a widget for another theme
        Object.freeze(configuration);

        // create widget
        window.rubicWidget.init(configuration);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, network]);

  const isSwapSupported = () => {
    if (network === 'bsc') {
      return true;
    }
    if (network === 'polygon') {
      return true;
    }
    if (network === 'eth') {
      return true;
    }

    return false;
  }

  if (!isSwapSupported()) {
    return '';
  }

  return (
    <>
      <Typography variant="h6" className={props.classes.marginBottom}>
        Swap (beta)
      </Typography>

      <div className={props.classes.marginBottom} id="rubic-widget-root"></div>
    </>
  );
}