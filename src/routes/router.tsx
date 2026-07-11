import { createBrowserRouter, Navigate } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";
import NavLayout from "@/layouts/NavLayout";
import TopBarLayout from "@/layouts/TopBarLayout";

import SplashPage from "@/pages/auth/SplashPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import HomePage from "@/pages/home/HomePage";
import NewsPage from "@/pages/news/NewsPage";
import NewsDetailPage from "@/pages/news/NewsDetailPage";
import QuizPage from "@/pages/quiz/QuizPage";
import InvestLayout from "@/pages/invest/InvestLayout";
import InvestPage from "@/pages/invest/trade/InvestPage";
import StatsPage from "@/pages/invest/stats/StatsPage";
import RankingPage from "@/pages/invest/ranking/RankingPage";
import MyPage from "@/pages/my/MyPage";
import MySettingsPage from "@/pages/my/MySettingsPage";
import MyStoragePage from "@/pages/my/MyStoragePage";
import ShowcasePage from "@/pages/_showcase/ShowcasePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "splash",
        element: <SplashPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },

      {
        element: <NavLayout />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "news",
            element: <NewsPage />,
          },
          {
            path: "invest",
            element: <InvestLayout />,
            children: [
              {
                index: true,
                element: <InvestPage />,
              },
              {
                path: "stats",
                element: <StatsPage />,
              },
              {
                path: "ranking",
                element: <RankingPage />,
              },
            ],
          },
          {
            path: "my",
            element: <MyPage />,
          },
        ],
      },

      {
        element: <TopBarLayout />,
        children: [
          {
            path: "news/:newsId",
            element: <NewsDetailPage />,
          },
          {
            path: "quiz",
            element: <QuizPage />,
          },
          {
            path: "my/settings",
            element: <MySettingsPage />,
          },
          {
            path: "my/storage",
            element: <MyStoragePage />,
          },
        ],
      },

      {
        path: "showcase",
        element: <ShowcasePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
