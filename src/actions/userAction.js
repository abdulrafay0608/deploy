// login
export const loginUser = createAsyncThunk(
  "loginUser",
  async (email, password, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(
        `api/v1/auth/login/`,
        { email, password },
        config
      );

      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
