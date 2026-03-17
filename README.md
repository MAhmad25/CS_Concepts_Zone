<img src="https://i.ibb.co/whPxFvMC/Screenshot-2026-02-06-214922.png" alt="Screenshot 2026 02 06 214922" border="0">

# 📝 Minima Blog

A modern, minimalist fullstack blog platform built with **React**, **Vite**, **TailwindCSS**, **Redux**, and **Appwrite** as the backend server. Effortlessly create, edit, and share beautiful posts with a clean, distraction-free interface.

---

## ✨ Features

- **Fullstack** architecture powered by Appwrite (database, auth, storage)
- Minimalist, responsive UI with custom fonts and smooth layouts
- Rich text editor for writing posts
- Authentication (signup, login, logout)
- Post CRUD: create, edit, delete, view
- Image upload and preview for posts
- Tag selection and filtering
- Loader and feedback components for smooth UX
- 404 page and protected routes

---

## 🚀 Getting Started

1. **Clone the repository:**
      ```sh
      git clone https://github.com/MAhmad25/BlogWeb.git
      ```
2. **Install dependencies:**
      ```sh
      npm install
      ```
3. **Configure your Appwrite server** and update `src/config/Keys.js` with your credentials.
4. **Start the development server:**
      ```sh
      npm run dev
      ```

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Redux, React Router, Styled Components
- **Backend:** Appwrite (Database, Auth, Storage)
- **Other:** GSAP (animations), Tinymce (rich text editor), React Toast Sileo (notifications)

---

## 📁 Project Structure

```
src/
  app/           # Appwrite service logic (CRUD, storage)
  components/    # UI components (Nav, Footer, Post, RTE, etc.)
  config/        # Keys and config files
  hooks/         # Custom React hooks
  pages/         # Page components (Home, Login, Signup, ViewPost, etc.)
  Routes/        # Route protection and app routing
  store/         # Redux store and slices
  utils/         # Utility functions
```

---

## 🔒 Authentication & Backend

All authentication, post management, and file storage are handled via **Appwrite**. You must set up your own Appwrite server and update `src/config/Keys.js` with your project, database, and bucket IDs.

---

## 🎨 UI & Styling

The UI is crafted with a focus on minimalism and readability. Custom fonts and TailwindCSS are used for a modern look. Components are modular and easy to extend.

---

## 🙌 Contributing

Pull requests and suggestions are welcome! Please open issues for bugs or feature requests.

---

## 📄 License

This project is open source under the MIT License.

---

Made with ❤️ by Ahmad Latif
