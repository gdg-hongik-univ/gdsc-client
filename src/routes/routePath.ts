import { BASE_URL } from '@/constants/environment';

const RoutePath = {
  Index: '/',
  Home: '/',

  FAQ: '/faq',

  Dashboard: '/dashboard',
  Discord: '/discord',
  DiscordConnect: '/discord/connect',
  DiscordGuide: '/discord/guide',

  GithubSignin: '/auth',
  StudentVerification: '/student-verification',
  Signup: '/signup',
  EmailVerification: '/email-verification',

  AuthGithubLoginRedirect: `${BASE_URL}/oauth2/authorization/github`,

  AuthServerRedirect: '/social-login/redirect',
  StudentVerificationServerRedirect: '/onboarding/verify-univ-email',
  EmailVerificationServerRedirect: '/onboarding/verify-email',
  GDGHongikLink: 'https://www.gdghongik.com',
  GDGHongikDiscord: 'https://discord.gg/dSV6vSEuGU',
  GitHubGuideLink: 'https://www.gdghongik.com/onboard-guide/github',
  StudentEmailLinkGuideLink:
    'https://www.gdghongik.com/onboard-guide/student-email',
  CommunityGuideLink:
    'https://www.gdghongik.com/onboard-guide/community-guideline',
  TermsLink: 'https://www.gdghongik.com/onboard-guide/community-rule',
  PersonalPrivacyLink: 'https://www.gdghongik.com/onboard-guide/privacy-policy',

  InstagramLink: 'https://www.instagram.com/gdg.hongikuniv/',
  DiscordRegisterLink: 'https://discord.com/register',
  DiscordCodeLink:
    'https://discord.com/channels/1001436927699980359/1082704130361004063',

  PaymentsCheckout: '/payments/checkout',
  PaymentsSuccess: '/payments/success',
  PaymentsFail: '/payments/fail'
} as const;

export default RoutePath;
