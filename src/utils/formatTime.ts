// 초 단위 숫자를 M분 NN초 형식으로 포맷팅

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${minutes}분 ${paddedSeconds}초`;
};
