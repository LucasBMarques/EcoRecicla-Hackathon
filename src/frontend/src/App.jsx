import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CollectionPoints from "./pages/CollectionPoints";
import UserSettings from "./pages/UserSettings";

function App() {
  const [page, setPage] = useState("login");
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const lastPage = localStorage.getItem("lastPage");
    
    if (token) {
      // Se tem token, restaurar a página anterior
      if (lastPage === "collection-points") {
        setPage("collection-points");
      } else {
        setPage("home");
      }
    } else {
      setPage("login");
    }
    setIsLoading(false);
  }, []);

  // Salvar última página visita
  const handleSetPage = (newPage) => {
    setPage(newPage);
    if (newPage !== "login" && newPage !== "register" && newPage !== "settings") {
      localStorage.setItem("lastPage", newPage);
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  if (page === "home") {
    return <Home setPage={handleSetPage} />;
  }

  if (page === "collection-points") {
    return <CollectionPoints setPage={handleSetPage} />;
  }

  if (page === "settings") {
    return <UserSettings setPage={handleSetPage} />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login setPage={handleSetPage} />
      ) : (
        <Register setPage={handleSetPage} />
      )}
    </div>
  );
}

export default App;