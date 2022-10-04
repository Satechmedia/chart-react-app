import * as React from 'react';
import { widget } from '../../charting_library';
import { UDFCompatibleDatafeed } from '../../charting_library/datafeed/bundle';
// Services
import { makeApiRequest } from "../../charting_library/datafeed/helpers";

// Css
import './Chart.scss';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

async function getAllSymbols(token = '') {
  if (token.length <= 2) {
    return [];
  }
  const data = await makeApiRequest('/v2/tokens/search/' + token);
  let allSymbols = [];

  for (const symbol of data.data) {
    allSymbols.push({
      symbol: symbol.symbol,
      full_name: symbol.name,
      address: symbol.address,
      network: symbol.network,
      tokenListsNames: symbol.tokenListsNames
    });
  }

  return allSymbols;
}

export class TechnicalAnalysisChart extends React.PureComponent {
  state = {};

  static defaultProps = {
    interval: 'D',
    containerId: 'ta_chart_container',
    libraryPath: '/charting_library/',
    autosize: true,
  };

  tvWidget = null;

  componentDidMount() {
    const { token, enqueueSnackbar } = this.props;
    let network = [];
    getAllSymbols(token).then(result => {
      if (result) {
        if (Object.keys(result).length) {
          for (let i = 0; i < result.length; i++) {
            if (result[i] && (result[i].tokenListsNames || result.length === 1)) {
              network.push(result[i]);
            }
          }
          const urlSymbol = `${token}-${network[0].network}_USD`;
          this.setState({
            widgetOptions: {
              // symbol: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth_USD',
              symbol: urlSymbol,
              // BEWARE: no trailing slash is expected in feed URL
              datafeed: new UDFCompatibleDatafeed('https://api.meo.tools/v1/tradingview'),
              // interval: this.props.interval,
              container: this.props.containerId,
              library_path: this.props.libraryPath,
              disabled_features: ["header_symbol_search", "header_compare", "display_market_status", 'timeframes_toolbar'],
              enabled_features: ["pricescale_currency"],
              locale: getLanguageFromURL() || 'en',
              autosize: this.props.autosize,
              theme: 'dark',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              time_frames: [{
                text: "1m",
                resolution: "1",
                description: "1 minute"
              }, {
                text: "1d",
                resolution: "1d",
                description: "1 Day"
              }]
            }
          });
          const tvWidget = new widget(this.state.widgetOptions);
          this.tvWidget = tvWidget;
        }
      } else {
        enqueueSnackbar('Can not file token');
      }
    });

  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  componentDidUpdate(prevProps) {
    const { token, enqueueSnackbar } = this.props;
    let network = [];
    if (token !== prevProps.token) {
      getAllSymbols(token).then(result => {
        if (result) {
          if (Object.keys(result).length) {
            for (let i = 0; i < result.length; i++) {
              if (result[i] && (result[i].tokenListsNames || result.length === 1)) {
                network.push(result[i]);
              }
            }
            const urlSymbol = `${token}-${network[0].network}_USD`;
            this.setState({
              widgetOptions : {
                // symbol: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth_USD',
                symbol: urlSymbol,
                // BEWARE: no trailing slash is expected in feed URL
                datafeed: new UDFCompatibleDatafeed('https://api.dex.guru/v1/tradingview'),
                // interval: this.props.interval,
                container: this.props.containerId,
                library_path: this.props.libraryPath,
                disabled_features: ["header_symbol_search", "header_compare", "display_market_status",'timeframes_toolbar'],
                enabled_features: ["pricescale_currency"],
                locale: getLanguageFromURL() || 'en',
                autosize: this.props.autosize,
                theme: 'dark',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                time_frames: [{
                  text: "1m",
                  resolution: "1",
                  description: "1 minute"
                }, {
                  text: "1d",
                  resolution: "1d",
                  description: "1 Day"
                }]
              }
            });
            const tvWidget = new widget(this.state.widgetOptions);
            this.tvWidget = tvWidget;
          }
        } else {
          enqueueSnackbar('Can not file token');
        }
      });
    }
  }

  render() {
    return (
      <div
        id={this.props.containerId}
        className={'technicalAnalysisChart'}
      />
    );
  }
}
