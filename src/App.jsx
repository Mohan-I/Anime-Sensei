import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/ui/Loader";
import { ROUTES } from "./routes";
import BackToTopButton from "./components/ui/backToTop";
import ScrollToTop from "./components/ScrollToTop";

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
const Error = lazy(() => import("./pages/Error"));

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        {/* Suspense for lazy-loaded components */}
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
            <Route path={ROUTES.ANIME} element={<AnimePage />} />
            <Route path={ROUTES.ANIMEITEM} element={<AnimeItem />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
            <Route path={ROUTES.ERROR} element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
        <BackToTopButton />
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
