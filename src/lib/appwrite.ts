import { Account, Client, Databases, ID, Query, Storage, TablesDB } from 'appwrite';
const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('688c4e16000d8a8d27f4')
  ;
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const tablesDB = new TablesDB(client);

export { ID, Query };


