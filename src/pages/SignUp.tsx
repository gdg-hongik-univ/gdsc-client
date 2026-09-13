import { Flex, GuideList, Space, Text } from '@/components/common/Wrapper';
import DepartmentSelect from '@/components/signup/DepartmentSelect';
import GlobalSize from '@/constants/globalSize';
import { media } from '@/styles';
import { Controller, useForm } from 'react-hook-form';
import type { color as colorType } from 'wowds-tokens';
import { color, space, typography, color as wowColor } from 'wowds-tokens';
import Button from 'wowds-ui/Button';
import Checkbox from 'wowds-ui/Checkbox';
import TextField from 'wowds-ui/TextField';

import { GitHubIcon } from '@/assets/GitHubIcon';
import { LoadingForm } from '@/components/common/LoadingForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import RoutePath from '@/routes/routePath';
import { Suspense, useEffect, useState } from 'react';

import EmailInputField from '@/components/signup/EmailInputField';
import useCreateUserInfo from '@/hooks/mutation/useCreateUserInfo';
import { useGetAccountInfo } from '@/hooks/query';
import useCheckStudentId from '@/hooks/query/useCheckStudentId';
import usePreviousMemberInfo from '@/hooks/query/usePreviousMemberInfo';
import useAccountInfoStore from '@/hooks/zustand/useAccountInfo';
import { formatPhoneNumberInProgress } from '@/utils/phone';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';

export type FormStateType = {
  name: string;
  studentId: string;
  phone: string;
  department: string;
  email: string;
  emailDomain: string;
  terms: boolean;
  personalPrivacy: boolean;
};

type colorKey = keyof typeof colorType;

