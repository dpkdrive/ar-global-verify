import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  // {
  //   name: "About",
  //   path: "/about",
  // },
  {
    name: "Authenticity",
    path: "/verify",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-red-700 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
