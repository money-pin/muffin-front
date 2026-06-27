import { createBrowserRouter, Navigate } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import HomePage from "@/pages/home/HomePage";
import NewsPage from "@/pages/news/NewsPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";
import QuizPage from "@/pages/quiz/QuizPage";
import InvestPage from "@/pages/invest/InvestPage";
import StatsPage from "@/pages/stats/StatsPage";
import RankingPage from "@/pages/ranking/RankingPage";
import MyPage from "@/pages/my/MyPage";
import MySettingsPage from "@/pages/my/MySettingsPage";
import MyStoragePage from "@/pages/my/MyStoragePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/news",
        element: <NewsPage />,
      },
      {
        path: "/news/:newsId",
        element: <NewsDetailPage />,
      },
      {
        path: "/quiz",
        element: <QuizPage />,
      },
      {
        path: "/invest",
        element: <InvestPage />,
      },
      {
        path: "/stats",
        element: <StatsPage />,
      },
      {
        path: "/ranking",
        element: <RankingPage />,
      },
      {
        path: "/my",
        element: <MyPage />,
      },
      {
        path: "/my/settings",
        element: <MySettingsPage />,
      },
      {
        path: "/my/storage",
        element: <MyStoragePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
