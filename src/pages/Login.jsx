import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import appAuth from "../app/AuthService";
import { Input, Loader } from "../components/index";
import { login } from "../store/reducers/authSlice";
import { sileo } from "sileo";
import { useScrollTop } from "./index.js";

function Pupil({ size = 12, maxDistance = 5, pupilColor = "#2D2D2D", forceLookX, forceLookY }) {
      const [mouse, setMouse] = useState({ x: 0, y: 0 });
      const ref = useRef(null);

      useEffect(() => {
            const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
            window.addEventListener("mousemove", h);
            return () => window.removeEventListener("mousemove", h);
      }, []);

      const getPos = () => {
            if (!ref.current) return { x: 0, y: 0 };
            if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
            const rect = ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mouse.x - cx;
            const dy = mouse.y - cy;
            const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
            const angle = Math.atan2(dy, dx);
            return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
      };

      const pos = getPos();
      return (
            <div
                  ref={ref}
                  style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: pupilColor,
                        borderRadius: "50%",
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                        transition: "transform 0.1s ease-out",
                  }}
            />
      );
}

function EyeBall({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "#2D2D2D", isBlinking = false, forceLookX, forceLookY }) {
      const [mouse, setMouse] = useState({ x: 0, y: 0 });
      const ref = useRef(null);

      useEffect(() => {
            const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
            window.addEventListener("mousemove", h);
            return () => window.removeEventListener("mousemove", h);
      }, []);

      const getPos = () => {
            if (!ref.current) return { x: 0, y: 0 };
            if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
            const rect = ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mouse.x - cx;
            const dy = mouse.y - cy;
            const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
            const angle = Math.atan2(dy, dx);
            return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
      };

      const pos = getPos();
      return (
            <div
                  ref={ref}
                  style={{
                        width: `${size}px`,
                        height: isBlinking ? "2px" : `${size}px`,
                        backgroundColor: eyeColor,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        transition: "all 0.15s",
                  }}
            >
                  {!isBlinking && (
                        <div
                              style={{
                                    width: `${pupilSize}px`,
                                    height: `${pupilSize}px`,
                                    backgroundColor: pupilColor,
                                    borderRadius: "50%",
                                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                                    transition: "transform 0.1s ease-out",
                              }}
                        />
                  )}
            </div>
      );
}

