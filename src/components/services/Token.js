// Library
import {
    getLocalStorageCache,
    setLocalStorageCache,
  } from 'components/libraries/Common';
  
  // Variable
  import { CONSTANT } from 'config/Constant';
  
  export async function searchToken(token, option = {}) {
    // Default value
    let
      sampleData = false, // WARNING, SHOULD BE false BEFORE COMMIT CODE
      enabledCache = true;
  
    if (option.enabledCache === false) {
      enabledCache = false;
    }
  
    if (process.env.NODE_ENV === 'production') {
      sampleData = false;
    }
  
    const
      key = `searchToken_cache_${token}`,
      url = `${process.env.REACT_APP_API_URL}api/tokens/search/${token}`;
  
    if (sampleData) {
      if (enabledCache) {
        const
          cacheValue = getLocalStorageCache(key);
  
        if (cacheValue) {
          return cacheValue;
        } else {
          // Get new data
          const
            value = require('data/sample-data/sampleDataSearchTokenLava.json');
  
          // Set cache
          return setLocalStorageCache(key, value);
        }
      } else {
        // Get new data
        const
          value = require('data/sample-data/sampleDataSearchTokenLava.json');
  
        return setLocalStorageCache(key, value);
      }
    } else {
      if (enabledCache) {
        const
          cacheValue = getLocalStorageCache(key);
  
        if (cacheValue) {
          return cacheValue;
        } else {
          // Get new data
          try {
            const res = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
            const
              value = await res.json();
  
            if (value.data && Object.keys(value.data).length) {
              value.data = value.data.filter((row) => (row && row.tokenListsNames) || (row.length === 1));
            }
  
            // Set cache
            return setLocalStorageCache(key, value);
          }
          catch (error) {
            console.error(error);
          }
        }
      } else {
        // Get new data
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          const
            value = await res.json();
  
          if (value.data && Object.keys(value.data).length) {
            value.data = value.data.filter((row) => (row && row.tokenListsNames) || (row.length === 1));
          }
  
          return setLocalStorageCache(key, value);
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }
  
  export async function searchTokenFromDexGuru(token, option = {}) {
    // Default value
    let
      sampleData = false, // WARNING, SHOULD BE false BEFORE COMMIT CODE
      enabledCache = true;
  
    if (option.enabledCache === false) {
      enabledCache = false;
    }
  
    if (process.env.NODE_ENV === 'production') {
      sampleData = false;
    }
  
    const valueProcess = value => {
      if (value && value.data) {
        // Set cache
        return setLocalStorageCache(key, value.data);
      } else if (value && value.detail && value.detail.length > 0) {
        return setLocalStorageCache(key, value.detail[0]);
      } else {
        return false;
      }
    }
  
    const
      key = `searchToken_cache_${token}`,
      url = `https://api.dex.guru/v2/tokens/search/${token}`;
  
    if (sampleData) {
      if (enabledCache) {
        const
          cacheValue = getLocalStorageCache(key);
  
        if (cacheValue) {
          return cacheValue;
        } else {
          // Get new data
          const
            value = require('data/sample-data/sampleDataSearchTokenLava.json');
  
          // Set cache
          return setLocalStorageCache(key, value);
        }
      } else {
        // Get new data
        const
          value = require('data/sample-data/sampleDataSearchTokenLava.json');
  
        return setLocalStorageCache(key, value);
      }
    } else {
      if (enabledCache) {
        const
          cacheValue = getLocalStorageCache(key);
  
        if (cacheValue) {
          return cacheValue;
        } else {
          // Get new data
          try {
            const res = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const
              value = await res.json();
  
            if (value.data && Object.keys(value.data).length) {
              value.data = value.data.filter((row) => (row && row.tokenListsNames) || (row.length === 1));
            }
  
            return valueProcess(value);
          }
          catch (error) {
            console.error(error);
          }
        }
      } else {
        // Get new data
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const
            value = await res.json();
  
          if (value.data && Object.keys(value.data).length) {
            value.data = value.data.filter((row) => (row && row.tokenListsNames) || (row.length === 1));
          }
  
          return valueProcess(value);
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }
  
  export async function getTokenPrice(token) {
    const
      url = `${process.env.REACT_APP_API_URL}api/tokens/price/${token}`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenPriceFromDexGuru(token, network) {
    const
      TERM = 6000,
      currentTimestamp = Date.now(),
      from = Math.round((currentTimestamp / 1000) - TERM),
      to = Math.round(currentTimestamp / 1000),
      url = `https://api.dex.guru/v1/tradingview/history?symbol=${token}-${network}_USD&resolution=10&from=${from}&to=${to}&currencyCode=USD`,
      defaultData = {
        priceUSD: null,
        time: null,
      };
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
  
      const
        c = result.c ? result.c : null,
        lastPrice = c && c.length ? c.slice(-1).pop() : null,
        t = result.t ? result.t : null,
        lastTime = t ? t.slice(-1).pop() : null;
  
      if (lastPrice && lastTime) {
        return {
          priceUSD: lastPrice,
          time: lastTime,
        }
      } else {
        return defaultData;
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenHistory(token, resolution, from, to) {
    const
      url = `${process.env.REACT_APP_API_URL}api/tokens/history/${token}/${resolution}/${from}/${to}`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenHistoryFromDexGuru(token, network, resolution, from, to) {
    if (resolution === "1440") {
      resolution = "1D";
    }
    if (resolution === "10080") {
      resolution = "1W";
    }
  
    const
      url = `https://api.dex.guru/v1/tradingview/history?symbol=${token}-${network}_USD&resolution=${resolution}&from=${from}&to=${to}&currencyCode=USD`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenInfoFromCoingecko(token, network) {
    let
      assetPlatform;
  
    if (network === 'bsc') {
      assetPlatform = 'binance-smart-chain';
    } else if (network === 'polygon') {
      assetPlatform = 'polygon-pos';
    } else if (network === 'eth') {
      assetPlatform = 'ethereum';
    }
  
    if (token && assetPlatform) {
      const
        url = `https://api.coingecko.com/api/v3/coins/${assetPlatform}/contract/${token}`;
  
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await res.json();
        return result;
      }
      catch (error) {
        console.error(error);
      }
    }
  }
  
  export async function getTokenSupplyFromBscscan(token) {
    const
      url = `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${token}&apikey=${CONSTANT.BSCSCAN_API_KEY}`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenSupplyFromPolygonscan(token) {
    const
      url = `https://api.polygonscan.com/api?module=stats&action=tokensupply&contractaddress=${token}&apikey=${CONSTANT.POLYGONSCAN_API_KEY}`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenSupplyFromEtherscan(token) {
    const
      url = `https://api.etherscan.com/api?module=stats&action=tokensupply&contractaddress=${token}&apikey=${CONSTANT.ETHERSCAN_API_KEY}`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTokenSwaps(token, network) {
    const
      url = `https://api.dex.guru/v2/tokens/${token}-${network}/swaps`;
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 30,
          order: "desc",
          sort_by: "timestamp",
        }),
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getTopTokens() {
    const
      url = `https://api.dex.guru/v2/tokens/?sort_by=volume24hUSD&order=desc&from_num=0&limit=20&field=verified&value=true`;
  
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }
  
  export async function getWalletBalancesByAddress(address) {
    if (address) {
      const
        url = `https://api.covalenthq.com/v1/56/address/${address}/balances_v2/?key=${CONSTANT.COVALENTHQ_API_KEY}`;
  
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await res.json();
        return result;
      }
      catch (error) {
        console.error(error);
      }
    } else {
      return false;
    }
  }
  
  export async function getTransactionsByAddress(address, pageNumber = 0) {
    if (address) {
      const
        url = `https://api.covalenthq.com/v1/56/address/${address}/transactions_v2/?key=${CONSTANT.COVALENTHQ_API_KEY}&page-number=${pageNumber}&page-size=1000`;
  
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await res.json();
        return result;
      }
      catch (error) {
        console.error(error);
      }
    } else {
      return false;
    }
  }
  