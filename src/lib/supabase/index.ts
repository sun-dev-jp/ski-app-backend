import supabase from "./client";

// Supabaseで登録したテーブル名
const TABLE_NAME = 'User'

// データ取得
export const getList = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at')

      if (error) {
        const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error';
        throw new Error(errorMessage);
      }

    return data
  } catch (e) {
    console.error((e as Error).message)
    return null  // 戻り値を指定
  }
};

// データ更新
// export const updateLunch = async ({ id, lunch, isDone }) => {
//   try {
//       await supabase
//             .from(TABLE_NAME)
//             .insert({ id, lunch, is_done:isDone })
//   } catch (e) {
//       console.error(e.message)
//   }
// };