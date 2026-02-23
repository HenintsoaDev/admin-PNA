import ls from 'localstorage-slim';

export const storage = {
    set: (key: string, value: any, encrypt = true) => {
        ls.set(key, value,{ encrypt: encrypt });
      },
    
      get: (key: string,decrypt = true) => {
        return ls.get(key,{ decrypt: decrypt });
      },
    
      // setObject(key: string, value: any): void {
      //   localStorage.setItem(key,JSON.stringify(value));
      // }
    
      // getObject(key: string): object {
      //   try {
      //     return JSON.parse(localStorage.getItem(key) as string);
      //   } catch (e) {
      //     return null as any 
      //   }
      // }
      
      deleteAll: () => {
        localStorage.clear();
      },
      delete: (key: string) => {
        localStorage.removeItem(key);
      }
}