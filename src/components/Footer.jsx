import { Link } from "react-router-dom";
const Footer = () => {
      return (
            <footer className="w-full py-10 px-10 h-fit">
                  <div className="flex border-y-[1px] flex-col md:flex-row w-full md:gap-10">
                        {[
                              {
                                    name: "CS Core | For Students",
                                    message: "OS, DBMS, Networks, DSA written by students and devs who just went through it",
                              },
                              {
                                    name: "Navigation",
                                    links: [
                                          { text: "Home", link: "/" },
                                          { text: "Journal", link: "/journals" },
                                    ],
                              },
                              {
                                    name: "Legal",
                                    text: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
                              },
                        ].map((obj, index) => (
                              <div key={index} className={`md:py-20 py-5 ${index === 0 ? "flex-2/5 " : "flex-1/4"}  flex flex-col  w-fit gap-3`}>
                                    <h2 className="text-xl font-medium">{obj?.name}</h2>
                                    <p>{obj?.message}</p>
                                    {obj.links?.map((eachLink, index) => (
                                          <Link key={index} to={eachLink?.link} className="text-lg tracking-tighter leading-none">
                                                {eachLink?.text}
                                          </Link>
                                    ))}
                                    {obj?.text?.map((t, index) => (
                                          <p className="text-lg tracking-tighter leading-none" key={index}>
                                                {t}
                                          </p>
                                    ))}
                              </div>
                        ))}
                  </div>
                  <h1 className="mt-10">© 2026 CS Core | For Students. All rights reserved</h1>
            </footer>
      );
};

export default Footer;
