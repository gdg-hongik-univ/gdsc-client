import {
  JoinText,
  OnboardingLogo1,
  OnboardingLogo2
} from '@/assets/Onboarding';
import { OnboardingArrow } from '@/assets/OnboardingArrow';
import { Flex, Space, Text } from '@/components/common/Wrapper';

import { InformationBox } from '@/components/onboarding/InformationBox';
import { media } from '@/styles';
import { isAuthenticated } from '@/utils/auth';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { color, typography } from 'wowds-tokens';
import Button from 'wowds-ui/Button';

import Carousel from './components/onboarding/Carousel';
import RoutePath from './routes/routePath';

function App() {
  const navigate = useNavigate();

  return (
    <Wrapper direction="column" justify="flex-start" align="center">
      <BlueSection
        direction="column"
        align="flex-start"
        css={css`
          position: relative;
          padding: 16px 0px;
          height: 100dvh;
          justify-content: center;
          ${media.mobile} {
            justify-content: space-between;
          }
        `}>
        <Flex
          css={css`
            flex-direction: row-reverse;
            align-items: center;
            padding: 0px 50px;
            justify-content: center;
            ${media.mobile} {
              flex-direction: column;
              align-items: flex-end;
              padding: 0px;
            }
          `}>
          <Flex
            css={css`
              width: 100dvw;
              max-width: 700px;
              ${media.mobile} {
                max-width: 400px;
              }
            `}>
            <OnboardingLogo1 />
          </Flex>
          <Flex
            css={css`
              padding: 0px 16px;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              max-width: 480px;
              ${media.mobile} {
                align-items: flex-start;
              }
            `}>
            <Flex direction="column" align="flex-start">
              <Text
                color="backgroundNormal"
                css={css`
                  ${typography.display1};
                  font-weight: 800;
                  font-size: 50px;

                  ${media.mobile} {
                    ${typography.display2};
                    width: 100%;
                  }
                  white-space: nowrap;
                `}>
                Google Developer
                <br />
                Groups on Campus
              </Text>
              <Text
                color="backgroundNormal"
                css={css`
                  ${typography.display1};
                  font-weight: 800;
                  font-size: 50px;
                  ${media.mobile} {
                    margin-top: 12px;
                    ${typography.h2};
                    width: 100%;
                  }
                `}>
                Hongik University
              </Text>
            </Flex>
            <Flex
              css={css`
                width: 328px;
                margin-top: 46px;
                ${media.mobile} {
                  display: none;
                }
              `}>
              <Button
                variant="outline"
                onClick={() => {
                  if (isAuthenticated()) navigate(RoutePath.Dashboard);
                  else navigate(RoutePath.GithubSignin);
                }}>
                지금 지원하기
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          justify="flex-end"
          gap="xl"
          css={css`
            padding: 0px 16px;
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            ${media.mobile} {
              position: static;
              padding: 0px 16px;
            }
          `}>
          <Flex
            css={css`
              display: none;
              ${media.mobile} {
                display: flex;
              }
            `}>
            <Button
              variant="outline"
              onClick={() => {
                if (isAuthenticated()) navigate(RoutePath.Dashboard);
                else navigate(RoutePath.GithubSignin);
              }}>
              지금 지원하기
            </Button>
          </Flex>
          <OnboardingArrow />
        </Flex>
      </BlueSection>
      {
        // ----초반 블루 섹션 끝----
      }
      <Flex
        direction="column"
        css={css`
          background-color: ${color.white};
          width: 100%;
          height: 411px;
          padding: 16px;
          align-items: center;
          justify-content: center;
          gap: 16px;
          ${media.mobile} {
            align-items: flex-start;
          }
        `}>
        <Text
          color="primary"
          css={css`
            text-align: center;
            ${typography.display1};
            ${media.mobile} {
              text-align: left;
              ${typography.h1};
            }
          `}>
          모두에게 성장의 기회를 제공하는
          <br />
          홍익대학교 최대 규모의 <DisplayBreak />
          IT 커뮤니티
        </Text>
        <Space height={32} />
        <Text
          typo="body1"
          color="black"
          css={css`
            word-break: keep-all;
            text-align: center;
            line-height: 160%;
            ${media.mobile} {
              text-align: left;
            }
          `}>
          GDG는 Google Developers에서 제공되는 프로그램과 함께 운영되는 개발자
          커뮤니티 그룹이에요. <br />
          특히 GDG Hongik Univ.는 개발자에 관심이 있는 홍익대학교 학생이라면
          누구나 참여할 수 있어요!
        </Text>
      </Flex>
      <Flex
        direction="column"
        css={css`
          padding: 200px 16px;
          gap: 200px;
          ${media.mobile} {
            gap: 100px;
            padding: 100px 16px;
          }
        `}>
        <Flex direction="column">
          <Text
            color="black"
            css={css`
              text-align: center;
              ${typography.display2};
              ${media.mobile} {
                ${typography.h1};
              }
            `}>
            GDG와 함께 해요!
          </Text>
          <Space height={42} />
          <Flex direction="column" gap="sm">
            <InformationBox
              title="모집 기간"
              description="1차 지원 기간: 2월 19일 ~ 2월 28일"
              description2="2차 지원 기간: 3월 1일 ~ 3월 7일"
            />
            <InformationBox
              title="지원 자격"
              description="학과, 전공, 학년 무관 홍익대학교 학생이라면"
              description2="누구나 활동할 수 있어요."
            />
            <InformationBox
              title="지원 시 유의사항"
              description="GDG Hongik Univ. 커뮤니티 가이드라인 및 오픈 커뮤니티 
가이드라인을 준수해야 해요. 또한, 학기 당 
2만원의 회비가 있어요."
            />
          </Flex>
        </Flex>
        <Flex
          direction="column"
          align="center"
          css={css`
            ${media.mobile} {
              max-width: 400px;
            }
          `}>
          <Text
            color="black"
            css={css`
              text-align: center;
              ${typography.display2};
              ${media.mobile} {
                ${typography.h1};
              }
            `}>
            GDG에서는 이런 활동을 해요!
          </Text>
          <Space height={42} />
          <Carousel />
        </Flex>
        <Flex
          direction="column"
          align="center"
          css={css`
            gap: 78px;
            ${media.mobile} {
              gap: 16px;
            }
          `}>
          <Text
            color="black"
            css={css`
              text-align: center;
              ${typography.display2};
              ${media.mobile} {
                ${typography.h1};
              }
            `}>
            GDG에 대해 궁금한 점이 있나요?
          </Text>
          <SubButton size="sm" onClick={() => navigate(RoutePath.FAQ)}>
            FAQ 바로가기
          </SubButton>
        </Flex>
      </Flex>
      <BlueSection direction="column" justify="space-between">
        <Space height={60} />
        <Flex
          direction="column"
          align="center"
          gap="md"
          css={css`
            padding: 0 16px;
            max-width: 700px;
            max-height: 550px;
          `}>
          <JoinText />
          <OnboardingLogo2 />
        </Flex>
        <Space height={25} />
        <ApplyButton
          onClick={() => {
            if (isAuthenticated()) navigate(RoutePath.Dashboard);
            else navigate(RoutePath.GithubSignin);
          }}>
          지원하기
        </ApplyButton>
        <Space height={40} />
      </BlueSection>
      <Space height={48} />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled(Flex)`
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  background-color: #f8f8f8;

  ${media.mobile} {
    width: 100vw;
    max-width: 475px;
  }
`;
const DisplayBreak = styled.br`
  display: none;
  ${media.mobile} {
    display: block;
  }
`;
const BlueSection = styled(Flex)`
  height: calc(100vh - var(--header-height, 0px));
  background-color: ${color.primary};

  box-sizing: border-box;

  ${media.mobile} {
    width: 100vw;
    max-width: 475px;
    overflow: hidden;
  }
`;

const ApplyButton = styled.button`
  height: 44px;
  width: calc(100% - 32px);
  border-radius: 8px;
  max-width: 328px;

  background-color: ${color.white};
  color: ${color.primary};
  ${typography.h2};

  flex-shrink: 0;

  :disabled {
    background-color: ${color.mono400};
    color: ${color.mono100};
  }
`;
const SubButton = styled(Button)`
  width: 328px;
  background-color: ${color.primary};
  color: ${color.white};
  border-radius: 20px;
  padding: 16px 0;

  ${media.mobile} {
    width: 150px;
    padding: 12px 0;
  }
`;
