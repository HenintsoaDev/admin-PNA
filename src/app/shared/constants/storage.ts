import ls from 'localstorage-slim';

export const storage = {
    set: (key: string, value: any, encrypt = true) => {
        ls.set(key, value,{ encrypt: encrypt });
    },

    get: (key: string,decrypt = true) => {
        return ls.get(key,{ decrypt: decrypt });
    },
    
    deleteAll: () => {
        localStorage.clear();
    },
    delete: (key: string) => {
        localStorage.removeItem(key);
    }
}