export default function PostDetailSkeleton({ tagsCount = 5, isAdmin = true, titleLines = 2, contentLines = 8, className = "" }) {
      const line = "bg-zinc-200/70 dark:bg-zinc-800/60 animate-pulse rounded";
      return (
            <section role="status" aria-busy="true" className={`w-full px-5 font-primary-text min-h-svh text-[var(--color-bl)] bg-[var(--color-wht)] ${className}`}>
                  {/* Top Section */}
                  <section className="w-full pt-28 flex flex-col lg:flex-row gap-10">
                        {/* Left */}
                        <div className="lg:w-3/4 xl:px-10 py-2 space-y-6">
                              {/* Title */}
                              <div className="space-y-4">
                                    {Array.from({ length: titleLines }).map((_, i) => (
                                          <div key={i} className={`h-12 ${line}`} style={{ width: i === 0 ? "75%" : "60%" }} />
                                    ))}
                              </div>

                              {/* Author chip */}
                              <div className="w-fit px-4 py-2 rounded-full border border-zinc-300/40 dark:border-zinc-700/40">
                                    <div className={`h-4 w-32 ${line}`} />
                              </div>

                              {/* Admin buttons */}
                              <div className={`flex gap-5 items-center ${isAdmin ? "" : "hidden"}`}>
                                    <div className={`h-11 w-28 rounded-xl ${line}`} />
                                    <div className={`h-11 w-28 rounded-xl ${line}`} />
                              </div>
                        </div>

                        {/* Right */}
                        <div className="md:w-1/4 w-full py-10 space-y-8">
                              <div className="space-y-2">
                                    <div className={`h-3 w-24 ${line}`} />
                                    <div className={`h-5 w-32 ${line}`} />
                              </div>

                              <div className="space-y-2">
                                    <div className={`h-3 w-32 ${line}`} />
                                    <div className={`h-5 w-20 ${line}`} />
                              </div>

                              <div className="flex flex-wrap gap-3">
                                    {Array.from({ length: tagsCount }).map((_, i) => (
                                          <div key={i} className="px-4 py-2 rounded-full border border-zinc-300/40 dark:border-zinc-700/40">
                                                <div className={`h-3 w-14 ${line}`} />
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* Content Section */}
                  <section className="w-full border-t border-zinc-300/40 dark:border-zinc-700/40 mt-14 lg:px-20 py-10 space-y-12">
                        {/* Featured image */}
                        <div className="w-full lg:h-[30rem] rounded-xl overflow-hidden">
                              <div className={`w-full h-full ${line}`} />
                        </div>

                        {/* Paragraphs */}
                        <div className="py-16 lg:px-40 space-y-4">
                              {Array.from({ length: contentLines }).map((_, i) => (
                                    <div key={i} className={`h-4 ${line}`} style={{ width: i === contentLines - 1 ? "70%" : "100%" }} />
                              ))}
                        </div>

                        {/* Related title */}
                        <div className="flex justify-center">
                              <div className={`h-14 w-1/2 ${line}`} />
                        </div>

                        {/* Related grid */}
                        <section className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2">
                              {Array.from({ length: 3 }).map((_, idx) => (
                                    <div key={idx} className="space-y-5 px-5 py-5">
                                          <div className="w-full h-44 rounded-xl overflow-hidden">
                                                <div className={`w-full h-full ${line}`} />
                                          </div>

                                          <div className="flex gap-4 items-center">
                                                <div className={`h-4 w-32 ${line}`} />
                                                <div className={`h-3 w-3 rounded-full ${line}`} />
                                                <div className={`h-4 w-24 ${line}`} />
                                          </div>

                                          <div className={`h-8 w-3/4 ${line}`} />

                                          <div className="space-y-2">
                                                <div className={`h-3 w-full ${line}`} />
                                                <div className={`h-3 w-5/6 ${line}`} />
                                          </div>
                                    </div>
                              ))}
                        </section>
                  </section>
            </section>
      );
}
