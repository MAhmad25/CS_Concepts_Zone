import { Link, useNavigate, useParams } from "react-router-dom";
import { Post, PostDetailSkeleton, TrashIcon } from "../components/index";
import { useState, useEffect } from "react";
import documentService from "../app/DocService";
import { sileo } from "sileo";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../store/reducers/postsSlice";
import parse from "html-react-parser";
import useFileView from "../hooks/useFileView";
import dateConversion from "../utils/dateConversion";

const ViewPost = () => {
      const [postData, setPostData] = useState(null);
      const allPosts = useSelector((state) => state.posts.posts);
      document.title = postData?.title || "Fetching Post...";
      const { id } = useParams();
      const navigate = useNavigate();
      const userData = useSelector((state) => state.auth.userData);
      const dispatch = useDispatch();
      const isAdmin = postData ? (userData ? (userData?.id === postData?.author) === true : false) : false;
      const { url } = useFileView(postData);
      const getPostData = async () => {
            const post = await documentService.getSinglePost(id);
            setPostData(post);
      };
      useEffect(() => {
            window.scrollTo(0, 0);
            getPostData();
      }, [id]);
      const handlePostDeletion = async () => {
            if (id) {
                  const isPostDeleted = await documentService.deletePost(id);
                  const isFileDeleted = await documentService.deleteFile(postData?.coverImage);
                  dispatch(deletePost(id));
                  if (isPostDeleted && isFileDeleted) {
                        sileo.success({
                              title: "Post Deleted",
                              fill: "black",
                              description: "This action cannot be undone !",
                              styles: {
                                    title: "text-white!",
                                    description: "text-white/75!",
                              },
                        });
                        navigate("/journals");
                  } else sileo.error({ title: "Sorry we cannot delete this post" });
            }
      };
      return postData ? (
            <section className="w-full px-5 font-primary-text min-h-svh text-[var(--color-bl)] bg-[var(--color-wht)]">
                  {/* Top Section */}
                  <section className="w-full pt-28 flex flex-col lg:flex-row">
                        {/* Left Section */}
                        <div className="lg:w-3/4 xl:px-10 py-2 space-y-5">
                              <h1 className="font-cool  md:w-1/2   font-black text-3xl sm:text-5xl  tracking-tight ">{postData?.title} </h1>
                              <h3 className="px-3 py-1  border-[1px] w-fit  rounded-full tracking-tight leading-none">Written by: {postData?.authorName}</h3>
                              {isAdmin && (
                                    <div className="flex gap-5 items-center">
                                          <Link className="sm:px-4 p-3 text-sm sm:text-lg sm:py-2 rounded-xl bg-[var(--color-bl)] text-[var(--color-wht)]" to={`/u/edit-post/${id}`}>
                                                Edit
                                          </Link>
                                          <button onClick={handlePostDeletion} className="sm:px-4 flex justify-center items-center cursor-pointer p-3 text-sm sm:text-lg sm:py-2 rounded-xl  text-red-400">
                                                <TrashIcon />
                                                <p>Delete</p>
                                          </button>
                                    </div>
                              )}
                        </div>
                        <div className="md:w-1/4 w-full  py-10 space-y-5">
                              <p className="text-sm uppercase text-[var(--color-bl)]/60 whitespace-nowrap">
                                    Date <br />
                                    <span className="text-[var(--color-bl)]">{dateConversion(postData?.created_at)}</span>
                              </p>
                              <p className="text-sm uppercase text-[var(--color-bl)]/60 whitespace-nowrap">
                                    Reading time
                                    <br />
                                    <span className="text-[var(--color-bl)] lowercase ">{postData?.readingTime} min read</span>
                              </p>
                              <div className="flex-wrap  w-full flex gap-2">
                                    {postData?.tags?.map((value) => (
                                          <div key={value} className="px-3 py-1 border-[1px] rounded-full tracking-tight leading-none">
                                                {value}
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>
                  {/* Actual Content Section */}
                  <section className="w-full border-t-[1px] mt-10 lg:px-20 border-[var(--color-bl)] py-5">
                        {/* Featured image */}
                        <div className="w-full lg:h-[30rem]  overflow-hidden rounded lg:bg-transparent bg-zinc-300">{url ? <img className="w-full h-full object-contain" src={url} alt="Cover Image" /> : <div className="w-full h-full flex items-center justify-center text-gray-500">Loading image...</div>}</div>
                        {/* HTML Content goes here */}
                        <div className="py-16 lg:px-40 overflow-hidden break-words">{!!postData?.content && parse(postData?.content)}</div>
                        <h1 className="font-black text-5xl sm:text-7xl tracking-tight text-center  font-cool  my-5">Related Posts</h1>
                        <section className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 ">{allPosts?.length > 0 ? allPosts?.map((eachPost) => eachPost.id != id && <Post key={eachPost.id} postData={eachPost} />).slice(0, 3) : <div className=" text-center text-2xl px-10 col-span-full place-self-center ">No Post Available! Be the first One to write a Post</div>}</section>
                  </section>
            </section>
      ) : (
            <PostDetailSkeleton />
      );
};

export default ViewPost;
