import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Input, Loader } from "../components/index";
import { useForm } from "react-hook-form";
import appAuth from "../app/AuthService";
import { useScrollTop } from "./index.js";
import { useState } from "react";

const Signup = () => {
      useScrollTop();
      const [email, setEmail] = useState("");
      document.title = "CS Core | Create an account now";
      const navigate = useNavigate();
      const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
      } = useForm();
      const accountCreation = async (data) => {
            try {
                  const userData = await appAuth.createAccount(data);
                  if (userData) {
                        setEmail(data.email);
                        navigate("/create-account/verify");
                  }
            } catch (error) {
                  console.log("Account Creation Failed: ", error.message);
            }
      };
      return (
            <section className=" min-h-[calc(100svh-5rem)] flex text-[var(--color-bl)] pt-20 font-primary-text justify-center items-center bg-[var(--color-wht)] ">
                  <div className="w-full sm:w-1/2  grid place-content-center h-full">
                        {email.length == 0 ? (
                              <>
                                    <h1 className="text-4xl text-center font-secondary-text sm:text-5xl">Create an account</h1>
                                    <p className="whitespace-nowrap text-center">Enter your information to get started</p>
                                    <form onSubmit={handleSubmit(accountCreation)} className="grid  gap-3 place-content-center w-full h-full mt-5 grid-cols-2">
                                          {/* Username */}
                                          <Input {...register("username", { required: "Username is required", minLength: { value: 2, message: "Atleast 2 characters" } })} label={"Username"} type={"text"} placeholder={"Enter your display name"} star={true} disabled={isSubmitting} />
                                          {errors.username && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.username.message}</span>}
                                          {/* Email */}
                                          <Input {...register("email", { required: "Email is required" })} label={"Email"} type={"email"} placeholder={"Enter your email"} star={true} disabled={isSubmitting} />
                                          {errors.email && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.email.message}</span>}
                                          {/* Password */}
                                          <Input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Must be 8 characters long" } })} label={"Password"} type={"password"} placeholder={"Create a 8 length of password"} star={true} disabled={isSubmitting} />
                                          {errors.password && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.password.message}</span>}
                                          <button disabled={isSubmitting} type="submit" className={`px-3 col-span-2 flex justify-center items-center py-2 border-[1px] text-[var(--color-wht)] font-medium bg-[var(--color-bl)]  rounded-xl  ${isSubmitting ? "opacity-60  cursor-none" : "cursor-pointer opacity-100"}`}>
                                                {isSubmitting ? <Loader /> : "Create account"}
                                          </button>
                                    </form>
                                    <Link className="mt-10 flex gap-2 items-center justify-center underline" to="/login">
                                          <p className="text-lg">Already have an account ?</p>
                                    </Link>
                              </>
                        ) : (
                              <Outlet context={{ email }} />
                        )}
                  </div>
            </section>
      );
};

export default Signup;