export const SignUp = () => {
  const { createInfo } = useCreateUserInfo();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previousStudentId, setPreviousStudentId] = useState('');

  useGetAccountInfo();
  const currentGithubHandle = useAccountInfoStore(
    (state) => state.githubHandle
  );

  const {
    control,
    formState: { isValid },
    handleSubmit,
    register,
    watch,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      studentId: '',
      phone: '',
      department: '',
      email: '',
      emailDomain: '',
      terms: false,
      personalPrivacy: false
    }
  });

  const studentId = watch('studentId');
  const { data: studentIdCheckData, dataUpdatedAt } =
    useCheckStudentId(studentId);
  const { data: previousMemberInfo, isLoading: isPreviousMemberInfoLoading } =
    usePreviousMemberInfo(previousStudentId);

  useEffect(() => {
    if (studentId && /^[A-C]{1}[0-9]{6}$/.test(studentId)) {
      trigger('studentId');
    }
  }, [dataUpdatedAt, studentId, trigger]);

  useEffect(() => {
    // previousMemberInfo 로딩이 완료되면 모달 열기
    if (
      !isPreviousMemberInfoLoading &&
      previousMemberInfo &&
      previousStudentId
    ) {
      setIsModalOpen(true);
    }
  }, [isPreviousMemberInfoLoading, previousMemberInfo, previousStudentId]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviousStudentId(studentId);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleChangeAccount = () => {
    setIsModalOpen(false);
    if (previousMemberInfo) {
      navigate(RoutePath.EmailVerification, {
        state: {
          email: previousMemberInfo.previousEmail,
          previousMemberId: previousMemberInfo.previousMemberId,
          previousGithubHandle: previousMemberInfo.previousGithubHandle,
          currentGithubHandle: currentGithubHandle
        }
      });
    }
  };
  const onSubmit = async (data: FormStateType) => {
    const { name, email, department, phone, studentId, emailDomain } = data;
    createInfo({
      name,
      studentId,
      phone,
      department,
      email: `${email}${emailDomain}`
    });
  };

  return (
    <Container>
      {isPreviousMemberInfoLoading && previousStudentId !== '' && (
        <LoadingSpinner />
      )}
      <PageTitle>기본 회원 정보 입력</PageTitle>
      <Space height={24} />
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <FieldRow>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: '* 정보를 입력해주세요.'
              },
              minLength: {
                value: 2,
                message: '* 두 글자 이상 입력해주세요.'
              }
            }}
            render={({ field, fieldState }) => (
              <InputFormWrapper>
                <TextField
                  label="이름"
                  error={fieldState.invalid}
                  ref={field.ref}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  helperText={fieldState.error?.message}
                  placeholder="김홍익"
                />
              </InputFormWrapper>
            )}
          />
          <Controller
            name="studentId"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: '* 정보를 입력해주세요.'
              },
              pattern: {
                value: /^[A-C]{1}[0-9]{6}$/,
                message: '* C000000 형식으로 입력해주세요.'
              },
              validate: () => {
                if (studentIdCheckData?.isDuplicate) {
                  return '* 이미 등록된 학번입니다.';
                }
                return true;
              }
            }}
            render={({ field, fieldState }) => {
              const isDuplicateError =
                studentIdCheckData?.isDuplicate &&
                fieldState.error?.message?.includes('이미 등록된 학번입니다');

              return (
                <InputFormWrapper>
                  <TextField
                    label="학번"
                    error={fieldState.invalid}
                    ref={field.ref}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    helperText={
                      isDuplicateError ? (
                        <HelperTextWrapper>
                          <span>{fieldState.error?.message}</span>
                          <RegisterButton onClick={handleRegisterClick}>
                            새로 가입하기
                          </RegisterButton>
                        </HelperTextWrapper>
                      ) : (
                        fieldState.error?.message
                      )
                    }
                    placeholder="내용을 입력하세요"
                  />
                </InputFormWrapper>
              );
            }}
          />
        </FieldRow>
        <FieldRow>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: '* 정보를 입력해주세요.'
              },
              pattern: {
                value: /^010[0-9]{8}$/,
                message: '* 01000000000 형식으로 입력해주세요.'
              },
              maxLength: {
                value: 13,
                message: '* 13자 이하로 입력해주세요.'
              }
            }}
            render={({ field, fieldState }) => (
              <InputFormWrapper>
                <TextField
                  label="전화번호"
                  error={fieldState.invalid}
                  ref={field.ref}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={formatPhoneNumberInProgress(field.value)}
                  helperText={fieldState.error?.message}
                  placeholder="내용을 입력하세요"
                />
              </InputFormWrapper>
            )}
          />
          <SuspenseWrapper>
            <Suspense fallback={<LoadingForm label="학과" />}>
              <DepartmentSelect control={control} />
            </Suspense>
          </SuspenseWrapper>
        </FieldRow>
        <EmailInputField control={control} />
        <BottomSection direction="column" gap="lg">
          <CheckboxContainer>
            <Controller
              control={control}
              defaultValue={false}
              rules={{
                value: true,
                required: true
              }}
              {...register('terms')}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  label={
                    <Text
                      typo="body1"
                      color={field.value ? 'textBlack' : 'sub'}>
                      <GuideLink
                        to={RoutePath.CommunityGuideLink}
                        target="_blank"
                        color={field.value ? 'textBlack' : 'sub'}>
                        커뮤니티 가이드라인
                      </GuideLink>{' '}
                      및{' '}
                      <GuideLink
                        to={RoutePath.TermsLink}
                        target="_blank"
                        color={field.value ? 'textBlack' : 'sub'}>
                        GDG Hongik Univ. 회칙
                      </GuideLink>
                      에 동의합니다.
                    </Text>
                  }
                />
              )}
            />
            <Controller
              control={control}
              defaultValue={false}
              rules={{
                value: true,
                required: true
              }}
              {...register('personalPrivacy')}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  label={
                    <Text typo="body1" color={field.value ? 'black' : 'sub'}>
                      <GuideLink
                        to={RoutePath.PersonalPrivacyLink}
                        target="_blank"
                        color={field.value ? 'textBlack' : 'sub'}>
                        개인정보 처리방침
                      </GuideLink>
                      에 동의합니다.
                    </Text>
                  }
                />
              )}
            />
          </CheckboxContainer>
          <SubmitButtonWrapper>
            <Button
              type="submit"
              role="button"
              disabled={!isValid}
              style={{
                width: '100%',
                backgroundColor: isValid ? color.primary : color.darkDisabled,
                color: 'white'
              }}>
              가입 신청하기
            </Button>
          </SubmitButtonWrapper>
        </BottomSection>
      </FormWrapper>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <Flex direction="column" gap="md">
          <div>
            <ModalTitle typo="body1" align="center">
              기존에 가입한 회원과 중복되는 정보입니다.
            </ModalTitle>
            <Text typo="body1" align="center">
              기존 GitHub 계정과 연결을 끊고
              <br />새 GitHub 계정을 연결하시겠습니까?
            </Text>
          </div>
          <GuideList>
            <li>
              연결된 GitHub 계정을 변경하면 기존에 활동했던
              <br /> 이력도 자동으로 새로운 계정에 반영돼요.
            </li>
          </GuideList>
          <GitHubHandleList direction="column" gap="xs">
            <GitHubHandleRow>
              <Text typo="label2" color="sub">
                기존 GitHub
              </Text>
              <GitHubHandleBadge>
                <GitHubIcon width={14} height={14} />
                <Text typo="label2">
                  {previousMemberInfo?.previousGithubHandle || '-'}
                </Text>
              </GitHubHandleBadge>
            </GitHubHandleRow>
            <GitHubHandleRow>
              <Text typo="label2" color="sub">
                현재 GitHub
              </Text>
              <GitHubHandleBadge>
                <GitHubIcon width={14} height={14} />
                <Text typo="label2">{currentGithubHandle || '-'}</Text>
              </GitHubHandleBadge>
            </GitHubHandleRow>
          </GitHubHandleList>
          <ModalButtonGroup gap="sm">
            <Button
              style={{ color: color.sub, borderColor: color.outline }}
              variant="outline"
              onClick={handleModalClose}>
              취소하기
            </Button>
            <Button onClick={handleChangeAccount}>변경하기</Button>
          </ModalButtonGroup>
        </Flex>
      </Modal>
    </Container>
  );
};

