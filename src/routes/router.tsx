import { createBrowserRouter, Navigate } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";
import NavLayout from "@/layouts/NavLayout";
import TopBarLayout from "@/layouts/TopBarLayout";
import RequireAuth from "@/routes/RequireAuth";
import RedirectIfAuth from "@/routes/RedirectIfAuth";

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
import ProfitHistoryPage from "@/pages/invest/stats/ProfitHistoryPage";
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
      // 공개 라우트 (로그인 불필요)
      {
        path: "splash",
        element: <SplashPage />,
      },
      // 로그인/회원가입 — 이미 로그인했으면 홈으로
      {
        element: <RedirectIfAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignupPage />,
          },
        ],
      },
      // 로그인 필요 라우트 — 미로그인 시 /login으로
      {
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            path: "onboarding",
            element: <OnboardingPage />,
          },
          {
            path: "news/:newsId",
            element: <NewsDetailPage />,
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
                path: "quiz",
                element: <QuizPage />,
              },
              {
                path: "invest/profit-history",
                element: <ProfitHistoryPage />,
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
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
