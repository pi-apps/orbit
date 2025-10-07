import { Route, Routes } from "react-router-dom";

// Core Pages
import AccountsPage from "./pages/AccountsPage";
import AiAssistPage from "./pages/AiAssistPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CalendarPage from "./pages/CalendarPage";
import CreatePage from "./pages/CreatePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import ProPage from "./pages/ProPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import TeamsPage from "./pages/TeamsPage";
import TemplatesPage from "./pages/TemplatesPage";
import CreateTemplatePage from "./pages/CreateTemplatePage";
import OnboardingPage from "./pages/OnboardingPage";
import OauthConfirmPage from "./pages/OauthConfirmPage";
import TwitterCallbackPage from "./pages/TwitterCallbackPage";
import RedditCallbackPage from "./pages/RedditCallbackPage";
import ThreadsCallbackPage from "./pages/ThreadsCallbackPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import AutomationPage from "./pages/AutomationPage";
import CreateAutomationPage from "./pages/CreateAutomationPage";
import AutomationDetailsPage from "./pages/AutomationDetailsPage";
import WalletPage from "./pages/WalletPage";
import ReferPage from "./pages/ReferPage";

import AuthRoute from "./components/AuthRoute";
import "./index.css";
import EntryPage from "./pages/EntryPage";
import UploadsPage from "./pages/UploadsPage";
import TokenExpirationNotifier from "./components/TokenExpirationNotifier";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import WindowOpenTester from "./pages/WindowOpenTester";
import InsufficientFundsModal from "./components/InsufficientFundsModal";
import LowBalanceModal from "./components/LowBalanceModal";

function App() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Multiple approaches to ensure mobile responsiveness
        setTimeout(() => {
          // Reset focus
          document.body.focus();

          // Force hardware acceleration reset (helps with iOS)
          document.body.style.transform = "translateZ(0)";

          // Reset pointer events (in case they got stuck)
          document.body.style.pointerEvents = "auto";

          // Force a repaint
          void document.body.offsetHeight;

          // Clean up the transform
          setTimeout(() => {
            document.body.style.transform = "";
          }, 0);

          // Dispatch a custom event that components can listen to
          window.dispatchEvent(new CustomEvent("app-visibility-restored"));
        }, 100);
      }
    };

    // Also handle page focus as a backup
    const handleFocus = () => {
      document.body.style.pointerEvents = "auto";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
  return (
    <>
      <Toaster />
      <TokenExpirationNotifier />
      <InsufficientFundsModal />
      <LowBalanceModal />
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/onboarding"
          element={
            <AuthRoute>
              <OnboardingPage />
            </AuthRoute>
          }
        />
        <Route
          path="/automation/:id"
          element={
            <AuthRoute>
              <AutomationDetailsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <AuthRoute>
              <WalletPage />
            </AuthRoute>
          }
        />
        <Route path="/wopt" element={<WindowOpenTester />} />
        <Route
          path="/refer"
          element={
            <AuthRoute>
              <ReferPage />
            </AuthRoute>
          }
        />
        <Route
          path="/create-automation"
          element={
            <AuthRoute>
              <CreateAutomationPage />
            </AuthRoute>
          }
        />
        <Route
          path="/automation"
          element={
            <AuthRoute>
              <AutomationPage />
            </AuthRoute>
          }
        />
        <Route
          path="/threads-callback"
          element={
            <AuthRoute>
              <ThreadsCallbackPage />
            </AuthRoute>
          }
        />
        <Route
          path="/templates/edit/:templateId"
          element={
            <AuthRoute>
              <CreateTemplatePage />
            </AuthRoute>
          }
        />
        <Route
          path="/create-template"
          element={
            <AuthRoute>
              <CreateTemplatePage />
            </AuthRoute>
          }
        />
        {/* <Route
        path="/home"
        element={
          <AuthRoute>
            <HomePage />
          </AuthRoute>
        }
      /> */}
        <Route
          path="/create"
          element={
            <AuthRoute>
              <CreatePage />
            </AuthRoute>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <AuthRoute>
              <PostDetailsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/pro"
          element={
            <AuthRoute>
              <ProPage />
            </AuthRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <AuthRoute>
              <CreatePage />
            </AuthRoute>
          }
        />
        <Route
          path="/team"
          element={
            <AuthRoute>
              <TeamsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <AuthRoute>
              <TemplatesPage />
            </AuthRoute>
          }
        />
        <Route
          path="/uploads"
          element={
            <AuthRoute>
              <UploadsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <AuthRoute>
              <NotificationsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <ProfilePage />
            </AuthRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthRoute>
              <SettingsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashboardPage />
            </AuthRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <AuthRoute>
              <CalendarPage />
            </AuthRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <AuthRoute>
              <AccountsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <AuthRoute>
              <AnalyticsPage />
            </AuthRoute>
          }
        />
        <Route
          path="/ai-assist"
          element={
            <AuthRoute>
              <AiAssistPage />
            </AuthRoute>
          }
        />
        <Route
          path="/oauth-confirm"
          element={
            <AuthRoute>
              <OauthConfirmPage />
            </AuthRoute>
          }
        />
        <Route
          path="/twitter-callback"
          element={
            <AuthRoute>
              <TwitterCallbackPage />
            </AuthRoute>
          }
        />
        <Route
          path="/reddit-callback"
          element={
            <AuthRoute>
              <RedditCallbackPage />
            </AuthRoute>
          }
        />
        <Route
          path="/tos"
          element={
            <AuthRoute>
              <TermsOfServicePage />
            </AuthRoute>
          }
        />
        <Route
          path="/pp"
          element={
            <AuthRoute>
              <PrivacyPolicyPage />
            </AuthRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
