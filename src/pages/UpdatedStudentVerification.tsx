// import { Input } from '@/components/common/Input';
// import GlobalSize from '@/constants/globalSize';
import { Flex, GuideList, Space, Text } from '@/components/common/Wrapper';
import { useStudentVerification } from '@/hooks/auth';
import RoutePath from '@/routes/routePath';
import { media } from '@/styles';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { color, space, typography } from 'wowds-tokens';
import Button from 'wowds-ui/Button';
import TextField from 'wowds-ui/TextField';
import { Modal } from '../components/common/Modal';
import { isAxiosError } from 'axios';

export default function UpdatedStudentVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevEmail = location.state?.email || '';

  //TODO: 추후 pending 상태 백엔드 API 수정하면 반영해둘것.
  const [, setPending] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    onSubmitCode,
    onResendEmail,
    control,
    isValid,
    onVerifyStudent,
    setValue,
    setError
  } = useStudentVerification();

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (prevEmail) {
      setValue('univEmail', prevEmail);
    }
  }, [prevEmail, setValue]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const isStudentVerified = async () => {
      const univStatus = await onVerifyStudent();
      if (univStatus === 'UNSATISFIED') {
        setPending(true);
      } else {
        navigate(RoutePath.Dashboard);
      }
    };
    isStudentVerified();
  }, [onVerifyStudent, navigate]);

  const handleResendCode = async () => {
    if (timeLeft > 0) return;
    try {
      if (onResendEmail) {
        await onResendEmail(prevEmail);
      }
      setTimeLeft(60);
      setIsRunning(true);
    } catch {
      setError('verificationCode', {
        type: 'manual',
        message:
          '* 재발송 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isClicked) return;

    setIsClicked(true);
    try {
      await onSubmitCode();
      setIsModalOpen(true);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorCode = error.response.data?.code;
        switch (errorCode) {
          case 'UNIV_EMAIL_VERIFICATION_CODE_NOT_SENT':
            setError('verificationCode', {
              type: 'manual',
              message:
                '* 인증 메일이 발송되지 않았거나 만료되었어요. 재발송을 눌러주세요.'
            });
            break;
          case 'EMAIL_VERIFICATION_CODE_MISMATCH':
            setError('verificationCode', {
              type: 'manual',
              message: '* 인증코드가 일치하지 않아요. 다시 확인해주세요.'
            });
            break;
          default:
            setError('verificationCode', {
              type: 'manual',
              message:
                error.response.data?.message ||
                '* 유효하지 않거나 만료된 인증코드예요.'
            });
            break;
        }
      } else {
        setError('verificationCode', {
          type: 'manual',
          message: '* 네트워크 연결 상태를 확인해주세요.'
        });
      }
    } finally {
      setIsClicked(false);
    }
  };

  const handleReturn = () => {
    setIsModalOpen(false);
    navigate(RoutePath.Dashboard);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Wrapper direction="column" justify="space-between" align="flex-start">
      <Flex
        gap="xl"
        direction="column"
        justify="flex-start"
        css={css`
          flex: 1;
          ${media.pc} {
            flex: none;
            justify-content: center;
            max-width: 500px;
            gap: 60px;
          }
        `}>
        <Flex direction="column" align="flex-start" gap="sm">
          <StudentVerificationTitle>재학생 인증하기</StudentVerificationTitle>
          <Text
            typo="body1"
            css={css`
              ${media.pc} {
                width: 100%;
                text-align: center;
              }
            `}>
            준회원으로 활동하기 위해서 재학생 인증 과정이 필요해요.
            <br />
            학교 이메일을 통해 재학생 인증을 해주세요!
          </Text>
        </Flex>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100%',
            flex: 1
          }}>
          <Flex
            direction="column"
            align="flex-start"
            css={css`
              width: 100% ${media.pc} {
                align-items: center;
              }
            `}>
            <Controller
              name="univEmail"
              control={control}
              defaultValue={prevEmail}
              render={({ fieldState }) => (
                <EmailContainer>
                  <TextFieldWrapper disabled>
                    <TextField
                      style={{ minWidth: '100%' }}
                      value={prevEmail}
                      error={fieldState.invalid}
                      placeholder="이메일 주소를 입력하세요"
                      label="학교 이메일"
                    />
                  </TextFieldWrapper>
                  <Text
                    typo="body1"
                    style={{
                      height: '84.8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    @g.hongik.ac.kr
                  </Text>
                </EmailContainer>
              )}
            />

            <Space height="xs" />
            <GuideList>
              <li>메일 전송이 최대 30분 가량 늦어질 수 있어요.</li>
              <li>
                메일 전송이 되지 않을 경우 카카오톡 채널을 통해 코어팀 멤버에게
                문의해주세요.
              </li>
            </GuideList>
          </Flex>

          <Flex
            direction="column"
            align="flex-start"
            css={css`
              margin-top: 40px;
              ${media.pc} {
                align-items: center;
              }
            `}>
            <Controller
              name="verificationCode"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: '* 인증코드를 입력해주세요.'
                },
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: '* 6자리 숫자를 정확히 입력해주세요.'
                }
              }}
              render={({ field, fieldState }) => (
                <EmailContainer>
                  <TextFieldWrapper>
                    <TextField
                      style={{ minWidth: '100%' }}
                      ref={field.ref}
                      onChange={(value: string) => {
                        const onlyNumber = value
                          .replace(/[^0-9]/g, '')
                          .slice(0, 6);
                        field.onChange(onlyNumber);
                      }}
                      onBlur={field.onBlur}
                      value={field.value}
                      error={fieldState.invalid}
                      placeholder="인증코드를 입력하세요"
                      label="인증코드"
                      helperText={fieldState.error?.message}
                    />
                  </TextFieldWrapper>
                </EmailContainer>
              )}
            />
          </Flex>
          <ButtonContainer>
            <ButtonWrapper>
              <Button
                type="button"
                variant="outline"
                disabled={timeLeft > 0}
                style={{
                  flex: 1,
                  borderColor:
                    timeLeft === 0 ? color.primary : color.darkDisabled,
                  color: timeLeft === 0 ? color.primary : color.darkDisabled
                }}
                onClick={handleResendCode}>
                인증코드 다시 받기
              </Button>

              <Button
                type="submit"
                disabled={!isValid || isClicked}
                style={{
                  flex: 1,
                  backgroundColor: isValid ? color.primary : color.darkDisabled,
                  color: 'white'
                }}>
                인증 완료하기
              </Button>
            </ButtonWrapper>
            {timeLeft > 0 ? (
              <Text typo="body2" color="error">
                인증코드는 {timeLeft}초 후 다시 받을 수 있어요.
              </Text>
            ) : (
              <Text typo="body2" color="error">
                인증 코드를 다시 요청할 수 있어요.
              </Text>
            )}
            <StudentGuideLink
              color={color.sub}
              to={RoutePath.StudentEmailLinkGuideLink}
              target="_blank">
              학교 이메일이 무엇인가요?
            </StudentGuideLink>
          </ButtonContainer>
        </form>
      </Flex>
      <DesktopModalWrapper>
        <Modal isOpen={isModalOpen} onClose={handleModalClose} width="652px">
          <ModalWrapper>
            <ModalTextWrapper>
              <Text typo="h1">재학생 인증 성공</Text>
              <div>
                <Text typo="body1">홍익대학교 재학생 인증에 성공했어요.</Text>
                <Text typo="body1" color="primary">
                  가입을 진행하던 탭으로 돌아가 주세요.
                </Text>
              </div>
            </ModalTextWrapper>
            <ModalButtonContainer>
              <ButtonWrapper>
                <BackButton onClick={handleReturn}>돌아가기</BackButton>
              </ButtonWrapper>
            </ModalButtonContainer>
          </ModalWrapper>
        </Modal>
      </DesktopModalWrapper>

      {isModalOpen && (
        <MobileSuccessView>
          <MobileTopContent>
            <Text typo="h1" style={{ textAlign: 'left', width: '100%' }}>
              재학생 인증 성공
            </Text>
            <MobileSubTextGroup>
              <Text typo="body1">홍익대학교 재학생 인증에 성공했어요.</Text>
              <Text typo="body1" color="primary">
                가입을 진행하던 탭으로 돌아가 주세요.
              </Text>
            </MobileSubTextGroup>
          </MobileTopContent>

          <MobileBottomButtonWrapper>
            <BackButton onClick={handleReturn}>돌아가기</BackButton>
          </MobileBottomButtonWrapper>
        </MobileSuccessView>
      )}
    </Wrapper>
  );
}

