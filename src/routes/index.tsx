import App from '@/App';
import AuthAccessGuard from '@/components/auth/guard/AuthAccessGuard';
import PaymentAccessGuard from '@/components/auth/guard/PaymentAccessGuard';
import VerificationGuard from '@/components/auth/guard/VerificationGuard';
import Layout from '@/components/layout/Layout';
import {
  Auth,
  AuthServerRedirectNavigate,
  Dashboard,
  EmailVerification,
  // EmailVerificationServerRedirect,
  FAQ,
  JoinDiscord,
  PaymentsCheckout,
  PaymentsFail,
  PaymentsSuccess,
  SignUp,
  StudentVerification,
  UpdatedStudentVerification
  // StudentVerificationServerRedirect
} from '@/pages';
import { DiscordConnect } from '@/pages/DiscordConnect';
import { DiscordGuide } from '@/pages/DiscordGuide';
import NotFoundPage from '@/pages/NotFound';
import { EmailVerificationServerRedirect } from '@/pages/redirect/EmailVerificationServerRedirect';
import { StudentVerificationServerRedirect } from '@/pages/redirect/StudentVerificationServerRedirect';
import RoutePath from '@/routes/routePath';
import * as Sentry from '@sentry/react';
import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);

export const Routers = () => {
  return <RouterProvider router={router} />;
};

// TODO: error page, meta tag
const router = sentryCreateBrowserRouter([
  {
    path: RoutePath.Index,
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: RoutePath.FAQ, element: <FAQ /> },
      {
        path: RoutePath.AuthServerRedirect,
        element: <AuthServerRedirectNavigate />
      },
      {
        path: RoutePath.StudentVerificationServerRedirect,
        element: <StudentVerificationServerRedirect />
      },
      {
        path: RoutePath.EmailVerificationServerRedirect,
        element: <EmailVerificationServerRedirect />
      },
      {
        path: RoutePath.GithubSignin,
        children: [{ index: true, element: <Auth /> }]
      },
      {
        path: RoutePath.StudentVerification,
        element: <AuthAccessGuard />,
        children: [
          {
            index: true,
            element: (
              <VerificationGuard guardType="StudentVerification">
                <Suspense fallback="..loading">
                  <StudentVerification />
                </Suspense>
              </VerificationGuard>
            )
          },
          {
            path: 'code',
            element: (
              <VerificationGuard guardType="StudentVerification">
                <Suspense fallback="..loading">
                  <UpdatedStudentVerification />
                </Suspense>
              </VerificationGuard>
            )
          }
        ]
      },
      {
        path: RoutePath.Signup,
        element: <AuthAccessGuard />,
        children: [
          {
            index: true,
            element: (
              <VerificationGuard guardType="SignUp">
                <SignUp />
              </VerificationGuard>
            )
          }
        ]
      },
      {
        path: RoutePath.EmailVerification,
        element: <AuthAccessGuard />,
        children: [
          {
            index: true,
            element: <EmailVerification />
          }
        ]
      },
      {
        path: RoutePath.Home,
        element: <AuthAccessGuard />,
        children: [
          {
            path: RoutePath.Dashboard,
            element: <Dashboard />
          },
          {
            path: RoutePath.Discord,
            children: [
              {
                index: true,
                element: (
                  <VerificationGuard guardType="Discord">
                    <JoinDiscord />
                  </VerificationGuard>
                )
              }
            ]
          },
          {
            path: RoutePath.DiscordConnect,
            children: [
              {
                index: true,
                element: (
                  <VerificationGuard guardType="Discord">
                    <DiscordConnect />
                  </VerificationGuard>
                )
              }
            ]
          },
          {
            path: RoutePath.DiscordGuide,
            element: <DiscordGuide />
          }
        ]
      },
      {
        path: RoutePath.PaymentsCheckout,
        element: <PaymentAccessGuard />,
        children: [{ index: true, element: <PaymentsCheckout /> }]
      },
      {
        path: RoutePath.PaymentsFail,
        element: <AuthAccessGuard />,
        children: [{ index: true, element: <PaymentsFail /> }]
      },
      {
        path: RoutePath.PaymentsSuccess,
        element: <PaymentsSuccess />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
