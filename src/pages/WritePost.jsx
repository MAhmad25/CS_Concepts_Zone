import { useNavigate } from "react-router-dom";
import { Input, FormTagSelector } from "../components/index";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import docService from "../app/DocService";
import { setLoadingFalse, setLoadingTrue } from "../store/reducers/loadingSlice";
import { useEffect, useRef, useState } from "react";
import { setNewPost, updatePost } from "../store/reducers/postsSlice";
import { useScrollTop } from "./index.js";
import { useWebHaptics } from "web-haptics/react";
import Editor from "../components/Editor.jsx";

const WritePost = ({ editPost }) => {
      const { trigger } = useWebHaptics({ debug: true });
      useScrollTop();
      document.title = "Minima | Write your post";
      const navigate = useNavigate();
      const userData = useSelector((state) => state.auth.userData);
      const dispatch = useDispatch();
      // preview URL for selected image (object URL or existing URL)
      const [preview, setPreview] = useState(null);
      const prevUrlRef = useRef(null);
      const editorRef = useRef(null);
      const {
            register,
            handleSubmit,
            control,
            reset,
            formState: { errors },
      } = useForm({
            defaultValues: {
                  title: "",
                  slug: "",
                  content: "",
                  tags: [],
                  coverImage: "",
                  readingTime: 1,
            },
      });
      if (Object.keys(errors).length != 0) {
            trigger([{ duration: 40 }, { delay: 40, duration: 40 }, { delay: 40, duration: 40 }], { intensity: 0.9 });
      }
      // if editing and editPost.coverImage is already a URL, show it.
      // If your coverImage is not a URL but an id, replace this with a fetch to get the file URL.
      useEffect(() => {
            if (editPost) {
                  reset({
                        title: editPost.title || "",
                        slug: editPost.slug || "",
                        content: editPost.content || "",
                        tags: editPost.tags || [],
                        coverImage: editPost?.coverImage || "",
                        readingTime: editPost.readingTime || 1,
                  });
                  if (editPost?.coverImage) {
                        setPreview(docService.getFileView(editPost?.coverImage));
                  }
            }
      }, [editPost, reset]);

      const coverImageRegister = register("coverImage", { required: editPost ? false : "Image is required" });

      const handleFileChange = (e) => {
            coverImageRegister.onChange(e);
            const file = e.target.files?.[0];
            if (file) {
                  if (prevUrlRef.current && prevUrlRef.current.startsWith("blob:")) {
                        URL.revokeObjectURL(prevUrlRef.current);
                  }
                  const url = URL.createObjectURL(file);
                  prevUrlRef.current = url;
                  setPreview(url);
            } else {
                  if (prevUrlRef.current && prevUrlRef.current.startsWith("blob:")) {
                        URL.revokeObjectURL(prevUrlRef.current);
                  }
                  prevUrlRef.current = null;
                  setPreview(null);
            }
      };

      useEffect(() => {
            return () => {
                  if (prevUrlRef.current && prevUrlRef.current.startsWith("blob:")) {
                        URL.revokeObjectURL(prevUrlRef.current);
                  }
            };
      }, []);

      const formSubmittingToDb = async (data) => {
            dispatch(setLoadingTrue());
            const contentHTML = await editorRef.current?.getHTML?.();
            const finalData = { ...data, content: contentHTML ?? "" };
            if (editPost) {
                  const hasNewImage = finalData.coverImage && finalData.coverImage.length > 0 && finalData.coverImage[0];
                  const newFile = hasNewImage && (await docService.createFile(finalData.coverImage[0]));
                  if (newFile) {
                        await docService.deleteFile(editPost?.coverImage);
                  }
                  const updatedPost = await docService.updatePost(editPost.$id, { ...finalData, coverImage: newFile ? newFile.$id : editPost?.coverImage });
                  if (updatedPost) {
                        dispatch(updatePost({ id: editPost.$id, updatedPost }));
                        dispatch(setLoadingFalse());
                        navigate(`/journals/${updatedPost.$id}`);
                  }
            } else {
                  const newFile = finalData.coverImage[0] && (await docService.createFile(finalData.coverImage[0]));
                  if (newFile) {
                        const newPost = await docService.createPost({ ...finalData, coverImage: newFile.$id, author: userData.$id, authorName: userData.name });
                        if (newPost) {
                              dispatch(setNewPost(newPost));
                              dispatch(setLoadingFalse());
                              navigate(`/journals/${newPost.$id}`);
                        }
                  }
            }
      };
      return (
            <section className="w-full py-10 lg:px-10 min-h-svh  font-primary-text  text-[var(--color-bl)]">
                  {/* Input Section for Post image */}
                  <form onSubmit={handleSubmit(formSubmittingToDb)} className="space-y-5">
                        <h1 className="font-cool mt-10 md:text-5xl text-3xl text-center font-extrabold">{editPost ? "Edit" : "Write"}</h1>
                        <div className="flex space-y-10  justify-center items-center flex-col">
                              <div onClick={() => document.getElementById("featured-image")?.click()} className="border-2  cursor-pointer  container border-dashed  border-border rounded-lg p-8  text-center">
                                    <div className="flex flex-col items-center gap-2">
                                          {preview ? (
                                                <img src={preview} alt="Featured preview" className="max-h-48 w-full object-cover rounded" />
                                          ) : (
                                                <>
                                                      <p className="text-muted-foreground">Click to upload or drag and drop</p>
                                                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                                                </>
                                          )}
                                          <Input {...coverImageRegister} id="featured-image" type="file" star={true} className="hidden" accept="image/*" onChange={handleFileChange} />
                                          <button className="cursor-pointer" type="button">
                                                Select Image
                                          </button>
                                    </div>
                              </div>
                              {errors.coverImage && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.coverImage.message}</span>}
                              {/* user Input */}
                              <section className="w-full flex  overflow-hidden justify-center flex-col items-center">
                                    <div className="gap-3 w-full h-full mt-5 space-y-10 px-5">
                                          <div className="w-full flex  flex-col">
                                                <label htmlFor="headline"></label>
                                                <textarea className="w-full py-2 resize-none min-h-12 sm:text-4xl text-2xl max-h-48 [field-sizing:content] h-auto font-medium placeholder:text-[#cfcfcf] rounded outline-none" rows={1} {...register("title", { required: "Title is required", minLength: { value: 10, message: "Atleast 10 characters" } })} label={"Main Headline"} type={"text"} placeholder={"Title of your post"} />
                                                {errors.title && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.title.message}</span>}
                                          </div>
                                          {editPost && <hr />}

                                          <div className=" w-full overflow-hidden">
                                                <Editor ref={editorRef} initialHTML={editPost?.content || ""} />
                                          </div>
                                          <div className="mt-10 w-[27rem]  gap-5 flex">
                                                <div>
                                                      <Input type="number" {...register("readingTime", { required: "Invalid Value: Must be a number", min: { value: 1, message: "Min 1 minute time" }, max: { value: 30, message: "Max 30 minutes time" }, valueAsNumber: true })} placeholder="Time in minutes" label={"Reading Time"} className="w-full" star={true} />
                                                      {errors.readingTime && <span className="text-red-500 text-xs sm:text-sm tracking-tight leading-none">{errors.readingTime.message}</span>}
                                                </div>
                                          </div>
                                          <FormTagSelector name="tags" control={control} label="Select Tags" error={errors.tags} required />
                                    </div>
                              </section>
                              <button className="px-3  col-span-2 py-2 border-[1px] text-[var(--color-wht)] font-medium bg-[var(--color-bl)] rounded-xl cursor-pointer">{editPost ? "Edit Post" : "Publish Post"}</button>
                        </div>
                  </form>
            </section>
      );
};

export default WritePost;
