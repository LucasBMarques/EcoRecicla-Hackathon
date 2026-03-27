import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CollectionPoints from "./pages/CollectionPoints";

function App() {
  const [page, setPage] = useState("login");

  if (page === "home") {
    return <Home setPage={setPage} />;
  }

  if (page === "collection-points") {
    return <CollectionPoints setPage={setPage} />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login setPage={setPage} />
      ) : (
        <Register setPage={setPage} />
      )}
    </div>
  );
}

export default App;