function CharactersScene({ isTypingEmail, password, showPassword }) {
      const [mouse, setMouse] = useState({ x: 0, y: 0 });
      const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
      const [isBlackBlinking, setIsBlackBlinking] = useState(false);
      const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
      const [isPurplePeeking, setIsPurplePeeking] = useState(false);

      const purpleRef = useRef(null);
      const blackRef = useRef(null);
      const yellowRef = useRef(null);
      const orangeRef = useRef(null);

      useEffect(() => {
            const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
            window.addEventListener("mousemove", h);
            return () => window.removeEventListener("mousemove", h);
      }, []);

      useEffect(() => {
            const schedule = () => {
                  const t = setTimeout(
                        () => {
                              setIsPurpleBlinking(true);
                              setTimeout(() => {
                                    setIsPurpleBlinking(false);
                                    schedule();
                              }, 150);
                        },
                        Math.random() * 4000 + 3000,
                  );
                  return t;
            };
            const t = schedule();
            return () => clearTimeout(t);
      }, []);

      useEffect(() => {
            const schedule = () => {
                  const t = setTimeout(
                        () => {
                              setIsBlackBlinking(true);
                              setTimeout(() => {
                                    setIsBlackBlinking(false);
                                    schedule();
                              }, 150);
                        },
                        Math.random() * 4000 + 3000,
                  );
                  return t;
            };
            const t = schedule();
            return () => clearTimeout(t);
      }, []);

      useEffect(() => {
            if (isTypingEmail) {
                  setIsLookingAtEachOther(true);
                  const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
                  return () => clearTimeout(t);
            } else {
                  setIsLookingAtEachOther(false);
            }
      }, [isTypingEmail]);

      useEffect(() => {
            if (password.length > 0 && showPassword) {
                  const t = setTimeout(
                        () => {
                              setIsPurplePeeking(true);
                              setTimeout(() => setIsPurplePeeking(false), 800);
                        },
                        Math.random() * 3000 + 2000,
                  );
                  return () => clearTimeout(t);
            } else {
                  setIsPurplePeeking(false);
            }
      }, [password, showPassword, isPurplePeeking]);

      const calcPos = (ref) => {
            if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
            const rect = ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 3;
            const dx = mouse.x - cx;
            const dy = mouse.y - cy;
            return {
                  faceX: Math.max(-15, Math.min(15, dx / 20)),
                  faceY: Math.max(-10, Math.min(10, dy / 30)),
                  bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
            };
      };

      const purplePos = calcPos(purpleRef);
      const blackPos = calcPos(blackRef);
      const yellowPos = calcPos(yellowRef);
      const orangePos = calcPos(orangeRef);

      const hidingPassword = password.length > 0 && !showPassword;
      const revealingPassword = password.length > 0 && showPassword;

      return (
            <div className="flex items-end justify-center w-full lg:w-[35%]" style={{ height: "200px" }}>
                  <div className="relative" style={{ width: "360px", height: "200px" }}>
                        {/* Purple – back */}
                        <div
                              ref={purpleRef}
                              className="absolute bottom-0 transition-all duration-700 ease-in-out"
                              style={{
                                    left: "40px",
                                    width: "115px",
                                    height: isTypingEmail || hidingPassword ? "230px" : "200px",
                                    backgroundColor: "#6C3FF5",
                                    borderRadius: "7px 7px 0 0",
                                    zIndex: 1,
                                    transform: revealingPassword ? "skewX(0deg)" : isTypingEmail || hidingPassword ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(26px)` : `skewX(${purplePos.bodySkew || 0}deg)`,
                                    transformOrigin: "bottom center",
                              }}
                        >
                              <div
                                    className="absolute flex gap-5 transition-all duration-700 ease-in-out"
                                    style={{
                                          left: revealingPassword ? "12px" : isLookingAtEachOther ? "36px" : `${28 + purplePos.faceX}px`,
                                          top: revealingPassword ? "22px" : isLookingAtEachOther ? "42px" : `${26 + purplePos.faceY}px`,
                                    }}
                              >
                                    {[0, 1].map((i) => (
                                          <EyeBall key={i} size={14} pupilSize={5} maxDistance={4} eyeColor="white" isBlinking={isPurpleBlinking} forceLookX={revealingPassword ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={revealingPassword ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                                    ))}
                              </div>
                        </div>

                        {/* Black – middle */}
                        <div
                              ref={blackRef}
                              className="absolute bottom-0 transition-all duration-700 ease-in-out"
                              style={{
                                    left: "152px",
                                    width: "76px",
                                    height: "160px",
                                    backgroundColor: "#2D2D2D",
                                    borderRadius: "5px 5px 0 0",
                                    zIndex: 2,
                                    transform: revealingPassword ? "skewX(0deg)" : isLookingAtEachOther ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(12px)` : isTypingEmail || hidingPassword ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` : `skewX(${blackPos.bodySkew || 0}deg)`,
                                    transformOrigin: "bottom center",
                              }}
                        >
                              <div
                                    className="absolute flex gap-4 transition-all duration-700 ease-in-out"
                                    style={{
                                          left: revealingPassword ? "6px" : isLookingAtEachOther ? "20px" : `${16 + blackPos.faceX}px`,
                                          top: revealingPassword ? "18px" : isLookingAtEachOther ? "8px" : `${20 + blackPos.faceY}px`,
                                    }}
                              >
                                    {[0, 1].map((i) => (
                                          <EyeBall key={i} size={12} pupilSize={5} maxDistance={3} eyeColor="white" isBlinking={isBlackBlinking} forceLookX={revealingPassword ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={revealingPassword ? -4 : isLookingAtEachOther ? -4 : undefined} />
                                    ))}
                              </div>
                        </div>

                        {/* Orange – front left */}
                        <div
                              ref={orangeRef}
                              className="absolute bottom-0 transition-all duration-700 ease-in-out"
                              style={{
                                    left: "0px",
                                    width: "155px",
                                    height: "115px",
                                    zIndex: 3,
                                    backgroundColor: "#FF9B6B",
                                    borderRadius: "78px 78px 0 0",
                                    transform: revealingPassword ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
                                    transformOrigin: "bottom center",
                              }}
                        >
                              <div
                                    className="absolute flex gap-5 transition-all duration-200 ease-out"
                                    style={{
                                          left: revealingPassword ? "32px" : `${52 + (orangePos.faceX || 0)}px`,
                                          top: revealingPassword ? "52px" : `${56 + (orangePos.faceY || 0)}px`,
                                    }}
                              >
                                    {[0, 1].map((i) => (
                                          <Pupil key={i} size={10} maxDistance={4} forceLookX={revealingPassword ? -5 : undefined} forceLookY={revealingPassword ? -4 : undefined} />
                                    ))}
                              </div>
                        </div>

                        {/* Yellow – front right */}
                        <div
                              ref={yellowRef}
                              className="absolute bottom-0 transition-all duration-700 ease-in-out"
                              style={{
                                    left: "204px",
                                    width: "90px",
                                    height: "135px",
                                    backgroundColor: "#E8D754",
                                    borderRadius: "45px 45px 0 0",
                                    zIndex: 4,
                                    transform: revealingPassword ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
                                    transformOrigin: "bottom center",
                              }}
                        >
                              <div
                                    className="absolute flex gap-4 transition-all duration-200 ease-out"
                                    style={{
                                          left: revealingPassword ? "12px" : `${33 + (yellowPos.faceX || 0)}px`,
                                          top: revealingPassword ? "22px" : `${26 + (yellowPos.faceY || 0)}px`,
                                    }}
                              >
                                    {[0, 1].map((i) => (
                                          <Pupil key={i} size={10} maxDistance={4} forceLookX={revealingPassword ? -5 : undefined} forceLookY={revealingPassword ? -4 : undefined} />
                                    ))}
                              </div>
                              {/* Mouth */}
                              <div
                                    className="absolute rounded-full transition-all duration-200 ease-out"
                                    style={{
                                          width: "48px",
                                          height: "3px",
                                          backgroundColor: "#2D2D2D",
                                          left: revealingPassword ? "8px" : `${24 + (yellowPos.faceX || 0)}px`,
                                          top: revealingPassword ? "54px" : `${56 + (yellowPos.faceY || 0)}px`,
                                    }}
                              />
                        </div>
                  </div>
            </div>
      );
}

const Login = () => {
      document.title = "Login";
      useScrollTop();

      const dispatch = useDispatch();
      const navigate = useNavigate();

      const [showPassword, setShowPassword] = useState(false);
      const [isEmailFocused, setIsEmailFocused] = useState(false);
      const [passwordValue, setPasswordValue] = useState("");

      const {
            register,
            handleSubmit,
            watch,
            formState: { errors, isSubmitting },
      } = useForm();

      const watchedPassword = watch("password", "");
      useEffect(() => {
            setPasswordValue(watchedPassword || "");
      }, [watchedPassword]);

      const loginAccount = async (data) => {
            try {
                  const isLoggedIn = await appAuth.Login(data);
                  if (isLoggedIn) {
                        const userData = await appAuth.getCurrentUser();
                        if (userData.is_anonymous) {
                              sileo.info({
                                    title: "Email",
                                    fill: "black",
                                    description: "Your email is not verified !",
                                    styles: {
                                          title: "text-white!",
                                          description: "text-white/75!",
                                    },
                              });
                              await appAuth.Logout();
                              return;
                        } else {
                              dispatch(login(userData));
                              navigate("/journals");
                        }
                  } else
                        sileo.error({
                              title: "Login Error",
                              fill: "black",
                              description: "Invalid Login Credentials !",
                              styles: {
                                    title: "text-white!",
                                    description: "text-white/75!",
                              },
                        });
            } catch (error) {
                  sileo.error({
                        title: "Login Error",
                        fill: "black",
                        description: error.message,
                        styles: {
                              title: "text-white!",
                              description: "text-white/75!",
                        },
                  });
            }
      };

      const passwordRegister = register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Must be 8 characters" },
      });

      return (
            <section className="min-h-[calc(100svh-5rem)] flex text-[var(--color-bl)] pt-10 font-primary-text justify-center items-center ">
                  <div className="w-full px-5 lg:flex h-full lg:justify-center lg:items-center">
                        <CharactersScene isTypingEmail={isEmailFocused} password={passwordValue} showPassword={showPassword} />
                        <div className="lg:w-2/4 md:px-40 lg:px-30">
                              <h1 className="text-4xl text-center font-secondary-text sm:text-5xl mt-6">Welcome Back</h1>
                              <p className="whitespace-nowrap text-center">Enter your credentials to access your account</p>
                              <form onSubmit={handleSubmit(loginAccount)} className="grid gap-3 place-content-center w-full h-full mt-5 grid-cols-2">
                                    {/* Email */}
                                    <Input {...register("email", { required: true })} label="Email" type="email" placeholder="Enter your email" star={true} disabled={isSubmitting} onFocus={() => setIsEmailFocused(true)} onBlur={() => setIsEmailFocused(false)} />
                                    {errors.email && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">Email is required</span>}

                                    {/* Password */}
                                    <div className="col-span-2">
                                          <div className="col-span-2 relative">
                                                <Input
                                                      {...passwordRegister}
                                                      onChange={(e) => {
                                                            passwordRegister.onChange(e);
                                                            setPasswordValue(e.target.value);
                                                      }}
                                                      label="Password"
                                                      type={showPassword ? "text" : "password"}
                                                      placeholder="Enter your password"
                                                      star={true}
                                                      disabled={isSubmitting}
                                                      className="pr-10"
                                                />
                                                {/* Show / hide toggle */}
                                                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-700 transition-colors" tabIndex={-1}>
                                                      {showPassword ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.13.4-2.18 1.07-3.07M6.53 6.53A9.956 9.956 0 0112 5c5 0 9 4 9 7a9.956 9.956 0 01-1.53 3.47M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m3 3v.01M3 3l18 18" />
                                                            </svg>
                                                      ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                      )}
                                                </button>
                                          </div>
                                    </div>
                                    {errors.password && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.password.message}</span>}

                                    {/* Submit */}
                                    <button disabled={isSubmitting} type="submit" className={`px-3 col-span-2 flex justify-center items-center py-2 border-[1px] text-[var(--color-wht)] font-medium bg-[var(--color-bl)] rounded-xl ${isSubmitting ? "opacity-60 cursor-none" : "cursor-pointer opacity-100"}`}>
                                          {isSubmitting ? <Loader /> : "Login"}
                                    </button>
                              </form>

                              <Link className="mt-10 flex gap-2 items-center justify-center underline" to="/create-account">
                                    <p className="text-lg">Don't have an account ?</p>
                              </Link>
                        </div>
                  </div>
            </section>
      );
};

export default Login;
