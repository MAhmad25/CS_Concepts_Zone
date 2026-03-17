import { Link } from "react-router-dom";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import { PiBookOpen } from "react-icons/pi";
import { Post, CardSkeleton } from "../components/index.js";
import { useScrollTop } from "./index.js";
import { BsArrowRightShort } from "react-icons/bs";
import { useSelector } from "react-redux";

const Home = () => {
      document.title = "CS Core | CS Concepts & Interview Prep";
      useScrollTop();
      const allPosts = useSelector((state) => state.posts.posts);
      return (
            <section className="w-full px-5 font-primary-text text-[var(--color-bl)] flex flex-col pt-34 gap-14 items-center">
                  <h1 className="font-cool text-center sm:w-1/2 font-black text-5xl sm:text-7xl tracking-tight">CS stuff, explained by people who actually get it</h1>
                  <p className="font-ppneue text-center sm:w-1/2 text-xl sm:text-2xl">OS, DBMS, Networks, DSA written by students and devs who just went through it</p>
                  {/* Buttons */}
                  <div className="flex flex-wrap justify-center gap-2">
                        {["Read before the interview 💀", "Open when panicking", "Better than your notes"].map((tag, i) => (
                              <span key={i} className="border-[1px] border-[var(--color-bl)]/40 text-sm px-3 py-1 rounded-full">
                                    {tag}
                              </span>
                        ))}
                  </div>
                  <div className="flex gap-4">
                        <Link className="sm:px-4 p-3 text-sm sm:text-lg sm:py-2 rounded-xl bg-[var(--color-bl)] text-[var(--color-wht)]" to="/write-post">
                              Write an article
                        </Link>
                        <Link className="sm:px-4 p-3 text-sm sm:text-lg sm:py-2 rounded-xl border-[1px] bg-transparent" to="/journals">
                              Start reading
                        </Link>
                  </div>
                  {/* Tags */}
                  <div className="flex w-full gap-2 justify-center flex-wrap sm:gap-5 py-10">
                        {[
                              { color: "bg-green-600", text: "OS & Networks" },
                              { color: "bg-blue-600", text: "DSA" },
                              { color: "bg-purple-600", text: "Interview Q&A" },
                        ].map((obj, index) => (
                              <div key={index} className="flex gap-2 justify-center items-center">
                                    <div className={`rounded-full w-2 h-2 ${obj.color}`}></div>
                                    <p className="text-xl font-light">{obj.text}</p>
                              </div>
                        ))}
                  </div>
                  {/* Stats */}
                  <div className="w-full flex justify-center-safe flex-wrap gap-16 items-center border-y-[1px] border-[var(--color-bl)]/40 px-10 py-10">
                        {[
                              { icon: FaArrowTrendUp, bold: "50K+", para: "Students reached" },
                              { icon: GoPeople, bold: "1,200+", para: "Writers & contributors" },
                              { icon: PiBookOpen, bold: "15K+", para: "Articles published" },
                        ].map((obj, index) => (
                              <div key={index} className="flex flex-col gap-3 items-center">
                                    <span className="border-[1px] rounded-full p-5">
                                          <obj.icon size="1.3rem" />
                                    </span>
                                    <h2 className="text-2xl">{obj.bold}</h2>
                                    <p>{obj.para}</p>
                              </div>
                        ))}
                  </div>
                  <div className="w-full py-20 space-y-16 min-h-screen">
                        <div className="w-full flex flex-col items-center justify-center gap-5">
                              <h1 className="text-5xl font-cool text-center font-black sm:text-7xl">Fresh from the community</h1>
                              <p className="text-center text-sm sm:text-lg sm:w-[40%] leading-none">Real articles from real people — prepping for interviews, revising for exams, or just sharing what clicked for them</p>
                        </div>
                        {/* Cards */}
                        <section className="w-full grid gap-5 grid-cols-1 py-10 sm:grid-cols-2 lg:grid-cols-3">{allPosts?.length > 0 ? allPosts?.map((eachPost) => <Post key={eachPost.id} postData={eachPost} />).slice(0, 3) : Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</section>
                        <div className="w-full flex flex-col justify-center items-center h-fit">
                              <Link className="justify-center items-center flex border text-xl md:text-2xl px-5 py-2 rounded-xl bg-transparent" to="/journals">
                                    <p>Read everything</p>
                                    <BsArrowRightShort size={"2rem"} />
                              </Link>
                        </div>
                  </div>
            </section>
      );
};

export default Home;
