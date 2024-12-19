import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { currentUser } = useSelector(
    (state: { user: { currentUser: any } }) => state.user
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    searchTermFromUrl && setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Truest</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          action=""
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* Burger Icon for Mobile */}
        <button
          className="sm:hidden text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-4">
          <Link to={"/"}>
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to={"/about"}>
            <li className="text-slate-700 hover:underline">About</li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="sm:hidden bg-slate-100 p-4 flex flex-col gap-4">
          <Link to={"/"} onClick={() => setMenuOpen(false)}>
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to={"/about"} onClick={() => setMenuOpen(false)}>
            <li className="text-slate-700 hover:underline">About</li>
          </Link>
          <Link to={"/profile"} onClick={() => setMenuOpen(false)}>
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      )}
    </header>
  );
}
