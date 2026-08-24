import { useSendStudentEmail, useVerifyStudentEmail } from '@/hooks/mutation';
import useUnivEmail from '@/hooks/zustand/useUnivEmail';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useVerifyStudent } from '../query';
import { useCallback } from 'react';

export interface StudentVerificationFormValues {
  univEmail: string;
  verificationCode: string;
}

export default function useStudentVerification() {
  const { univEmail, updateUnivEmail } = useUnivEmail();
  const {
    result,
    isError,
    error,
    isPending: isQueryPending
  } = useVerifyStudent();

  const {
    control,
    formState: { isValid, isSubmitting },
    handleSubmit,
    setValue,
    setError,
    getValues,
    resetField
  } = useForm<StudentVerificationFormValues>({
    mode: 'onChange',
    defaultValues: {
      univEmail: univEmail ?? '',
      verificationCode: ''
    }
  });

  // 메일 발송 POST
  const { sendStudentEmailAsync, isPending: isSending } = useSendStudentEmail();

  // 6자리 인증코드 검증 PATCH
  const { verifyStudentMailAsync, isPending: isVerifying } =
    useVerifyStudentEmail();

  // 학교 이메일 발송
  const onSendEmail = async (data: StudentVerificationFormValues) => {
    const trimmedEmail = data.univEmail.trim();
    updateUnivEmail(trimmedEmail);
    return await sendStudentEmailAsync(`${trimmedEmail}@g.hongik.ac.kr`);
  };

  // 6자리 코드 검증
  const onVerifyCode = async (data: StudentVerificationFormValues) => {
    const trimmedCode = data.verificationCode.trim();
    return await verifyStudentMailAsync(trimmedCode);
  };

  // 인증코드 재발송
  const onResendEmail = async (email?: string) => {
    const targetEmail = email || getValues('univEmail');
    if (!targetEmail) {
      toast.error('이메일 주소가 올바르지 않습니다.');
      return;
    }
    updateUnivEmail(targetEmail);
    await sendStudentEmailAsync(`${targetEmail}@g.hongik.ac.kr`);
    resetField('verificationCode');
  };

  // 회원 상태 조회
  const onVerifyStudent = useCallback(() => {
    if (isError) {
      toast.error(error?.message);
      return undefined;
    }
    return result?.univStatus;
  }, [isError, error, result?.univStatus]);

  const isPending = isQueryPending || isSending || isVerifying;

  return {
    onSubmitEmail: handleSubmit(onSendEmail),
    onSubmitCode: handleSubmit(onVerifyCode),
    onResendEmail,
    onVerifyStudent,
    control,
    isPending,
    loading: isPending,
    isValid,
    isSubmitting,
    setValue,
    setError,
    getValues,
    resetField
  };
}
