import { createAsyncThunk } from "@reduxjs/toolkit";
import { ID, Permission, Query, Role } from "appwrite";
import { tablesDB } from "../lib/appwrite";




export interface IWatchlistItem {
  $id?: string;
  userId: string;
  movieId: string;

}




const DATABASE_ID = "69063b6f00214b84d617";
const WATCHLIST_TABLE_ID = "6912018e001ddc641c5d";



export const toggleWatchlist = createAsyncThunk<
  IWatchlistItem,
  { userId: string; movieId: string; }, {
    rejectValue: string
  }
>("watchlist/toggle", async ({ userId, movieId }, { rejectWithValue }) => {
  try {
    const existingItems = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: WATCHLIST_TABLE_ID,
      queries: [
        Query.equal('userId', userId),
        Query.equal('movieId', movieId)
      ]
    })

    if (existingItems.total > 0) {
      console.log(existingItems, "existingItems");

      const itemId = (existingItems.rows[0] as unknown as IWatchlistItem).$id!;
      await tablesDB.deleteRow({
        databaseId: DATABASE_ID,
        tableId: WATCHLIST_TABLE_ID,
        rowId: itemId
      });
      console.log("existing item removed from watchlist", itemId);
      return existingItems.rows[0] as unknown as IWatchlistItem;
    } else {


      const newItem: IWatchlistItem = {
        userId,
        movieId,
      };
      const res = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: WATCHLIST_TABLE_ID,
        data: newItem,
        rowId: ID.unique(),
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.user(userId))
        ]
      });

      console.log(res, " new item created in watchlist");

      return res as unknown as IWatchlistItem;

    }





  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
})

export const fetchWatchlist = createAsyncThunk<
  IWatchlistItem[],
  { userId: string },
  { rejectValue: string }
>('watchlist/list', async ({ userId }, { rejectWithValue }) => {
  try {
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: WATCHLIST_TABLE_ID,
      queries: [Query.equal('userId', userId)]
    });
    return res as unknown as IWatchlistItem[];
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
}
)

export const removeFromWatchList = createAsyncThunk<
  string,
  { documentId: string },
  { rejectValue: string }
>('watchlist/remove', async ({ documentId }, { rejectWithValue }) => {
  try {
    await tablesDB.deleteRow({
      databaseId: DATABASE_ID,
      tableId: WATCHLIST_TABLE_ID,
      rowId: documentId
    });
    return documentId;
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
}
)




