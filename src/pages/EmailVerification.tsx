import {
  Flex,
  GuideList,
  MobileBreak,
  Text
} from '@/components/common/Wrapper';
import { useVerifyEmail } from '@/hooks/mutation';
import useSendVerifyEmail from '@/hooks/mutation/useSendVerifyEmail';
import RoutePath from '@/routes/routePath';
import { media } from '@/styles';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { color, typography } from 'wowds-tokens';
import Box from 'wowds-ui/Box';
import Button from 'wowds-ui/Button';
import TextField from 'wowds-ui/TextField';

interface EmailVerificationState {
  email: string;
  previousMemberId: number;
  previousGithubHandle: string;
  currentGithubHandle: string;
}

type VerificationFormData = {
  verificationCode: string;
};

export const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as EmailVerificationState;
  const { sendVerifyEmail } = useSendVerifyEmail();
  const { verifyEmailAsync, isPending } = useVerifyEmail();

  const [hasSent, setHasSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const { control, handleSubmit, setError, clearErrors } =
    useForm<VerificationFormData>({
      mode: 'onChange',
      defaultValues: {
        verificationCode: ''
      }
    });

  const verificationCode = useWatch({
    control,
    name: 'verificationCode',
    defaultValue: ''
  });
  const isCodeValid = /^\d{6}$/.test(verificationCode.trim());

  const isValidState =
    state?.email &&
    state?.previousMemberId !== undefined &&
    state?.previousMemberId !== null;

  const maskedEmail = state?.email
    ? state.email.replace(/(.{3})(.*)(@.*)/, '$1***$3')
    : '';

  useEffect(() => {
    if (!isValidState) {
      toast.error('인증 링크가 만료되었거나 잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    if (state?.previousGithubHandle && state?.currentGithubHandle) {
      localStorage.setItem('previousGithubHandle', state.previousGithubHandle);
      localStorage.setItem('currentGithubHandle', state.currentGithubHandle);
    }
  }, [state, isValidState, navigate]);

  useEffect(() => {
    if (timer <= 0) return;

    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleSendEmail = () => {
    if (!isValidState || !state?.previousMemberId || timer > 0) return;

    sendVerifyEmail(state.previousMemberId);
    setTimer(60);

    if (!hasSent) {
      setHasSent(true);
    }
  };

  const onSubmit = async (data: VerificationFormData) => {
    if (!isCodeValid || isPending) return;

    try {
      await verifyEmailAsync(data.verificationCode);
      toast.success('본인 인증이 완료되었습니다.');

      navigate(RoutePath.EmailVerificationServerRedirect, {
        replace: true,
        state: { isDirectVerified: true }
      });
    } catch {
      setError('verificationCode', {
        type: 'manual',
        message: '* 유효하지 않거나 만료된 인증코드에요.'
      });
    }
  };

  return (
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="column"
      align="flex-start"
      justify="space-between">
      <Flex
        direction="column"
        justify="space-between"
        css={css`
          flex: 1;
          width: 100%;
          ${media.pc} {
            justify-content: center;
            gap: 60px;
          }
        `}>
        <Flex
          gap="xl"
          direction="column"
          css={css`
            width: 100%;
            ${media.pc} {
              gap: 60px;
            }
          `}>
          <Flex direction="column" align="flex-start" gap="sm">
            <EmailVerificationTitle>본인 인증하기</EmailVerificationTitle>
            <Text
              typo="body1"
              css={css`
                ${media.pc} {
                  width: 100%;
                  text-align: center;
                }
              `}>
              기존에 입력하신 본인 이메일을 통해 현재 계정의 <MobileBreak />
              주인이 본인임을 확인해요. <br />
              이메일로 보낸 메일을 <MobileBreak />
              확인해주세요!
            </Text>
          </Flex>

          <Flex
            gap="xs"
            direction="column"
            align="flex-start"
            css={css`
              width: 100%;
              ${media.pc} {
                align-items: center;
              }
            `}>
            <Box
              text={
                <Flex justify="flex-start" gap="xs">
                  <Text typo="body1" color="sub">
                    이메일
                  </Text>
                  <Text typo="body1">{maskedEmail}</Text>
                </Flex>
              }
              status="success"
            />

            <GuideList>
              <li>메일 전송이 최대 30분 가량 늦어질 수 있어요.</li>
              <li>
                메일이 보이지 않는 경우 스팸 메일함을 확인해주시고, 스팸
                메일함에도 없을 경우 카카오톡 채널로 문의해주세요.
              </li>
              <li>
                만약 이메일 수신 이후에 인증 버튼을 눌렀음에도 제대로 인증이
                되지 않는 경우, 해당 브라우저에서 다시 가입 절차를 진행해주세요.
              </li>
            </GuideList>

            {hasSent && (
              <InputFormWrapper>
                <Controller
                  name="verificationCode"
                  control={control}
                  rules={{
                    required: '* 인증코드를 입력해주세요.',
                    pattern: {
                      value: /^\d{6}$/,
                      message: '* 6자리 숫자를 입력해주세요.'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="인증코드"
                      error={fieldState.invalid}
                      ref={field.ref}
                      value={field.value}
                      onChange={(e) => {
                        const rawValue =
                          typeof e === 'string'
                            ? e
                            : (e as React.ChangeEvent<HTMLInputElement>)?.target
                                ?.value || '';
                        const numericValue = rawValue
                          .replace(/\D/g, '')
                          .slice(0, 6);

                        if (fieldState.error) {
                          clearErrors('verificationCode');
                        }

                        field.onChange(numericValue);
                      }}
                      onBlur={field.onBlur}
                      helperText={fieldState.error?.message}
                      placeholder="인증코드 6자리 입력"
                    />
                  )}
                />
              </InputFormWrapper>
            )}
          </Flex>
        </Flex>

        <ButtonWrapper>
          {!hasSent ? (
            <Button
              type="button"
              style={{ width: '100%' }}
              onClick={handleSendEmail}>
              인증코드 받기
            </Button>
          ) : (
            <Flex direction="column" gap="xs" style={{ width: '100%' }}>
              <Flex gap="sm" style={{ width: '100%' }}>
                <Button
                  type="button"
                  variant="outline"
                  style={{ width: '100%' }}
                  onClick={handleSendEmail}
                  disabled={timer > 0}>
                  인증코드 다시 받기
                </Button>
                <Button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor:
                      isCodeValid && !isPending
                        ? color.primary
                        : color.darkDisabled,
                    color: 'white'
                  }}
                  disabled={!isCodeValid || isPending}>
                  인증 완료하기
                </Button>
              </Flex>

              {timer > 0 && (
                <TimerHelperText typo="label2">
                  인증코드는 {timer}초 후 다시 받을 수 있어요.
                </TimerHelperText>
              )}
            </Flex>
          )}
        </ButtonWrapper>
      </Flex>
    </Container>
  );
};

const Container = styled(Flex)`
  position: relative;
  min-height: 100vh;
  background-color: ${color.backgroundAlternative};
  padding: 40px 16px;
  width: 100vw;
  ${media.pc} {
    min-height: calc(100vh - var(--header-height, 0px));
    align-items: center;
  }
`;

const EmailVerificationTitle = styled(Text)`
  ${typography.h1}
  ${media.pc} {
    ${typography.display2}
    width: 100%;
    text-align: center;
  }
`;

const InputFormWrapper = styled.div`
  width: 100%;
  height: 84.8px;
  margin-top: 16px;
  ${media.pc} {
    max-width: 328px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  ${media.pc} {
    max-width: 328px;
  }
`;

const TimerHelperText = styled(Text)`
  color: ${color.error};
  padding-left: 4px;
`;
