import { verifyStudentApi } from '@/apis/auth';
import { useMutation } from '@tanstack/react-query';

export default function useVerifyStudentEmail() {
  const {
    mutate: verifyStudentMail,
    mutateAsync: verifyStudentMailAsync,
    isSuccess,
    isPending,
    error,
    ...rest
  } = useMutation({
    mutationFn: (code: string) => verifyStudentApi.VERIFY_STUDENT_EMAIL(code)
  });

  return {
    verifyStudentMail,
    verifyStudentMailAsync,
    isSuccess,
    isPending,
    error,
    ...rest
  };
}
