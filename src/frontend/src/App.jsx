import { useState, useEffect } from "react";
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

  // Verificar sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const lastPage = localStorage.getItem("lastPage");

    if (token) {
      // Se tiver última página salva, usa ela
      setPage(lastPage || "home");
    } else {
      setPage("login");
    }

    setIsLoading(false);
  }, []);

  // Salvar última página visitada
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
          <Mapa setPage={handleSetPage} />;
        </>
      );
      

    case "collection-points":
      return <CollectionPoints setPage={handleSetPage} />;
        

    case "settings":
      return <UserSettings setPage={handleSetPage} />;

    case "recycling-dashboard": 
      return (
       <>
          <Navbar currentPage={page} setPage={handleSetPage} />
          <RecyclingDashboard setPage={handleSetPage} />;
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