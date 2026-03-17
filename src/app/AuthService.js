import { createClient } from "@supabase/supabase-js";
import secret from "../config/secret";

export class AuthService {
      supabase;

      constructor() {
            this.supabase = createClient(secret.supabase_url, secret.supabase_anon_key);
      }

      async verifyEmail(email, otp) {
            try {
                  const { error } = await this.supabase.auth.verifyOtp({
                        email,
                        token: otp,
                        type: "email",
                  });
                  if (error) throw error;
                  return true;
            } catch (error) {
                  console.log("Email verification failed:", error.message);
                  return false;
            }
      }

      async createAccount({ email, password, username }) {
            try {
                  const { error } = await this.supabase.auth.signUp({
                        email,
                        password,
                        options: {
                              data: { username },
                        },
                  });

                  if (error) throw error;
                  return true;
            } catch (error) {
                  console.log(error.message);
                  return false;
            }
      }

      async Login({ email, password }) {
            try {
                  const { error } = await this.supabase.auth.signInWithPassword({
                        email,
                        password,
                  });
                  if (error) throw error;
                  return true;
            } catch (error) {
                  console.log(error.message);
                  return false;
            }
      }

      async Logout() {
            try {
                  const { error } = await this.supabase.auth.signOut();
                  if (error) throw error;
                  return true;
            } catch (error) {
                  console.log("Unable to logout:", error.message);
            }
      }

      async getCurrentUser() {
            try {
                  const {
                        data: { user },
                        error,
                  } = await this.supabase.auth.getUser();
                  if (error) throw error;
                  return user ?? false;
            } catch (err) {
                  console.log("User is not logged in:", err.message);
                  return false;
            }
      }
}

const appAuth = new AuthService();
export default appAuth;
