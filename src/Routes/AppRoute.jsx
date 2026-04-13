import { Route, Routes } from "react-router-dom";
import { Login, Signup, Home, Posts, WritePost, ViewPost, EditPost, Page404 } from "../pages/index";
import { PillNav } from "../components/index";
import { lazy, Suspense, useEffect } from "react";
import appAuth from "../app/AuthService";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/reducers/authSlice";
import { showSkeletonFalse } from "../store/reducers/loadingSlice";
import Protected from "./Protected";
import useAllPosts from "../hooks/useAllPosts";
import { Toaster } from "sileo";
import VerifyEmail from "../components/OTP";
const LazyFooter = lazy(() => import("../components/Footer"));
const AppRoute = () => {
      const dispatch = useDispatch();
      useAllPosts();
      useEffect(() => {
            (async () => {
                  try {
                        const userData = await appAuth.getCurrentUser();
                        if (userData && !userData.is_anonymous) {
                              dispatch(login(userData));
                        } else {
                              dispatch(logout());
                        }
                        dispatch(showSkeletonFalse());
                  } catch (err) {
                        console.log(err.message);
                        dispatch(logout());
                  }
            })();
      }, [dispatch]);
      const menuItems = [
            { label: "Home", ariaLabel: "Go to home page", href: "/" },
            { label: "Journals", ariaLabel: "Read the journals", href: "/journals" },
      ];

      return (
            <>
                  <Toaster position="top-center" />
                  <PillNav items={menuItems} className="fixed top-0 hidden sm:flex" />
                  <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route
                              path="/login"
                              element={
                                    <Protected authentication={false}>
                                          <Login />
                                    </Protected>
                              }
                        />
                        <Route
                              path="/create-account"
                              element={
                                    <Protected authentication={false}>
                                          <Signup />
                                    </Protected>
                              }
                        >
                              <Route
                                    path="verify"
                                    element={
                                          <Protected authentication={false}>
                                                <VerifyEmail />
                                          </Protected>
                                    }
                              />
                        </Route>
                        <Route path="/journals" element={<Posts />} />
                        <Route path="/journals/:id" element={<ViewPost />} />
                        <Route
                              path="/u/edit-post/:id"
                              element={
                                    <Protected>
                                          <EditPost />
                                    </Protected>
                              }
                        />
                        <Route
                              path="/write-post"
                              element={
                                    <Protected>
                                          <WritePost />
                                    </Protected>
                              }
                        />
                        <Route path="*" element={<Page404 />} />
                  </Routes>
                  <div
                        className="absolute pointer-events-none inset-0 -z-10"
                        style={{
                              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6a7 2px, #f3f4f6a7 4px)",
                        }}
                  />
                  <Suspense fallback={<>Loading</>}>
                        <LazyFooter />
                  </Suspense>
            </>
      );
};

export default AppRoute;
