import { Flex, Space, Text } from '@/components/common/Wrapper';
import * as Sentry from '@sentry/react';
import { media } from '@/styles';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { color } from 'wowds-tokens';
import Button from 'wowds-ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line import/namespace
    Sentry.captureMessage('404 Page Not Found', {
      extra: {
        pathname: location.pathname
      }
    });
  }
  return (
    <NotfoundWrapper>
      <Space height={100} />
      <Flex gap="sm" direction="column">
        <Img src={'/notfound.png'} width={300} height={50} />
        <Text typo="h1">오류가 발생했어요.</Text>
        <Text typo="body1">요청하신 페이지를 찾을 수 없어요.</Text>
      </Flex>
      <ButtonContainer>
        <Button
          style={{ maxWidth: '328px', width: '100%' }}
          onClick={() => {
            navigate('/');
          }}>
          메인 화면으로 돌아가기
        </Button>
      </ButtonContainer>
    </NotfoundWrapper>
  );
};

export default NotFoundPage;

const Img = styled.img`
  object-fit: cover;
`;

const NotfoundWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  min-height: calc(100vh - var(--header-height, 0px));
  width: 100%;
  margin: 0px -16px;
  padding: 0px 16px;
  padding-top: 40px;
  padding-bottom: 28px;
  background-color: ${color.backgroundAlternative};
  ${media.mobile} {
    width: 100vw;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 1.75rem;
  padding: 1rem 0.75rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
