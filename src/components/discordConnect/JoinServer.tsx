import {
  DesktopOnly,
  Flex,
  MobileOnly,
  Space,
  Text
} from '@/components/common/Wrapper';
import useGetDiscordJoined from '@/hooks/query/useGetDiscordJoined';
import RoutePath from '@/routes/routePath';
import { media } from '@/styles';
import { DiscordFormValues } from '@/types/discord';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { color, typography } from 'wowds-tokens';
import Box from 'wowds-ui/Box';
import Button from 'wowds-ui/Button';
import TextButton from 'wowds-ui/TextButton';

const FETCH_INTERVAL = 5000;

export const JoinServer = ({ onNext }: { onNext: () => void }) => {
  const { getValues } = useFormContext<DiscordFormValues>();
  const [callQuery, setCallQuery] = useState(false);

  // 초기에 5초 후에 isEnabled를 true로 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallQuery(true);
    }, FETCH_INTERVAL);

    return () => clearTimeout(timer);
  }, []);

  const { data } = useGetDiscordJoined(getValues('discordUsername'), callQuery);

  useEffect(() => {
    if (data?.isJoined) setCallQuery(false);
  }, [data]);

  return (
    <Wrapper direction="column" justify="space-between">
      <Flex direction="column" align="flex-start">
        <Text
          css={css`
            ${media.mobile} {
              ${typography.h1};
            }
            ${media.pc} {
              ${typography.display2};
              text-align: center;
              width: 100%;
            }
          `}>
          서버에 합류하세요.
        </Text>
        <Space height="lg" />
        <Text
          typo="body1"
          css={css`
            ${media.pc} {
              text-align: center;
              width: 100%;
            }
          `}>
          아래 버튼을 통해 GDG Hongik Univ. 디스코드 서버로 이동해서 가입하세요.
        </Text>
        <MobileOnly>
          <Space height="lg" />
          <Text typo="body1">
            서버에 가입 후 <strong>#명령어</strong> 채널에서 본인의 디스코드
            계정을 연동할 수 있어요.
            <br />
            <br />
            서버 합류 후, 다시 돌아와서 연동 절차를 마무리해주세요.
          </Text>
        </MobileOnly>
      </Flex>

      <DesktopOnlyWrapper>
        <Box
          text={
            <Flex direction="column" align="center" gap="md">
              <Text
                typo="body1"
                css={css`
                  text-align: center;
                `}>
                서버에 가입 후 <strong>#명령어</strong> 채널에서 본인의 디스코드
                계정을 연동할 수 있어요.
                <br />
                서버 합류 후, 다시 돌아와서 연동 절차를 마무리해주세요.
              </Text>
              <TextButton
                text="GDG Hongik Univ. 공식 디스코드 서버↗︎"
                style={{ color: color.discord }}
                onClick={() =>
                  window.open(RoutePath.GDGHongikDiscord, '_blank')
                }
              />
            </Flex>
          }
        />
      </DesktopOnlyWrapper>

      <Flex direction="column" gap="xs" style={{ marginTop: 'auto' }}>
        <MobileOnly>
          <TextButton
            text="GDG Hongik Univ. 공식 디스코드 서버↗︎"
            style={{ color: color.discord, margin: 'auto' }}
            onClick={() => window.open(RoutePath.GDGHongikDiscord, '_blank')}
          />
        </MobileOnly>

        <ButtonWrapper>
          <Button
            style={{
              width: '100%',
              backgroundColor: callQuery
                ? color.darkDisabled
                : data?.isJoined
                  ? color.primary
                  : color.darkDisabled,
              color: 'white'
            }}
            onClick={() => {
              onNext();
            }}
            disabled={!data?.isJoined}>
            {callQuery
              ? '합류 여부를 확인 중이에요.'
              : data?.isJoined
                ? '서버 합류가 확인되었어요.'
                : '합류가 확인되면 넘어갈 수 있어요.'}
          </Button>
        </ButtonWrapper>

        <Text
          typo="body2"
          color="sub"
          css={css`
            text-align: center;
          `}>
          합류가 확인되지 않을 경우 <br />
          카카오톡 채널을 통해 코어멤버에게 문의해주세요!
        </Text>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled(Flex)`
  max-width: 650px;
  ${media.mobile} {
    height: 100%;
  }
  ${media.pc} {
    margin-top: 60px;
    gap: 100px;
  }
`;

const DesktopOnlyWrapper = styled(DesktopOnly)`
  ${media.pc} {
    width: 100%;
    max-width: 653px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  ${media.pc} {
    max-width: 328px;
  }
`;
