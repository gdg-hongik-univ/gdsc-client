import { CurrentRecruitmentType } from '@/apis/member/memberType';
import BottomSheet from '@/components/common/BottomSheet';
import { Flex, Space, Text } from '@/components/common/Wrapper';
import CustomBox from '@/components/myPage/CustomBox';
import useJoinRegularMember from '@/hooks/mutation/useJoinRegularMember';
import RoutePath from '@/routes/routePath';
import {
  convertRecruitmentName,
  convertRecruitmentPeriod
} from '@/utils/mypage/recruitmentNameFormat';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { color } from 'wowds-tokens';
import Button from 'wowds-ui/Button';

const JoinRegularMemberBottomSheet = ({
  currentRecruitment,
  variant = 'bottomsheet'
}: {
  currentRecruitment: CurrentRecruitmentType;
  variant?: 'bottomsheet' | 'modal';
}) => {
  const { joinRegularMember } = useJoinRegularMember();
  const bottomSheetTitle = convertRecruitmentName(
    currentRecruitment.name,
    currentRecruitment.roundTypeValue
  );
  const recruitmentPeriod = convertRecruitmentPeriod(currentRecruitment.period);

  const content = (
    <BottomSheetContent>
      <Flex direction="column" align="center">
        <Space height={20} />
        <Text typo="h2" style={{ width: '100%', textAlign: 'center' }}>
          {bottomSheetTitle.slice(0, bottomSheetTitle.length - 2)}
        </Text>
        <Space height={32} />
        <Text typo="body2">정회원이 되면 아래 혜택을 모두 누릴 수 있어요.</Text>
        <Space height={8} />
        <CustomBox
          centered
          text={
            <Flex gap="xl" direction="column" style={{ width: 'auto' }}>
              <Flex direction="column" gap="xxs">
                <Text typo="label1">
                  각종 학술 프로그램 및 온/오프라인 이벤트
                </Text>
                <Text typo="body2" color="sub">
                  다양한 학우들과 교류할 수 있는 기회예요.
                </Text>
              </Flex>
              <Flex direction="column" gap="xxs">
                <Text typo="label1">
                  학회원들과 소통할 수 있는 디스코드 채널
                </Text>
                <Text typo="body2" color="sub">
                  유익한 정보를 얻고, 다양한 소모임에 참가해보세요.
                </Text>
              </Flex>
              <Flex direction="column" gap="xxs">
                <Text typo="label1">
                  해커톤, 컨퍼런스 등 Google 관련 이벤트 참여
                </Text>
                <Text typo="body2" color="sub">
                  빠르게 소식을 전달받고, 먼저 기회를 얻을 수 있어요.
                </Text>
              </Flex>
            </Flex>
          }
        />
      </Flex>
      <div>
        <Text typo="body2" align="center">
          회비는 2만원이고, 쿠폰이 있을 경우 할인받을 수 있어요.
          <br />
          자세한 내용은{' '}
          <TextLink to={RoutePath.GDGHongikLink} target="_blank">
            GDG Hongik Univ. 페이지
          </TextLink>
          를 참고해주세요.
        </Text>
      </div>
      <Text typo="h3" color="primary">
        {recruitmentPeriod}
      </Text>
      <Button
        onClick={() => {
          joinRegularMember(currentRecruitment.recruitmentId);
        }}>
        {'지원하러 가기'}
      </Button>
    </BottomSheetContent>
  );

  if (variant === 'modal') {
    return content;
  }

  return <BottomSheet>{content}</BottomSheet>;
};

export default JoinRegularMemberBottomSheet;

const BottomSheetContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  overflow-y: scroll;
`;

const TextLink = styled(Link)`
  color: ${color.textBlack};
  text-decoration: underline;
`;