const Container = styled(Flex)`
  position: relative;
  flex-direction: column;
  @media (max-height: 765px) {
    min-height: 105vh;
  }
  min-height: 100vh;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${color.mono50};
  width: ${GlobalSize.width};
  padding: 40px 16px;
  width: 100vw;
  ${media.pc} {
    min-height: calc(100vh - var(--header-height, 0px));
    align-items: center;
    padding: 60px 16px;
  }
`;

const PageTitle = styled(Text)`
  ${typography.h1}
  ${media.pc} {
    text-align: center;
    ${typography.display2}
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  flex-grow: 1;
  ${media.pc} {
    gap: 20px;
    max-width: 658px;
    flex-grow: 0;
  }
`;

const BottomSection = styled(Flex)`
  width: 100%;
  margin-top: auto;
  ${media.pc} {
    margin-top: 80px;
    gap: 80px;
  }
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  ${media.pc} {
    flex-direction: row;
    gap: 20px;
  }
`;

const SubmitButtonWrapper = styled.div`
  width: 100%;
  ${media.pc} {
    max-width: 328px;
  }
`;

const CheckboxContainer = styled(Flex)`
  flex-direction: column;
  gap: ${space.xs};
  align-items: flex-start;
`;

const GuideLink = styled(Link)<{ color?: colorKey }>`
  color: ${({ color = 'black' }) => wowColor[color]};
  text-decoration: underline;
  &:active {
    color: ${wowColor.sub};
  }
  &:hover {
    color: ${wowColor.sub};
  }
  &:visited {
    color: ${({ color = 'black' }) => wowColor[color]};
  }
`;

const InputFormWrapper = styled.div`
  height: 84.8px;
  width: 100%;
  ${media.pc} {
    flex: 1;
  }
`;

const SuspenseWrapper = styled.div`
  width: 100%;
  ${media.pc} {
    flex: 1;
  }
`;

const HelperTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 2차 모집때 다시 풀어줄 예정
const RegisterButton = styled.a`
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:visited {
    color: inherit;
  }
`;

const ModalTitle = styled(Text)`
  ${typography.body1}
  ${media.pc} {
    ${typography.h1}
    margin-bottom:10px;
  }
`;

const ModalButtonGroup = styled(Flex)`
  width: 100%;
  ${media.pc} {
    max-width: 358px;
  }
`;

const GitHubHandleList = styled(Flex)`
  ${media.pc} {
    margin: 24px 0;
  }
`;

const GitHubHandleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GitHubHandleBadge = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 40px;
  background: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: ${color.outline};
  gap: 4px;
`;
