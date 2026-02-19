import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Tractor,
  UserPlus,
  Menu,
  X,
  Globe,
  ChevronDown,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/images/logo.jpeg";

/* ================= AUTH CHECK ================= */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { to: "/", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/sensors", label: t("sensors"), icon: Activity },
    { to: "/tractors", label: t("rentTractor"), icon: Tractor },
    { to: "/register", label: t("register"), icon: UserPlus },
  ];

  /* ================= LANGUAGES ================= */
  const languages = [
    { code: "en", label: t("english") },
    { code: "ta", label: t("tamil") },
    { code: "kn", label: t("kannada") },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <>
      {/* ================= DESKTOP NAV ================= */}
      <nav className="sticky top-0 z-50 hidden md:block bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">

            {/* LOGO */}
            <NavLink to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="HillSmart Logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <h1 className="font-bold text-lg">HillSmart</h1>
                <p className="text-xs text-gray-500">
                  {t("smartPlatform")}
                </p>
              </div>
            </NavLink>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

              {/* NAV ITEMS (ONLY IF LOGGED IN) */}
              {loggedIn &&
                navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        isActive
                          ? "bg-green-100 text-green-600"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}

              {/* LANGUAGE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium uppercase">
                    {i18n.language}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-xl border z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          i18n.language === lang.code
                            ? "bg-green-100 text-green-600 font-medium"
                            : ""
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AUTH BUTTONS */}
              {!loggedIn ? (
                <div className="flex gap-3">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <LogIn size={16} />
                    {t("login")}
                  </NavLink>

                  <NavLink
                    to="/signup"
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-lg flex items-center gap-2"
                  >
                    <User size={16} />
                    {t("signup")}
                  </NavLink>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {t("logout")}
                </button>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE NAV ================= */}
      <nav className="sticky top-0 z-50 md:hidden bg-white border-b shadow-sm">
        <div className="flex h-14 items-center justify-between px-4">

          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="HillSmart Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="font-bold text-lg">HillSmart</span>
          </NavLink>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-white border-t shadow-lg p-4 space-y-3">

            {loggedIn &&
              navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}

            {/* LANGUAGE */}
            <div className="pt-3 border-t">
              <p className="text-sm font-semibold mb-2">
                {t("language")}
              </p>
              <div className="flex gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      i18n.language === lang.code
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AUTH MOBILE */}
            <div className="pt-3 border-t">
              {!loggedIn ? (
                <div className="flex flex-col gap-3">
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-center"
                  >
                    {t("login")}
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-lg text-center"
                  >
                    {t("signup")}
                  </NavLink>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  {t("logout")}
                </button>
              )}
            </div>

          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
