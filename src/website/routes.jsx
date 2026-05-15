import { Navigate, Route } from "react-router-dom";
import SiteLayout from "@/website/layout/SiteLayout";
import Welcome from "@/website/pages/Welcome";
import Login from "@/website/pages/Login";
import Signup from "@/website/pages/Signup";
import SitePlaceholder from "@/website/pages/SitePlaceholder";

/** Public marketing & auth routes (website area). */
export function websiteRouteElements(PageWrap, StableWrap) {
  const Stable = StableWrap || PageWrap;

  return [
    <Route key="site-layout" element={<SiteLayout />}>
      <Route index element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<PageWrap><Welcome /></PageWrap>} />
      <Route
        path="/features"
        element={
          <PageWrap>
            <SitePlaceholder
              title="Features"
              description="AI meal plans, calorie tracking, macro insights, cardio plans, and progress analytics — all in one beautiful app."
            />
          </PageWrap>
        }
      />
      <Route
        path="/pricing"
        element={
          <PageWrap>
            <SitePlaceholder
              title="Pricing"
              description="Simple plans for every goal. Start free, upgrade when you are ready to unlock advanced coaching."
            />
          </PageWrap>
        }
      />
      <Route
        path="/about"
        element={
          <PageWrap>
            <SitePlaceholder
              title="About FitnovaAI"
              description="We help people build sustainable fitness habits with intelligent nutrition and training tools."
            />
          </PageWrap>
        }
      />
      <Route
        path="/contact"
        element={
          <PageWrap>
            <SitePlaceholder
              title="Contact"
              description="Questions or partnerships? Reach us at hello@fitnovaai.app — we would love to hear from you."
            />
          </PageWrap>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <PageWrap>
            <SitePlaceholder
              title="Privacy Policy"
              description="Your data stays yours. We use industry-standard security and never sell personal health information."
            />
          </PageWrap>
        }
      />
    </Route>,
    <Route key="login" path="/login" element={<Stable><Login /></Stable>} />,
    <Route key="signup" path="/signup" element={<Stable><Signup /></Stable>} />,
  ];
}
