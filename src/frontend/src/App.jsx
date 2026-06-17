import { useState, useEffect } from "react";
import { validateSession } from "./services/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Mapa from "./pages/Mapa";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CollectionPoints from "./pages/CollectionPoints";
import UserSettings from "./pages/UserSettings";
import RecyclingDashboard from "./pages/RecyclingDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      const lastPage = localStorage.getItem("lastPage");

      if (!token) {
        setPage("login");
        setIsLoading(false);
        return;
      }

      try {
        const result = await validateSession(token);
        if (result.ok && result.data?.valid) {
          localStorage.setItem("user", JSON.stringify(result.data.user));
          setPage(lastPage || "home");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("lastPage");
          setPage("login");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastPage");
        setPage("login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSetPage = (newPage) => {
    setPage(newPage);

    if (
      newPage !== "login" &&
      newPage !== "register" &&
      newPage !== "settings"
    ) {
      localStorage.setItem("lastPage", newPage);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  switch (page) {
    case "home":
      return (
        <>
          <Navbar currentPage={page} setPage={handleSetPage} />
          <Home setPage={handleSetPage} />
        </>
      );

    case "mapa":
      return (
        <>
          <Navbar currentPage={page} setPage={handleSetPage} />
          <Mapa setPage={handleSetPage} />
        </>
      );

    case "collection-points":
      return (
        <>
          <Navbar currentPage={page} setPage={handleSetPage} />
          <CollectionPoints setPage={handleSetPage} />
        </>
      );

    case "settings":
      return <UserSettings setPage={handleSetPage} />;

    case "ranking":
      localStorage.setItem("settingsTab", "ranking");
      return <UserSettings setPage={handleSetPage} />;

    case "recycling-dashboard":
      return (
        <>
          <Navbar currentPage={page} setPage={handleSetPage} />
          <RecyclingDashboard setPage={handleSetPage} />
        </>
      );

    case "register":
      return <Register setPage={handleSetPage} />;

    case "login":
    default:
      return <Login setPage={handleSetPage} />;
  }
}

export default App;