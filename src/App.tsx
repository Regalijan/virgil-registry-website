import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
const AboutPrivacySettings = lazy(
  () => import("./components/AboutPrivacySettings")
);
const Attributions = lazy(() => import("./components/Attributions"));
const AUP = lazy(() => import("./components/AUP"));
const Docs = lazy(() => import("./components/Docs"));
const Home = lazy(() => import("./components/Home"));
const Link = lazy(() => import("./components/Link"));
const Login = lazy(() => import("./components/Login"));
const Me = lazy(() => import("./components/Me"));
const NotFound = lazy(() => import("./components/NotFound"));
const Premium = lazy(() => import("./components/Premium"));
const Privacy = lazy(() => import("./components/Privacy"));
const Terms = lazy(() => import("./components/Terms"));
const VerificationLanding = lazy(
  () => import("./components/VerificationLanding")
);
const VerifyError = lazy(() => import("./components/VerifyError"));

export default function () {
  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Navigation />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/about-privacy-settings"
                element={<AboutPrivacySettings />}
              />
              <Route path="/attributions" element={<Attributions />} />
              <Route path="/aup" element={<AUP />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/link" element={<Link />} />
              <Route path="/login" element={<Login />} />
              <Route path="/me" element={<Me />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/verify" element={<VerificationLanding />} />
              <Route path="/verify-error" element={<VerifyError />} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
