const secret = {
      supabase_url: import.meta.env.VITE_SUPABASE_URL,
      supabase_anon_key: import.meta.env.VITE_SUPABASE_ANON_KEY,
      article_table: "Posts",
      image_bucket: "PostsImages",
};
export default secret;
