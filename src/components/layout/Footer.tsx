import { FooterGithubIcon, FooterInstagramIcon } from '@/assets/FooterIcons';
import { Logo } from '@/assets/LogoIcon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { media } from '@styles/theme';
import { Link, useLocation } from 'react-router-dom';
import { color } from 'wowds-tokens';
import { Flex, Text } from '../common/Wrapper';

const Footer = () => {
  const { pathname } = useLocation();
  const isLandingPage = pathname == '/';

  return (
    <Container $variant={isLandingPage ? 'landing' : 'full'}>
      <Flex
        direction="column"
        align="start"
        justify="flex-start"
        css={css`
          gap: 1.5rem;
          ${media.pc} {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            max-width: 993px;
            margin: 0 auto;
            padding: 0 1.5rem;
            box-sizing: border-box;
          }
        `}>
        <Flex
          direction="column"
          align="start"
          justify="flex-start"
          style={{ width: 'fit-content' }}
          css={css`
            gap: 1.5rem;
            ${media.pc} {
              gap: 1.875rem;
            }
          `}>
          <Flex direction="row" align="center" justify="flex-start" gap="xs">
            <Logo />
            <LogoText>GDG</LogoText>
            <SubLogoText>Hongik Univ.</SubLogoText>
          </Flex>

          <Flex direction="column" align="start" gap="md">
            <Link to={'https://wawoo.dev/'}>
              <Text typo="label2" style={{ textDecoration: 'underline' }}>
                와우디벨로퍼스
              </Text>
            </Link>
            <Link to={'https://www.gdghongik.com/onboarding'}>
              <Text typo="label2" style={{ textDecoration: 'underline' }}>
                학회 소개
              </Text>
            </Link>
            <Link to={'https://www.gdghongik.com/onboard-guide/community-rule'}>
              <Text typo="label2" style={{ textDecoration: 'underline' }}>
                GDG Hongik Univ. 회칙
              </Text>
            </Link>
            <Link
              to={
                'https://www.gdghongik.com/onboard-guide/community-guideline'
              }>
              <Text typo="label2" style={{ textDecoration: 'underline' }}>
                GDG Hongik Univ. 가이드라인
              </Text>
            </Link>
          </Flex>
        </Flex>

        <Flex
          direction="column"
          align="start"
          justify="flex-start"
          style={{ width: 'fit-content' }}
          css={css`
            gap: 1.5rem;
            ${media.pc} {
              gap: 1.25rem;
            }
          `}>
          <Flex
            gap="md"
            align="start"
            justify="start"
            style={{ width: 'fit-content' }}>
            <button
              onClick={() => {
                window.location.href = 'https://github.com/gdg-hongik-univ';
              }}>
              <FooterGithubIcon />
            </button>
            <button
              onClick={() => {
                window.location.href =
                  'https://www.instagram.com/gdg.hongikuniv';
              }}>
              <FooterInstagramIcon />
            </button>
          </Flex>
          <Flex direction="column" align="start">
            <Text typo="body3" color="sub">
              와우디벨로퍼스 | 서울특별시 동작구 상도로53길 8, 325동 606호
            </Text>
            <Text typo="body3" color="sub">
              대표 박유빈 | TEL 010-5938-0188 | 사업자등록번호 311-82-77953
            </Text>
            <Flex justify="flex-start" gap="xxs">
              <Link
                to={'https://docs.gdghongik.com/wowdevelopers/privacy-policy'}>
                <Text typo="body3" color="black">
                  개인정보처리방침
                </Text>
              </Link>
              <Text typo="body3">|</Text>
              <Link to={'https://docs.gdghongik.com/wowdevelopers/term-of-use'}>
                <Text typo="body3" color="black">
                  이용약관
                </Text>
              </Link>
              <Text typo="body3">|</Text>
              <Link to={'https://docs.gdghongik.com/wowdevelopers/refund'}>
                <Text typo="body3" color="black">
                  환불정책
                </Text>
              </Link>
            </Flex>
            <Text typo="body3" color="sub">
              © 2024. 와우디벨로퍼스 all rights reserved.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

const Container = styled.footer<{ $variant?: 'landing' | 'full' }>`
  width: 100%;
  padding: 1.5rem 1rem;

  background-color: ${color.backgroundAlternative};

  ${media.pc} {
    padding: 5.25rem 0;
  }
  ${media.mobile} {
    max-width: none;

    ${({ $variant }) =>
      $variant === 'landing' &&
      css`
        max-width: 475px;
      `}
  }
`;

const LogoText = styled.div`
  @font-face {
    font-family: 'Google Sans';
    src: url('/fonts/GoogleSans-Bold.ttf') format('truetype');
    font-style: normal;
  }
  font-family: 'Google Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${color.black};
`;
const SubLogoText = styled.div`
  @font-face {
    font-family: 'Google Sans';
    src: url('/fonts/GoogleSans-Regular.ttf') format('truetype');
    font-style: normal;
  }
  font-family: 'Google Sans', sans-serif;
  font-size: 14px;
  color: ${color.primary};
`;

export default Footer;
