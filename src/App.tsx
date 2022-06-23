import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
const AUP = lazy(() => import("./components/AUP"));
const Home = lazy(() => import("./components/Home"));

export default function () {
  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Navigation />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aup" element={<AUP />} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
