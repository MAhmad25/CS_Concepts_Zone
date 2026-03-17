import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useSelector } from "react-redux";
import { Logout, LogoutIcon, PenIcon } from "./index";

const PillNav = ({ logo = "/favicon-628.png", logoAlt = "Logo", items, activeHref, className = "", ease = "power3.easeOut", baseColor = "#fff", pillColor = "#060010", hoveredPillTextColor = "#060010", pillTextColor, initialLoadAnimation = false }) => {
      const status = useSelector((state) => state.auth.status);
      const loading = useSelector((state) => state.loader.isSkeleton);
      const resolvedPillTextColor = pillTextColor ?? baseColor;
      const circleRefs = useRef([]);
      const tlRefs = useRef([]);
      const activeTweenRefs = useRef([]);
      const logoImgRef = useRef(null);
      const logoTweenRef = useRef(null);
      const navItemsRef = useRef(null);
      const logoRef = useRef(null);

      useEffect(() => {
            const layout = () => {
                  circleRefs.current.forEach((circle) => {
                        if (!circle?.parentElement) return;

                        const pill = circle.parentElement;
                        const rect = pill.getBoundingClientRect();
                        const { width: w, height: h } = rect;
                        const R = ((w * w) / 4 + h * h) / (2 * h);
                        const D = Math.ceil(2 * R) + 2;
                        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                        const originY = D - delta;

                        circle.style.width = `${D}px`;
                        circle.style.height = `${D}px`;
                        circle.style.bottom = `-${delta}px`;

                        gsap.set(circle, {
                              xPercent: -50,
                              scale: 0,
                              transformOrigin: `50% ${originY}px`,
                        });

                        const label = pill.querySelector(".pill-label");
                        const white = pill.querySelector(".pill-label-hover");

                        if (label) gsap.set(label, { y: 0 });
                        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                        const index = circleRefs.current.indexOf(circle);
                        if (index === -1) return;

                        tlRefs.current[index]?.kill();
                        const tl = gsap.timeline({ paused: true });

                        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);

                        if (label) {
                              tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
                        }

                        if (white) {
                              gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                              tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
                        }

                        tlRefs.current[index] = tl;
                  });
            };

            layout();

            const onResize = () => layout();
            window.addEventListener("resize", onResize);

            if (document.fonts?.ready) {
                  document.fonts.ready.then(layout).catch(() => {});
            }

            if (initialLoadAnimation) {
                  const logo = logoRef.current;
                  const navItems = navItemsRef.current;

                  if (logo) {
                        gsap.set(logo, { scale: 0 });
                        gsap.to(logo, {
                              scale: 1,
                              duration: 0.6,
                              ease,
                        });
                  }

                  if (navItems) {
                        gsap.set(navItems, { width: 0, overflow: "hidden" });
                        gsap.to(navItems, {
                              width: "auto",
                              duration: 0.6,
                              ease,
                        });
                  }
            }

            return () => window.removeEventListener("resize", onResize);
      }, [items, ease, initialLoadAnimation]);

      const handleEnter = (i) => {
            const tl = tlRefs.current[i];
            if (!tl) return;
            activeTweenRefs.current[i]?.kill();
            activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
                  duration: 0.3,
                  ease,
                  overwrite: "auto",
            });
      };

      const handleLeave = (i) => {
            const tl = tlRefs.current[i];
            if (!tl) return;
            activeTweenRefs.current[i]?.kill();
            activeTweenRefs.current[i] = tl.tweenTo(0, {
                  duration: 0.2,
                  ease,
                  overwrite: "auto",
            });
      };

      const handleLogoEnter = () => {
            const img = logoImgRef.current;
            if (!img) return;
            logoTweenRef.current?.kill();
            gsap.set(img, { rotate: 0 });
            logoTweenRef.current = gsap.to(img, {
                  rotate: 360,
                  duration: 0.2,
                  ease,
                  overwrite: "auto",
            });
      };

      const isExternalLink = (href) => href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");

      const isRouterLink = (href) => href && !isExternalLink(href);

      const cssVars = {
            ["--base"]: baseColor,
            ["--pill-bg"]: pillColor,
            ["--hover-text"]: hoveredPillTextColor,
            ["--pill-text"]: resolvedPillTextColor,
            ["--nav-h"]: "42px",
            ["--logo"]: "36px",
            ["--pill-pad-x"]: "18px",
            ["--pill-gap"]: "3px",
      };

      return (
            <div className="absolute top-[1em] z-[1000] bg-red-500   left-0 md:w-auto md:left-auto">
                  <nav className={`w-full flex md:justify-between justify-start  box-border   ${className}`} aria-label="Primary" style={cssVars}>
                        {isRouterLink(items?.[0]?.href) ? (
                              <Link
                                    to={items[0].href}
                                    aria-label="Home"
                                    onMouseEnter={handleLogoEnter}
                                    role="menuitem"
                                    ref={(el) => {
                                          logoRef.current = el;
                                    }}
                                    className="rounded-full p-2 hidden md:block items-center justify-center "
                                    style={{
                                          width: "var(--nav-h)",
                                          height: "var(--nav-h)",
                                          background: "var(--base, #000)",
                                    }}
                              >
                                    <img src={logo} alt={logoAlt} ref={logoImgRef} className="object-cover invert " />
                              </Link>
                        ) : (
                              <a
                                    href={items?.[0]?.href || "#"}
                                    aria-label="Home"
                                    onMouseEnter={handleLogoEnter}
                                    ref={(el) => {
                                          logoRef.current = el;
                                    }}
                                    className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
                                    style={{
                                          width: "var(--nav-h)",
                                          height: "var(--nav-h)",
                                          background: "var(--base, #000)",
                                    }}
                              >
                                    <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover invert block" />
                              </a>
                        )}

                        <div
                              ref={navItemsRef}
                              className="relative items-center rounded-full flex "
                              style={{
                                    height: "var(--nav-h)",
                                    background: "var(--base, #000)",
                              }}
                        >
                              <ul role="menubar" className="list-none flex items-stretch m-0 p-[3px] h-full" style={{ gap: "var(--pill-gap)" }}>
                                    {items.map((item, i) => {
                                          const isActive = activeHref === item.href;

                                          const pillStyle = {
                                                background: "var(--pill-bg)",
                                                color: "var(--pill-text, var(--base, #000))",
                                                paddingLeft: "var(--pill-pad-x)",
                                                paddingRight: "var(--pill-pad-x)",
                                          };

                                          const PillContent = (
                                                <>
                                                      <span
                                                            className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                                                            style={{
                                                                  background: "var(--base, #000)",
                                                                  willChange: "transform",
                                                            }}
                                                            aria-hidden="true"
                                                            ref={(el) => {
                                                                  circleRefs.current[i] = el;
                                                            }}
                                                      />
                                                      <span className="label-stack relative inline-block leading-[1] z-[2]">
                                                            <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: "transform" }}>
                                                                  {item.label}
                                                            </span>
                                                            <span
                                                                  className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                                                                  style={{
                                                                        color: "var(--hover-text, #fff)",
                                                                        willChange: "transform, opacity",
                                                                  }}
                                                                  aria-hidden="true"
                                                            >
                                                                  {item.label}
                                                            </span>
                                                      </span>
                                                      {isActive && <span className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]" style={{ background: "var(--base, #000)" }} aria-hidden="true" />}
                                                </>
                                          );

                                          const basePillClasses = "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-xs leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0";

                                          return (
                                                <li key={item.href} role="none" className="flex h-full">
                                                      {isRouterLink(item.href) ? (
                                                            <Link role="menuitem" to={item.href} className={basePillClasses} style={pillStyle} aria-label={item.ariaLabel || item.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)}>
                                                                  {PillContent}
                                                            </Link>
                                                      ) : (
                                                            <a role="menuitem" href={item.href} className={basePillClasses} style={pillStyle} aria-label={item.ariaLabel || item.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)}>
                                                                  {PillContent}
                                                            </a>
                                                      )}
                                                </li>
                                          );
                                    })}
                                    {loading ? (
                                          <>
                                                <span className="inline-flex items-center justify-center border-[0.1px] rounded-full px-3 py-1 w-28 animate-pulse" aria-busy="true">
                                                      <span className="h-[80%] w-full rounded-full bg-gray-300 dark:bg-gray-700" />
                                                </span>
                                                <span className="inline-flex items-center justify-center border-[0.1px] rounded-full px-3 py-1 w-28 animate-pulse" aria-busy="true">
                                                      <span className="h-[80%] w-full rounded-full bg-gray-300 dark:bg-gray-700" />
                                                </span>
                                          </>
                                    ) : (
                                          <>
                                                <Link className="px-3 py-2 flex items-center justify-center-safe gap-2 border-[1px] rounded-full text-[var(--color-wht)] bg-[var(--color-bl)]  border-white/60" to={`${status ? "/write-post" : "/login"}`}>
                                                      {status ? <PenIcon /> : <LogoutIcon />}
                                                      <p className="leading-none whitespace-nowrap tracking-tight">{status ? "Write" : "Login"}</p>
                                                </Link>
                                                {!status && (
                                                      <Link className="border-[0.1px] rounded-full px-3 py-1" to="/create-account ">
                                                            Create an account
                                                      </Link>
                                                )}
                                                {status && <Logout />}
                                          </>
                                    )}
                              </ul>
                        </div>
                  </nav>
            </div>
      );
};

export default PillNav;
