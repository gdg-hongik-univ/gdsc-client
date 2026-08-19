import apiClient from '@/apis';
import { Status } from '@/types/status';

const verifyStudentApi = {
  GET_STUDENT_EMAIL_IS_VERIFIED: async (): Promise<{ univStatus: Status }> => {
    const response = await apiClient.get(
      `/onboarding/members/me/univ-verification`
    );
    return response.data;
  },
  // 2-3. 재학생 인증 메일 발송
  SEND_STUDENT_EMAIL: async (univEmail: string) => {
    const response = await apiClient.post(
      `/onboarding/send-verify-univ-email`,
      {
        univEmail
      }
    );
    return response.data;
  },
  // 2-4 재학생 인증
  // code string, code 규칙 필수 = 6자리 숫자
  VERIFY_STUDENT_EMAIL: async (code: string) => {
    const response = await apiClient.patch(`/onboarding/verify-univ-email`, {
      code: code.trim()
    });
    return response.data;
  },
  // 2-1 과거 계정 본인 인증 메일 발송
  SEND_VERIFY_EMAIL: async (
    previousMemberId: number
  ): Promise<{ previousMemberId: number }> => {
    const response = await apiClient.post(`/onboarding/send-verify-email`, {
      previousMemberId
    });
    return response.data;
  },
  // 2-2 과거 계정 본인 인증
  // token에서 code로 변경(문자열)
  VERIFY_EMAIL: async (code: string): Promise<{ code: string }> => {
    const response = await apiClient.patch(`/onboarding/verify-email`, {
      code: code.trim()
    });
    return response.data;
  }
};

export default verifyStudentApi;
