import { User } from '@/types/user';
import { Status } from '@/types/status';
export interface MemberInfoResponse {
  member: User;
  currentRecruitmentRound: CurrentRecruitmentType;
  currentMembership: CurrentMembershipType;
}

export interface CurrentRecruitmentType {
  recruitmentId: number;
  name: string;
  period: {
    startDate: string;
    endDate: string;
    open: boolean;
  };
  feeName: string;
  fee: number;
  roundType: 'FIRST' | 'SECOND' | 'THIRD';
  roundTypeValue: string;
}

export interface CurrentMembershipType {
  membershipId: number;
  memberId: number;
  recruitmentId: number;
  regularRequirement: {
    paymentStatus: Status;
    allSatisfied: boolean;
    paymentSatisfied: boolean;
  };
}
