import { verifyStudentApi } from '@/apis/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function useSendStudentEmail() {
  const {
    mutate: sendStudentEmail,
    mutateAsync: sendStudentEmailAsync,
    ...rest
  } = useMutation({
    mutationFn: verifyStudentApi.SEND_STUDENT_EMAIL,
    onSuccess: () => {
      toast('메일 전송이 완료되었습니다. 6자리 코드를 입력해주세요.');
    }
  });

  return { sendStudentEmail, sendStudentEmailAsync, ...rest };
}
