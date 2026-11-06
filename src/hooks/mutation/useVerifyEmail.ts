import { verifyStudentApi } from '@/apis/auth';
import { useMutation } from '@tanstack/react-query';

export default function useVerifyEmail() {
  const {
    mutate: verifyEmail,
    mutateAsync: verifyEmailAsync,
    isSuccess,
    isPending
  } = useMutation({
    mutationFn: verifyStudentApi.VERIFY_EMAIL
  });

  return { verifyEmail, verifyEmailAsync, isSuccess, isPending };
}
