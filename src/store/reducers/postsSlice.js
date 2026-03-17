import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      posts: [],
};
const postsSlice = createSlice({
      name: "posts",
      initialState,
      reducers: {
            setPosts: (state, action) => {
                  state.posts = action.payload;
            },
            setNewPost: (state, action) => {
                  state.posts.unshift(action.payload);
            },
            deletePost: (state, action) => {
                  state.posts = state.posts.filter((post) => post.id != action.payload);
            },
            updatePost: (state, action) => {
                  const { id, updatedPost } = action.payload;
                  const index = state.posts.findIndex((post) => post.id == id);
                  if (index !== -1) state.posts[index] = updatedPost;
            },
            removePosts: (state) => {
                  state.posts = [];
            },
      },
});
export const { setPosts, removePosts, deletePost, updatePost, setNewPost } = postsSlice.actions;
export default postsSlice.reducer;