const StudentVerificationTitle = styled(Text)`
  ${typography.h1}
  ${media.pc} {
    ${typography.display2}
    width: 100%;
    text-align: center;
  }
`;

const StudentGuideLink = styled(Link)`
  color: ${color.sub};
  text-decoration: underline;
  font-weight: 600;
  padding: ${space.sm};
  &:active {
    color: ${color.sub};
  }
  &:hover {
    color: ${color.sub};
  }
  &:visited {
    color: ${color.sub};
  }
  ${typography.label2};
`;

const Wrapper = styled(Flex)`
  position: relative;
  min-height: calc(100vh - var(--header-height, 0px));
  width: 100vw;
  margin: 0px -16px;
  padding: 40px 16px;
  background-color: ${color.mono50};
  ${media.pc} {
    min-height: calc(100vh - var(--header-height, 0px));
    align-items: center;
    justify-content: center;
  }
`;

const EmailContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  gap: ${space.xs};
`;

const TextFieldWrapper = styled.div<{ disabled?: boolean }>`
  flex: 1;
  height: 84.8px;

  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      user-select: none;
      cursor: not-allowed;
    `}
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${space.xs};
  margin-top: auto;
  ${media.pc} {
    margin-top: 60px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${space.sm};
  ${media.pc} {
    max-width: 328px;
  }
`;

const ModalTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  text-align: center;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${space.xs};
  margin-top: ${space.xl};
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 379px;
  gap: 40px;
`;

const DesktopModalWrapper = styled.div`
  display: none;
  ${media.pc} {
    display: block;
  }
`;

const MobileSuccessView = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: 2000;
  background-color: ${color.mono50};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 16px;
  ${media.pc} {
    display: none;
  }
`;

const MobileTopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  text-align: left;
`;

const MobileSubTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-align: left;
`;

const MobileBottomButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const BackButton = styled(Button)`
  width: 100%;
  background-color: ${color.primary};
  color: white;
`;
