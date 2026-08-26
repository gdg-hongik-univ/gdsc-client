import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Flex, GuideList, Space, Text } from '@/components/common/Wrapper';
import { useStudentVerification } from '@/hooks/auth';
import RoutePath from '@/routes/routePath';
import { media } from '@/styles';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { color, space, typography } from 'wowds-tokens';
import Button from 'wowds-ui/Button';
import TextField from 'wowds-ui/TextField';

/* 재학생 인증 페이지 */
export const StudentVerification = () => {
  const navigate = useNavigate();
  //TODO: 추후 pending 상태 백엔드 API 수정하면 반영해둘것.
  const [, setPending] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const {
    onSubmitEmail,
    control,
    isValid,
    onVerifyStudent,
    isPending,
    getValues
  } = useStudentVerification();

  const isStudentVerified = async () => {
    const univStatus = await onVerifyStudent();
    if (univStatus === 'UNSATISFIED') {
      setPending(true);
    } else {
      navigate(RoutePath.Dashboard);
    }
  };

  useEffect(() => {
    isStudentVerified();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isClicked) return;

    setIsClicked(true);
    try {
      await onSubmitEmail();
      const inputEmail = getValues ? getValues('univEmail') : '';
      const EXPIRE_SECONDS = 60;
      const expiresAt = Date.now() + EXPIRE_SECONDS * 1000;
      sessionStorage.setItem('student_verify_expires_at', String(expiresAt));

      navigate(RoutePath.StudentVerificationCode, {
        state: { email: inputEmail }
      });
    } catch (error) {
      // 에러 발생시 중단
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <Wrapper direction="column" justify="space-between" align="flex-start">
      {isPending && <LoadingSpinner />}
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
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: '* 이메일을 입력해주세요.'
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]/,
                  message: '* 이메일 형식을 지켜주세요.'
                }
              }}
              render={({ field, fieldState }) => (
                <EmailContainer>
                  <TextFieldWrapper>
                    <TextField
                      style={{ minWidth: '100%' }}
                      ref={field.ref}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                      error={fieldState.invalid}
                      placeholder="이메일 주소를 입력하세요"
                      label="학교 이메일"
                      helperText={fieldState.error?.message}
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
          <ButtonContainer>
            <ButtonWrapper>
              <Button
                disabled={!isValid || isClicked}
                style={{
                  width: '100%',
                  backgroundColor: isValid ? color.primary : color.darkDisabled,
                  color: 'white'
                }}>
                인증코드 받기
              </Button>
            </ButtonWrapper>
            <StudentGuideLink
              color={color.sub}
              to={RoutePath.StudentEmailLinkGuideLink}
              target="_blank">
              학교 이메일이 무엇인가요?
            </StudentGuideLink>
          </ButtonContainer>
        </form>
      </Flex>
    </Wrapper>
  );
};

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

const TextFieldWrapper = styled.div`
  flex: 1;
  height: 84.8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${space.xs};
  margin-top: auto;

  ${media.pc} {
    align-items: center;
    margin-top: 60px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  ${media.pc} {
    max-width: 328px;
  }
`;
