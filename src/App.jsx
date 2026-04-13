import { Container } from "./components/index";
import AppRoute from "./Routes/AppRoute";
import PostLoader from "./components/ui/PostLoader";
import { useSelector } from "react-redux";
import { StaggeredMenu } from "./components/index";
import { ReactLenis, useLenis } from "lenis/react";
const App = () => {
      const isLoading = useSelector((state) => state.loader.isLoading);
      useLenis();
      const menuItems = [
            { label: "Home", ariaLabel: "Go to home page", link: "/" },
            { label: "Journals", ariaLabel: "Read the journals", link: "/journals" },
      ];
      return (
            <>
                  <ReactLenis root />
                  <Container>
                        {isLoading && <PostLoader />}
                        <div className="fixed  sm:hidden w-screen pointer-events-none z-[9999]  h-screen overflow-hidden">
                              <StaggeredMenu items={menuItems} menuButtonColor="#000000" openMenuButtonColor="#000000" />
                        </div>
                        <AppRoute />
                  </Container>
            </>
      );
};

export default App;
