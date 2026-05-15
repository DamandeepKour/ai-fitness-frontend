import { Navigate, Route } from "react-router-dom";
import SiteLayout from "@/website/layout/SiteLayout";
import Welcome from "@/website/pages/Welcome";
import Login from "@/website/pages/Login";
import Signup from "@/website/pages/Signup";
import SitePlaceholder from "@/website/pages/SitePlaceholder";

/** Public marketing & auth routes (website area). */
export function websiteRouteElements(PageTransition) {
  return [
    <Route key="site-layout" element={<SiteLayout />}>
      <Route index element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<PageTransition><Welcome /></PageTransition>} />
      <Route
        path="/features"
        element={
          <PageTransition>
            <SitePlaceholder
              title="Features"
              description="AI meal plans, calorie tracking, macro insights, cardio plans, and progress analytics — all in one beautiful app."
            />
          </PageTransition>
        }
      />
      <Route
        path="/pricing"
        element={
          <PageTransition>
            <SitePlaceholder
              title="Pricing"
              description="Simple plans for every goal. Start free, upgrade when you are ready to unlock advanced coaching."
            />
          </PageTransition>
        }
      />
      <Route
        path="/about"
        element={
          <PageTransition>
            <SitePlaceholder
              title="About FitnovaAI"
              description="We help people build sustainable fitness habits with intelligent nutrition and training tools."
            />
          </PageTransition>
        }
      />
      <Route
        path="/contact"
        element={
          <PageTransition>
            <SitePlaceholder
              title="Contact"
              description="Questions or partnerships? Reach us at hello@fitnovaai.app — we would love to hear from you."
            />
          </PageTransition>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <PageTransition>
            <SitePlaceholder
              title="Privacy Policy"
              description="Your data stays yours. We use industry-standard security and never sell personal health information."
            />
          </PageTransition>
        }
      />
    </Route>,
    <Route key="login" path="/login" element={<PageTransition><Login /></PageTransition>} />,
    <Route key="signup" path="/signup" element={<PageTransition><Signup /></PageTransition>} />,
  ];
}
