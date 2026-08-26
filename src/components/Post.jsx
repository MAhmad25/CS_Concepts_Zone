import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";
import htmlToText from "../config/CovertHTMLToText";
import useFileView from "../hooks/useFileView";
import dateConversion from "../utils/dateConversion";

const CornerDots = () => {
      const dot = "size-1 rounded-full bg-black/60";
      return (
            <div className="pointer-events-none absolute left-0 right-0 top-4 bottom-4 sm:top-5 sm:bottom-5 z-0 grid grid-cols-2 place-content-between">
                  <div className={`${dot} -mx-[2.5px] -mt-[2.5px]`} />
                  <div className={`${dot} -mx-[2px] -mt-[2.5px] justify-self-end`} />
                  <div className={`${dot} -mx-[2.5px] -mb-[2.5px] self-end`} />
                  <div className={`${dot} -mx-[2px] -mb-[2.5px] justify-self-end self-end`} />
            </div>
      );
};

const MAX_TAGS = 3;

const Post = ({ postData }) => {
      const { url } = useFileView(postData);
      const tags = postData?.tags || [];
      const visibleTags = tags.slice(0, MAX_TAGS);
      const extraTagCount = tags.length - visibleTags.length;

      return (
            <Link to={`/journals/${postData?.id}`} className="block h-full">
                  <div className="relative h-[500px] rounded-2xl border border-black/15 px-4 sm:px-5 shrink-0 transition-all duration-500">
                        {/* frame rule lines */}
                        <div className="absolute left-0 top-4 z-0 h-px w-full bg-black/15 sm:top-5" />
                        <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-black/15 sm:bottom-5" />

                        <div className="relative h-full border-x border-black/15">
                              <CornerDots />
                              {/* padding matches the rule-line inset exactly, so content can never render past the lines */}
                              <div className="relative z-10 flex h-full cursor-pointer flex-col overflow-hidden rounded-xl text-[var(--color-bl)] px-4 pt-4 pb-4 sm:px-5 sm:pt-5 sm:pb-5">
                                    {/* Featured Image - fixed height */}
                                    <div className="w-full h-[180px] shrink-0 overflow-hidden rounded">
                                          <img className="w-full h-full object-cover" src={url} alt="Cover Image" />
                                    </div>

                                    {/* Author Name and Date of post */}
                                    <div className="w-full flex gap-4 items-center mt-4 shrink-0">
                                          <h2 className="leading-none tracking-tight truncate">{postData?.authorName}</h2>
                                          <h2 className="leading-none tracking-tight shrink-0">{dateConversion(postData?.createdAt)}</h2>
                                    </div>

                                    {/* Heading - clamped to 2 lines */}
                                    <h1 className="font-cool text-3xl sm:text-2xl hover:underline transition-all font-extrabold mt-4 line-clamp-2 shrink-0">{postData?.title}</h1>

                                    {/* Excerpt - clamped to 3 lines */}
                                    <p className="text-sm text-wrap font-light mt-4 line-clamp-3 shrink-0">{htmlToText(postData?.content).slice(0, 150)}</p>

                                    {/* Spacer pushes tags/arrow to the bottom on every card */}
                                    <div className="flex-1" />

                                    <div className="flex justify-between items-center w-full mt-4 shrink-0">
                                          {/* Tags - capped so they can't wrap into extra rows */}
                                          <div className="flex flex-wrap gap-2 overflow-hidden">
                                                {visibleTags.map((value) => (
                                                      <div key={value} className="px-3 py-1 border-[1px] rounded-full tracking-tight leading-none whitespace-nowrap">
                                                            {value}
                                                      </div>
                                                ))}
                                                {extraTagCount > 0 && <div className="px-3 py-1 border-[1px] rounded-full tracking-tight leading-none whitespace-nowrap">+{extraTagCount}</div>}
                                          </div>
                                          <span className="shrink-0">
                                                <GoArrowUpRight size="1.3rem" />
                                          </span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </Link>
      );
};

export default Post;
