import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/ui/Loader";
import { ROUTES } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackToTopButton from "./components/ui/backToTop";
import ScrollToTop from "./components/ScrollToTop";
import { auth } from "./firebase/firebase"; // Import auth
import ErrorBoundary from "./pages/Error";

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const AnimePage = lazy(() => import("./pages/AnimePage"));
const AnimeItem = lazy(() => import("./components/AnimeItem"));
const Gallery = lazy(() => import("./components/Gallery"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Error = lazy(() => import("./pages/Error"));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const PrivateRoute = ({ element, ...rest }) => {
    return user ? element : <Navigate to={ROUTES.LOGIN} />;
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <ToastContainer position="top-center" />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.NEWS} element={<NewsPage />} />
            <Route path={ROUTES.GUIDE} element={<GuidePage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
            <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
            <Route path={ROUTES.ANIME} element={<PrivateRoute element={<AnimePage />} />} />
            <Route path={ROUTES.ANIMEITEM} element={<AnimeItem />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.PROFILE} element={<PrivateRoute element={<Profile />} />} />
            <Route path={ROUTES.ERROR} element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} />} />
          </Routes>
        </Suspense>
        <BackToTopButton />
        <Footer />
      </BrowserRouter>
      </ErrorBoundary>
    </main>
  );
}

export default App;