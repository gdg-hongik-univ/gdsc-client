import { User, UserRoleType } from '@/types/user';
import styled from '@emotion/styled';
import { color } from 'wowds-tokens';
import { Flex, Text } from '../common/Wrapper';

const MemberStatusStepper = ({ member }: { member: User }) => {
  const { role } = member;

  const convertRoleToStep = (role: UserRoleType) => {
    switch (role) {
      case 'GUEST':
        return 1;
      case 'ASSOCIATE':
        return 2;
      default:
        return 3;
    }
  };

  const currentStep = convertRoleToStep(role);
  const steps = [
    { value: 1, label: '게스트' },
    { value: 2, label: '준회원' },
    { value: 3, label: '정회원' }
  ];

  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <Flex>
      <StepperContainer>
        <ProgressBarContainer>
          <ProgressBar />
          <ProgressFill width={progressWidth} />
          <StepCircle left={progressWidth} />
        </ProgressBarContainer>
        <LabelsContainer>
          {steps.map((step) => (
            <Text
              key={step.value}
              typo="label3"
              color={step.value === currentStep ? 'textBlack' : 'sub'}>
              {step.label}
            </Text>
          ))}
        </LabelsContainer>
      </StepperContainer>
    </Flex>
  );
};

export default MemberStatusStepper;

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 12px;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 91%;
  height: 6px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 40px;
  background-color: ${color.lightDisabled};
`;

const ProgressFill = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 6px;
  border-radius: 40px;
  background-color: ${color.primary};
  width: ${({ width }) => width}%;
  transition: width 0.3s ease;
`;

const StepCircle = styled.div<{ left: number }>`
  position: absolute;
  top: 50%;
  left: ${({ left }) => left}%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${color.primary};
  transition: left 0.3s ease;
`;

const LabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
