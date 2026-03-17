<img src="https://i.ibb.co/whPxFvMC/Screenshot-2026-02-06-214922.png" alt="Screenshot 2026 02 06 214922" border="0">

# CS Core | For Students

A place where CS students and self-taught devs write about the things that actually helped them — DSA patterns, OS concepts, DBMS internals, Networks, and interview questions explained like a human being wrote them.

Built with React + Vite and Supabase on the backend.

---

## What this is

Most CS content online is either a dry textbook or a YouTube video you have to watch at 2x speed the night before an interview. Minima is neither. It is a community platform where people write short, focused articles on core CS subjects — the kind you read when you are on the bus, taking a break, or quietly panicking before a technical round.

---

## What you can do here

| Action            | Details                                           |
| ----------------- | ------------------------------------------------- |
| Read articles     | OS, DBMS, Networks, DSA, Interview Q&A            |
| Write and publish | Rich text editor with cover image and tags        |
| Edit and manage   | Full CRUD on your own posts                       |
| Browse by topic   | Filter by tags across subjects                    |
| Account system    | Signup with OTP email verification, login, logout |

---

## Run it locally

**Clone the repo**

```sh
git clone https://github.com/MAhmad25/BlogWeb.git
```

````

**Install dependencies**

```sh
npm install
```

**Add your Supabase credentials to `src/config/secret.js`**

```js
const secret = {
      supabase_url: "your url here",
      supabase_anon_key: "your anon key here",
      article_table: "articles",
      image_bucket: "cover-images",
};
export default secret;
```

**Start the dev server**

```sh
npm run dev
```

Open `http://localhost:5173` and create an account.

---

## Project structure

```
src/
├── app/              AuthService.js, DocService.js (Supabase)
├── components/       Reusable UI, editor, tag selector, skeletons
├── pages/            Home, Login, Signup, OTP verify, WritePost, EditPost, ViewPost, 404
├── Routes/           Route setup and Protected route wrapper
├── store/            Redux store, auth slice, posts slice
└── hooks/            useScrollTop and other shared hooks
```

---

## How it works under the hood

- Auth is handled through Supabase — signup sends an OTP to the user's email for verification before the account is active
- Posts live in a Supabase Postgres table, cover images go into a Supabase storage bucket
- Redux manages auth state, post list, and loading across the app
- Protected routes check the auth slice before rendering any page that requires login

---

## Extend it

- **Add a new subject tag** — update the tag list in `src/components/TagSelector.jsx`
- **Add post metadata** — reading time, difficulty level, subject category live in `src/app/DocService.js`

---

## License

MIT


