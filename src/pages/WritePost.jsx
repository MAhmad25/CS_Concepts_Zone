import { useNavigate } from "react-router-dom";
import { Input, RTE, FormTagSelector } from "../components/index";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import docService from "../app/DocService";
import { setLoadingFalse, setLoadingTrue } from "../store/reducers/loadingSlice";
import { useEffect, useRef, useState } from "react";
import { setNewPost, updatePost } from "../store/reducers/postsSlice";
import { useScrollTop } from "./index.js";
import { useWebHaptics } from "web-haptics/react";

const WritePost = ({ editPost }) => {
      const { trigger } = useWebHaptics();
      useScrollTop();
      document.title = "Minima | Write your post";
      const navigate = useNavigate();
      const userData = useSelector((state) => state.auth.userData);
      const dispatch = useDispatch();
      // preview URL for selected image (object URL or existing URL)
      const [preview, setPreview] = useState(null);
      const prevUrlRef = useRef(null);
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
      if (errors) {
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
            // Call react-hook-form's onChange so form still registers the file
            coverImageRegister.onChange(e);
            const file = e.target.files?.[0];
            if (file) {
                  // revoke previously created object URL
                  if (prevUrlRef.current && prevUrlRef.current.startsWith("blob:")) {
                        URL.revokeObjectURL(prevUrlRef.current);
                  }
                  const url = URL.createObjectURL(file);
                  prevUrlRef.current = url;
                  setPreview(url);
            } else {
                  // no file selected -> clear preview
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
            if (editPost) {
                  console.log(editPost);
                  const hasNewImage = data.coverImage && data.coverImage.length > 0 && data.coverImage[0];
                  const newFile = hasNewImage && (await docService.createFile(data.coverImage[0]));
                  if (newFile) {
                        await docService.deleteFile(editPost?.coverImage);
                  }
                  const updatedPost = await docService.updatePost(editPost.$id, { ...data, coverImage: newFile ? newFile.$id : editPost?.coverImage });
                  if (updatedPost) {
                        dispatch(updatePost({ id: editPost.$id, updatedPost }));
                        dispatch(setLoadingFalse());
                        navigate(`/journals/${updatedPost.$id}`);
                  }
            } else {
                  const newFile = data.coverImage[0] && (await docService.createFile(data.coverImage[0]));
                  if (newFile) {
                        const newPost = await docService.createPost({ ...data, coverImage: newFile.$id, author: userData.$id, authorName: userData.name });
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
                        <h1 className="font-cool mt-10 md:text-5xl text-3xl text-center font-extrabold">{editPost ? "Edit" : "Write"} Post</h1>
                        <div className="flex space-y-10  justify-center items-center flex-col">
                              <div onClick={() => document.getElementById("featured-image")?.click()} className="border-2  cursor-pointer mx-auto container border-dashed  border-border rounded-lg p-8 w-1/2 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                          {preview ? (
                                                <img src={preview} alt="Featured preview" className="max-h-48 w-full object-cover rounded" />
                                          ) : (
                                                <>
                                                      <p className="text-muted-foreground">Click to upload or drag and drop</p>
                                                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                                                </>
                                          )}
                                          {/* keep the input hidden; we attach our custom change handler while preserving RHF registration */}
                                          <Input {...coverImageRegister} id="featured-image" type="file" star={true} className="hidden" accept="image/*" onChange={handleFileChange} />
                                          <button className="cursor-pointer" type="button">
                                                Select Image
                                          </button>
                                    </div>
                              </div>
                              {errors.coverImage && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.coverImage.message}</span>}
                              {/* user Input */}
                              <section className="w-full flex  overflow-hidden justify-center flex-col items-center">
                                    <div className="gap-3 w-full h-full mt-5 px-5 flex flex-col justify-center-safe items-center-safe">
                                          <div className="md:w-[27rem] w-full flex flex-col">
                                                <label htmlFor="headline">
                                                      Main Headline
                                                      <span className="text-red-500">*</span>
                                                </label>
                                                <textarea className="px-4 w-full py-2 resize-none min-h-12 [field-sizing:content] h-auto border-b-[1px] rounded outline-none" rows={1} {...register("title", { required: "Headline is required", minLength: { value: 10, message: "Atleast 10 characters" } })} label={"Main Headline"} type={"text"} placeholder={"It will attract the reader..."} />
                                                {errors.title && <span className="text-red-500 text-xs sm:text-sm tracking-tighter leading-none">{errors.title.message}</span>}
                                          </div>
                                          <div className="mt-10 w-[27rem]  gap-5 flex">
                                                <div>
                                                      <Input type="number" {...register("readingTime", { required: "Invalid Value: Must be a number", min: { value: 1, message: "Min 1 minute time" }, max: { value: 30, message: "Max 30 minutes time" }, valueAsNumber: true })} placeholder="Time in minutes" label={"Reading Time"} className="w-full" star={true} />
                                                      {errors.readingTime && <span className="text-red-500 text-xs sm:text-sm tracking-tight leading-none">{errors.readingTime.message}</span>}
                                                </div>
                                          </div>
                                          <div className=" w-full overflow-hidden md:w-[64rem]">
                                                <RTE name={"content"} label={"content"} defaultValues={editPost?.content} control={control} />
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
