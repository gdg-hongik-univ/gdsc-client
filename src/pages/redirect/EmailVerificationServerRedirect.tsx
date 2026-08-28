import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Flex, Text } from '@/components/common/Wrapper';
import { useVerifyEmail } from '@/hooks/mutation';
import RoutePath from '@/routes/routePath';
import { css } from '@emotion/react';
import { media } from '@/styles';
import styled from '@emotion/styled';
import { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { color } from 'wowds-tokens';
import Button from 'wowds-ui/Button';

export const EmailVerificationServerRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const {
    isSuccess: isMutationSuccess,
    isPending,
    verifyEmail
  } = useVerifyEmail();
  const [previousGithubHandle, setPreviousGithubHandle] = useState('');
  const [currentGithubHandle, setCurrentGithubHandle] = useState('');

  const location = useLocation();
  const isDirectVerified = location.state?.isDirectVerified ?? false;
  const isSuccess = isDirectVerified || isMutationSuccess;

  useLayoutEffect(() => {
    if (token) verifyEmail(token);

    const prevHandle = localStorage.getItem('previousGithubHandle') || '';
    const currHandle = localStorage.getItem('currentGithubHandle') || '';
    setPreviousGithubHandle(prevHandle);
    setCurrentGithubHandle(currHandle);
  }, [token, verifyEmail]);

  const handleButtonClick = () => {
    if (isSuccess) {
      navigate(RoutePath.Dashboard);
    } else {
      navigate(-1);
    }
  };

  return (
    <Wrapper direction="column">
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <Container direction="column" justify="space-between">
          <Flex
            direction="column"
            gap="xl"
            align="flex-start"
            css={css`
              ${media.pc}
              align-items: center;
            `}>
            <Text
              typo="h1"
              css={css`
                margin-top: 40px;
                ${media.pc} {
                  align-items: center;
                }
              `}>
              {isSuccess ? '본인 인증 성공' : '본인 인증 실패'}
            </Text>
            <TextContainer>
              {isSuccess ? (
                <Text typo="body1">
                  기존 계정{previousGithubHandle && `(${previousGithubHandle})`}
                  의 내용을 삭제하고
                  <br /> 새로운 계정
                  {currentGithubHandle && `(${currentGithubHandle})`}으로
                  이전했어요.
                  <br /> 가입 절차를 계속해서 진행해주세요.
                </Text>
              ) : (
                <Text typo="body1">
                  본인 인증에 실패했어요. 원래 페이지로 돌아가서 인증메일 다시
                  받기 버튼을 눌러주세요.
                </Text>
              )}
            </TextContainer>
          </Flex>
          <Button onClick={handleButtonClick}>
            {isSuccess ? '돌아가기' : '대시보드로 가기'}
          </Button>
        </Container>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Flex)`
  min-height: calc(100vh - var(--header-height, 0px));
  width: 100vw;
  margin: 0px -16px;
  padding: 0px 16px;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${color.mono50};
`;

const Container = styled(Flex)`
  position: relative;
  width: 100%;
  min-height: calc(100vh - var(--header-height, 0px));
  padding: 0 0 40px 0;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
