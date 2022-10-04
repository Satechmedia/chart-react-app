export async function getPrivateSaleList() {
    const
      url = `${process.env.REACT_APP_API_URL}api/private-sales`;
  
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
  
  export async function getPrivateSaleListByAddress(address) {
    if (address) {
      const
        url = `${process.env.REACT_APP_API_URL}api/private-sales?filter[where][address]=${address.toLowerCase()}`;
  
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
  }
  
  export async function getAirdropListByAddress(address) {
    if (address) {
      const
        url = `${process.env.REACT_APP_API_URL}api/airdrops?filter[where][address]=${address.toLowerCase()}`;
  
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
  }
  
  export async function verifyAirdropByAddress(address) {
    if (address) {
      const
        url = `${process.env.REACT_APP_API_URL}api/airdrops/verify/${address.toLowerCase()}`;
  
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
  }
  
  // Presale
  export async function getPresaleListByAddress(address) {
    if (address) {
      const
        url = `${process.env.REACT_APP_API_URL}api/presales/address/${address.toLowerCase()}`;
  
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
  }
  
  export async function getPresaleList() {
    const
      url = `${process.env.REACT_APP_API_URL}api/presales`;
  
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
  
  export async function registerPresale(walletAddress, addressKey, amount) {
    const
      url = `${process.env.REACT_APP_API_URL}api/presales`;
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          address: walletAddress.toLowerCase(),
          key: addressKey,
          amount: amount,
        }),
      });
      const result = await res.json();
      return result;
    }
    catch (error) {
      console.error(error);
    }
  }