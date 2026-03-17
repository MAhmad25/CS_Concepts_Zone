import { createClient } from "@supabase/supabase-js";
import secret from "../config/secret";

export class DocumentService {
      supabase;
      constructor() {
            this.supabase = createClient(secret.supabase_url, secret.supabase_anon_key);
      }

      async createPost({ title, content, tags, coverImage, readingTime, author, authorName }) {
            try {
                  const { data, error } = await this.supabase
                        .from(secret.article_table)
                        .insert([
                              {
                                    title: title.trim(),
                                    content: content.trim(),
                                    tags,
                                    coverImage,
                                    readingTime,
                                    author,
                                    authorName,
                              },
                        ])
                        .select()
                        .single();

                  if (error) throw error;
                  return data;
            } catch (error) {
                  console.log("Unable to make a post:", error.message);
            }
      }

      async updatePost(id, updatedFields) {
            try {
                  const { data, error } = await this.supabase
                        .from(secret.article_table)
                        .update({ ...updatedFields })
                        .eq("id", id)
                        .select()
                        .single();

                  if (error) throw error;
                  return data;
            } catch (error) {
                  console.log("Unable to update the post:", error.message);
            }
      }

      async deletePost(id) {
            try {
                  const { error } = await this.supabase.from(secret.article_table).delete().eq("id", id);

                  if (error) throw error;
                  return true;
            } catch (error) {
                  console.log("Unable to delete the post:", error.message);
                  return false;
            }
      }

      async getSinglePost(id) {
            try {
                  const { data, error } = await this.supabase.from(secret.article_table).select("*").eq("id", id).single();

                  if (error) throw error;
                  if (data) return data;
                  else console.log("Post not found for id:", id);
            } catch (error) {
                  console.log("Unable to get the post:", error.message);
            }
      }

      async listPosts() {
            try {
                  const { data, error } = await this.supabase.from(secret.article_table).select("*");
                  if (error) throw error;
                  return data;
            } catch (error) {
                  console.log("Unable to get list of posts:", error.message);
            }
      }

      // ─── Image Storage Operations ──────────────────────────────────────────────
      async createFile(file) {
            try {
                  const fileExt = file.name.split(".").pop();
                  const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                  const { data, error } = await this.supabase.storage.from(secret.image_bucket).upload(filePath, file, { cacheControl: "3600", upsert: false });

                  if (error) throw error;
                  return data;
            } catch (error) {
                  console.log("Unable to upload image:", error.message);
            }
      }

      // Returns the public URL string directly (bucket must be set to public in Supabase dashboard)
      getFileView(filePath) {
            try {
                  const { data } = this.supabase.storage.from(secret.image_bucket).getPublicUrl(filePath);
                  return data.publicUrl;
            } catch (error) {
                  console.log("Unable to get file URL:", error.message);
            }
      }

      async deleteFile(filePath) {
            try {
                  const { error } = await this.supabase.storage.from(secret.image_bucket).remove([filePath]); // takes an array of paths

                  if (error) throw error;
                  return true;
            } catch (error) {
                  console.log("Unable to delete image:", error.message);
                  return false;
            }
      }

      // Supabase Storage doesn't have a direct "updateFile" — you re-upload with upsert: true
      async updateFile(filePath, newFile) {
            try {
                  const { data, error } = await this.supabase.storage.from(secret.image_bucket).upload(filePath, newFile, { cacheControl: "3600", upsert: true });
                  if (error) throw error;
                  return data;
            } catch (error) {
                  console.log("Unable to update image:", error.message);
            }
      }
}

const documentService = new DocumentService();
export default documentService;
