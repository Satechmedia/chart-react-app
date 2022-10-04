// Packages
import { reactLocalStorage } from 'reactjs-localstorage';
import { useState, useRef, useEffect } from 'react';

// Variable
import { CONSTANT } from 'config/Constant';

export function useStateAdvance(myKey, defaultValue = null) {
  const [value, setValue] = useState(defaultValue);
  const getValue = value && value[myKey] ? value[myKey] : defaultValue;
  const setValueWrap = (value) => {
    setValue({
      [myKey]: value,
    });
  };

  return [getValue, setValueWrap];
}

// https://usehooks.com/useLocalStorage/
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function formatPrice(price, minimumFractionDigits = 2) {
  if (!price) {
    return '$0.00';
  }

  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: minimumFractionDigits, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return price ? formatter.format(price) : '';
}

export function formatToken(token, minimumFractionDigits = 2) {
  let formatter = new Intl.NumberFormat('en-US', {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: minimumFractionDigits, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return token ? formatter.format(token) : '';
}

export function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export function formatTokenPrice(price, margin = 4) {
  if (!price) {
    return '$0.0000';
  }

  let
    maxDigit = 20;

  for (let i = 0; i < 20; i++) {
    if (price * Math.pow(10, i) > 10) {
      maxDigit = i + margin;
      break;
    }
  }

  if (maxDigit > 20) {
    maxDigit = 20;
  }

  return formatPrice(price, maxDigit);
}

export function getLocalStorageCache(key) {
  const
    cacheValue = reactLocalStorage.getObject(key);

  // Get value from cache
  if (cacheValue && Date.now() - cacheValue.cacheTime < CONSTANT.DEFAULT_CACHE_TIME && cacheValue.value) {
    return cacheValue;
  } else {
    // Expired, remove cache
    reactLocalStorage.remove('key');
    return false;
  }
}

export function setLocalStorageCache(key, value) {
  const
    result = {
      cache: true,
      cacheTime: Date.now(),
      value: value,
    }

  // Write cache
  reactLocalStorage.setObject(key, result);

  return {
    ...result,
    cache: false,
  };
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function getHostnameWithoutWww(url) {
  if (isValidHttpUrl(url)) {
    const
      domain = new URL(url);

    if (domain && domain.hostname) {
      return domain.hostname.replace('www.', '');
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export function getShortToken(token) {
  if (token) {
    return `${token.substr(0, 6)}...${token.substr(-4)}`;
  } else {
    return '';
  }
}

export function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}