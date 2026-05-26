import { Navigate, Route } from "react-router-dom";
import SiteLayout from "@/website/layout/SiteLayout";
import Welcome from "@/website/pages/Welcome";
import Login from "@/website/pages/Login";
import Signup from "@/website/pages/Signup";
import SitePlaceholder from "@/website/pages/SitePlaceholder";
import About from "@/website/pages/About";
import Features from "@/website/pages/Features";
import Pricing from "@/website/pages/Pricing";
import Contact from "@/website/pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import TermsConditions from "./pages/TermsConditions";

/** Public marketing & auth routes (website area). */
export function websiteRouteElements(PageWrap, StableWrap) {
  const Stable = StableWrap || PageWrap;

  return [
    <Route key="site-layout" element={<SiteLayout />}>
      <Route index element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<PageWrap><Welcome /></PageWrap>} />
      <Route path="/features" element={<PageWrap><Features /></PageWrap>} />
      <Route path="/pricing" element={<PageWrap><Pricing /></PageWrap>} />
      <Route path="/about" element={<PageWrap><About /></PageWrap>} />
      <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
      <Route
        path="/privacy-policy"
        element={
          <PageWrap>
            <PrivacyPolicy />
          </PageWrap>
        }
      />
    </Route>,
    <Route key="cookies-policy" path="/cookies-policy" element={<PageWrap><CookiesPolicy /></PageWrap>} />,
    <Route key="terms-conditions" path="/terms-conditions" element={<PageWrap><TermsConditions /></PageWrap>} />,
    <Route key="login" path="/login" element={<Stable><Login /></Stable>} />,
    <Route key="signup" path="/signup" element={<Stable><Signup /></Stable>} />,
  ];
}
