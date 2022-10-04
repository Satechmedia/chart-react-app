export async function connectTelegramBot(telegramKey) {
    const
      url = `${process.env.REACT_APP_API_URL}api/telegrams/connect/${telegramKey}`;
  
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
  
  export async function sendTelegramMessage(telegramId, text) {
    const
      url = `${process.env.REACT_APP_API_URL}api/telegrams/sendMessage/${telegramId}/${text}`;
  
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