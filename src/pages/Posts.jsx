import { Post, RTELoader } from "../components/index";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { useScrollTop } from "./index.js";

const Posts = () => {
      useScrollTop();
      document.title = "CS Core | Journals";
      const allPosts = useSelector((state) => state.posts.posts);
      const [searchTerm, setSearchTerm] = useState("");
      const filteredPosts = useMemo(() => {
            if (!searchTerm.trim()) {
                  return allPosts;
            }
            return allPosts.filter((post) => {
                  const searchLower = searchTerm.toLowerCase();
                  const titleMatch = post?.title?.toLowerCase().includes(searchLower);
                  const tagMatch = post?.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
                  return titleMatch || tagMatch;
            });
      }, [allPosts, searchTerm]);
      const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
      };
      return (
            <section className="w-full space-y-5 px-5 min-h-screen py-10 font-primary-text text-[var(--color-bl)] ">
                  <div className="flex justify-center items-center mt-10 flex-col gap-10 w-full">
                        <h1 className="font-black text-5xl sm:text-7xl tracking-tight font-cool text-center">Journals</h1>
                        <p className="font-ppneue sm:w-1/2 text-center text-xl sm:text-2xl">Real articles from real people — prepping for interviews, revising for exams, or just sharing what clicked for them</p>
                  </div>

                  {/* Tags and Search */}
                  <div className="w-full flex flex-col sm:flex-row gap-5 sm:gap-0 justify-end">
                        {/* <div className="flex h-fit gap-3 flex-wrap w-3/4">
                              {["All", "Design", "Technology", "Creativity", "Business", "Accessibility"].map((tag, index) => (
                                    <Link to={`/category/${tag}`} key={index} className="px-3 py-1 border-[1px] text-lg rounded-full tracking-tight leading-none hover:bg-gray-100 transition-colors">
                                          {tag}
                                    </Link>
                              ))}
                        </div> */}

                        <div className="relative">
                              <input className="px-4 py-2 block border-b-2 rounded outline-none focus:border-[var(--color-bl)] transition-colors" type="text" placeholder="Search posts..." value={searchTerm} onChange={handleSearchChange} />
                              {searchTerm && (
                                    <button onClick={() => setSearchTerm("")} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700" title="Clear search">
                                          ✕
                                    </button>
                              )}
                        </div>
                  </div>
                  {searchTerm && <div className="text-center text-[var(--color-bl)]">{filteredPosts.length > 0 ? `Found ${filteredPosts.length} post${filteredPosts.length === 1 ? "" : "s"} matching "${searchTerm}"` : `No posts found matching "${searchTerm}"`}</div>}
                  {/* All Posts */}
                  <section className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts?.length > 0 ? (
                              filteredPosts.map((eachPost) => <Post key={eachPost?.id} postData={eachPost} />)
                        ) : allPosts?.length === 0 ? (
                              <div className="mx-auto col-span-full">
                                    <RTELoader />
                                    <p className="text-center">Fetching all posts...</p>
                              </div>
                        ) : (
                              <div className="mx-auto col-span-full text-center">
                                    <p className="text-xl text-gray-500">No posts match your search criteria</p>
                                    <button onClick={() => setSearchTerm("")} className="mt-2 px-4 py-2 bg-[var(--color-bl)] text-[var(--color-wht)] rounded hover:bg-black transition-colors">
                                          Clear Search
                                    </button>
                              </div>
                        )}
                  </section>
            </section>
      );
};

export default Posts;
