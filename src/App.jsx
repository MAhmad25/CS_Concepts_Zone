import { Container } from "./components/index";
import AppRoute from "./Routes/AppRoute";
import { StaggeredMenu } from "./components/index";
const App = () => {
      const menuItems = [
            { label: "Home", ariaLabel: "Go to home page", link: "/" },
            { label: "Journals", ariaLabel: "Read the journals", link: "/journals" },
      ];
      return (
            <Container>
                  <div className="fixed sm:hidden w-screen pointer-events-none z-[9999]  h-screen overflow-hidden">
                        <StaggeredMenu items={menuItems} menuButtonColor="#000000" openMenuButtonColor="#000000" />
                  </div>
                  <AppRoute />
            </Container>
      );
};

export default App;
