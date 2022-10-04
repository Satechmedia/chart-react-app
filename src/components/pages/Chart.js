// Packages
import { createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// Services
import {
  getTokenHistoryFromDexGuru,
  searchTokenFromDexGuru,
} from 'components/services/Tokens';

// Variable
import { CONSTANT } from 'config/Constant';

// Library
import {
  formatTokenPrice,
} from 'components/libraries/Common';

// Css
import './Chart.scss';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
  },
  legend: {
    width: 'auto',
    position: 'absolute',
    padding: theme.spacing(1),
    fontSize: 12,
    color: 'white',
    backgroundColor: '#111E31c2',
    textAlign: 'left',
    zIndex: 1000,
    pointerEvents: 'none',
    top: 3,
    left: 3,
  },
  legendTokenSymbol: {
    fontSize: 20,
    margin: '4px 0px',
  },
}));

export default function Chart(props) {
  const classes = useStyles();

  const {
    enqueueSnackbar,
    findTokenInWatchList,
    match,
  } = props;

  const token = match && match.params && match.params.token;

  let
    timeout = useRef(),
    chartRef = useRef(),
    candleSeriesRef = useRef(),
    dataRef = useRef([]);

  const [dataUpdated, setDataUpdated] = useState();

  const checkDataSame = (resultA, resultB) => {
    if (
      (!resultA && resultB)
      || (!resultB && resultA)
    ) {
      return false;
    }

    if (
      resultA.open === resultB.open
      && resultA.high === resultB.high
      && resultA.low === resultB.low
      && resultA.close === resultB.close
    ) {
      return true;
    } else {
      return false;
    }
  }

  const updateData = history => {
    const
      data = dataRef.current ?? [],
      cloneData = [...data],
      s = history && history.s ? history.s : null,
      ts = history && history.t ? history.t : [],
      o = history && history.o ? history.o : [],
      h = history && history.h ? history.h : [],
      l = history && history.l ? history.l : [],
      c = history && history.c ? history.c : [];

    if (s === 'ok' && ts.length) {
      ts.forEach((t, i) => {
        const
          find = cloneData.find(x => x.time === t),
          result = {
            time: t,
            open: o && o[i] ? o[i] : 0,
            high: h && h[i] ? h[i] : 0,
            low: l && l[i] ? l[i] : 0,
            close: c && c[i] ? c[i] : 0,
          },
          lastData = cloneData[cloneData.length - 1];

        if (find) {
          if (find.time === lastData.time) {
            find.open = result.open;
            find.high = result.high;
            find.low = result.low;
            find.close = result.close;
          }
        } else if (lastData) {
          if (!checkDataSame(result, lastData) && result.time >= lastData.time) {
            cloneData.push(result);
          }
        } else {
          cloneData.push(result);
        }
      });
      dataRef.current = cloneData;
    }

    setDataUpdated(true);
    return cloneData;
  }

  const [network, setNetwork] = useState();
  const [legendSymbol, setLegendSymbol] = useState('');
  const [legendDate, setLegendDate] = useState('');

  const setLastBarText = () => {
    const
      data = dataRef.current;

    if (data && data[data.length - 1]) {
      const
        dateStr = new Intl.DateTimeFormat('default', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short',
        }).format(new Date(data[data.length - 1].time * 1000));

      setLegendDate(dateStr);
    }
  }

  const setUpToolTip = () => {
    const
      chart = chartRef.current;

    chart.subscribeCrosshairMove(param => {
      const
        chartElement = document.getElementById("chart");

      if (chartElement) {
        if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > chartElement.offsetWidth || param.point.y < 0 || param.point.y > document.body.offsetHeight) {
          setLastBarText();
        } else {
          const
            dateStr = param.time ? new Intl.DateTimeFormat('default', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZoneName: 'short',
            }).format(new Date(param.time * 1000)) : '';

          setLegendDate(dateStr);
        }
      }
    });
  }

  const setupChart = () => {
    const
      chartElement = document.getElementById("chart");

    if (chartElement) {
      chartRef.current = createChart(chartElement, {
        width: chartElement.offsetWidth,
        height: document.body.offsetHeight,
        layout: {
          backgroundColor: '#111E31',
          textColor: '#b2b5be',
        },
        localization: {
          timeFormatter: timestamp => {
            return new Intl.DateTimeFormat('default', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZoneName: 'short',
            }).format(new Date(timestamp * 1000));
          },
        },
        timeScale: {
          rightOffset: 12,
          barSpacing: 5,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: false,
          borderColor: '#242d3a',
          visible: true,
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: (time) => {
            return new Intl.DateTimeFormat('default', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: false,
            }).format(new Date(time * 1000));
          },
        },
        watermark: {
          color: '#E26400',
          visible: true,
          text: 'meo.tools',
          fontSize: 18,
          horzAlign: 'left',
          vertAlign: 'bottom',
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
        grid: {
          vertLines: {
            color: '#242d3a',
          },
          horzLines: {
            color: '#242d3a',
          },
        },
      });

      const
        chart = chartRef.current;

      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: '#62D2CF',
        wickUpColor: '#62D2CF',
        downColor: '#ED524F',
        wickDownColor: '#ED524F',
        priceFormat: {
          type: 'custom',
          minMove: 0.00000000001,
          formatter: price => formatTokenPrice(price, 2),
        },
      });

      var timerID;
      document.body.onresize = function () {
        if (timerID) clearTimeout(timerID);
        timerID = setTimeout(function () {
          chart.resize(document.body.offsetWidth, document.body.offsetHeight);
        }, 200);
      }

      setUpToolTip();
    }
  }

  const [fetching, setFetching] = useState(false);

  const initChart = () => {
    let
      intervals = JSON.parse(localStorage.getItem('intervals')) || 60,
      TIME_SCALE = CONSTANT.TIME_SCALE[intervals];

    if (!TIME_SCALE) {
      intervals = 60;
      TIME_SCALE = CONSTANT.TIME_SCALE[intervals];
    }

    const
      TERM = TIME_SCALE.INIT_TERM,
      RESOLUTION = intervals,
      currentTimestamp = Date.now(),
      from = Math.round((currentTimestamp / 1000) - TERM),
      to = Math.round(currentTimestamp / 1000);

    if (!fetching) {
      setFetching(true);
      getTokenHistoryFromDexGuru(token, network, RESOLUTION, from, to).then(result => {
        if (result) {
          if (Object.keys(result).length) {
            updateData(result);
          } else {
            timeout.current = setTimeout(initChart, CONSTANT.DELAY_TIME);
          }
        } else {
          enqueueSnackbar('Can not file token');
        }

        setFetching(false);
      });
    }
  }

  const [updating, setUpdating] = useState(false);

  const updatePrice = () => {
    let
      intervals = JSON.parse(localStorage.getItem('intervals')) || 60,
      TIME_SCALE = CONSTANT.TIME_SCALE[intervals];

    if (!TIME_SCALE) {
      intervals = 60;
      TIME_SCALE = CONSTANT.TIME_SCALE[intervals];
    }

    const
      TERM = TIME_SCALE.UPDATE_TERM,
      RESOLUTION = intervals,
      currentTimestamp = Date.now(),
      from = Math.round((currentTimestamp / 1000) - TERM),
      to = Math.round(currentTimestamp / 1000);

    if (!updating) {
      setUpdating(true);
      getTokenHistoryFromDexGuru(token, network, RESOLUTION, from, to).then(result => {
        updateData(result);
        setUpdating(false);
      });
    }
  }

  useEffect(() => {
    document.body.classList.add("chart-page");

    if (window === window.parent) {
      window.location.href = "about:blank"
    }
    else if (token) {
      const
        tokenInfo = findTokenInWatchList(token);

      if (tokenInfo) {
        if (tokenInfo.symbol) {
          setLegendSymbol(tokenInfo.symbol);
          setNetwork(tokenInfo.network);
        }
      } else {
        searchTokenFromDexGuru(token).then(result => {
          if (result && result.value && result.value.length > 0) {
            setLegendSymbol(result.value[0].symbol);
            setNetwork(result.value[0].network);
          } else {
            enqueueSnackbar('Can not file token');
          }
        });
      }

      if (!document.getElementsByClassName("tv-lightweight-charts").length) {
        setupChart();
      }

      return function cleanup() {
        window.localStorage.removeItem('title');

        chartRef.current.remove();

        dataRef.current = [];
        setDataUpdated(null);
        clearTimeout(timeout.current);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (network) {
      initChart();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  const transferData = (data) => {
    if (data && data.length) {
      const
        lastData = data[data.length - 1],
        currentPrice = lastData && lastData.close ? lastData.close : null;

      if (currentPrice) {
        window.localStorage.setItem('currentPrice', currentPrice);
      }
    }
  }

  useEffect(() => {
    if (dataUpdated) {
      const
        candleSeries = candleSeriesRef.current,
        data = dataRef.current;

      if (candleSeries) {
        candleSeries.setData(data);
        setLastBarText();
      }

      transferData(data);

      setDataUpdated(false);
    } else if (dataUpdated === false) {
      timeout.current = setTimeout(updatePrice, CONSTANT.DELAY_TIME);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdated]);

  return (
    <div className={classes.root}>
      <div id="chart">
        <div className={classes.legend}>
          <div className={classes.legendTokenSymbol}>{legendSymbol} • meo.tools</div>
          <div>{legendDate}</div>
        </div>
      </div>

      <Backdrop className={props.classes.backdrop} open={fetching}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
}