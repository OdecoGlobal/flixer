import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

// componrnt
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Discover from "./Pages/Discover/Discover";
import MovieRelease from "./Pages/Movie Release/MovieRelease";
import Navbar from "./components/Navbar";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";

// styles
import "./App.css";
// const URL =
//   "https://api.themoviedb.org/3/discover/tv?api_key=70161bbcd895dec3c1b8d56d7c36b5fd";

// 70161bbcd895dec3c1b8d56d7c36b5fd
// const URL =
//   "https://api.themoviedb.org/3/movie/157336?api_key=70161bbcd895dec3c1b8d56d7c36b5fd&append_to_response=videos";
const URL =
  "https://api.themoviedb.org/3/tv/94722?api_key=70161bbcd895dec3c1b8d56d7c36b5fd&append_to_response=videos";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeNav = () => {
    if (isOpen) setIsOpen(false);
  };

  const fetchMovie = async (title) => {
    const response = await fetch(`${URL}&s=${title}`);
    const data = await response.json();
    console.log(data);
  };
  useEffect(() => {
    fetchMovie("spiderman");
  }, []);
  return (
    <BrowserRouter>
      <Navbar
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        close={closeNav}
        setIsOpen={setIsOpen}
      />
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/movie" element={<MovieRelease />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
