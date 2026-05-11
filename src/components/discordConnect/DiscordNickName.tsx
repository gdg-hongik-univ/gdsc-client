import { Flex, MobileOnly, Space, Text } from '@/components/common/Wrapper';
import { usePostDiscordNickname } from '@/hooks/mutation/usePostDiscordNickname';
import { media } from '@/styles';
import { DiscordFormValues } from '@/types/discord';
import styled from '@emotion/styled';
import { memo, useCallback, useEffect } from 'react';
import { Control, useController, useFormContext } from 'react-hook-form';
import Button from 'wowds-ui/Button';
import Divider from 'wowds-ui/Divider';
import TextField from 'wowds-ui/TextField';
import { Image } from '../common/Image';
import DiscordImage from '/discord/discord-nickname.png';

const validateDiscordNickname = (value: string): string | null => {
  if (!value) return '별명을 입력해주세요.';
  if (value.length < 2 || value.length > 6)
    return '최소 2자, 최대 6자까지만 작성 가능해요.';
  if (!/^[가-힣]+$/.test(value)) return '한글만 작성 가능해요.';
  return null;
};

export const DiscordNickName = ({ onNext }: { onNext: () => void }) => {
  const { getValues, control, setError, clearErrors, setValue } =
    useFormContext<DiscordFormValues>();
  const { checkDuplicate, data, isSuccess, isPending } =
    usePostDiscordNickname();

  useEffect(() => {
    if (isSuccess) {
      if (data?.isDuplicate) {
        setError('discordNickname', {
          type: 'manual',
          message: '이미 가입된 별명이에요. 다른 별명으로 변경해주세요.'
        });
      } else {
        clearErrors('discordNickname');
        onNext();
      }
    }
  }, [data?.isDuplicate, isSuccess, onNext, setError, clearErrors]);

  const submitWithValue = useCallback(
    (value: string) => {
      setValue('discordNickname', value, {
        shouldValidate: false,
        shouldDirty: true
      });
      const error = validateDiscordNickname(value);
      if (error) {
        setError('discordNickname', { type: 'manual', message: error });
        return;
      }
      checkDuplicate(value);
    },
    [checkDuplicate, setError, setValue]
  );

  const handleNextClick = useCallback(() => {
    submitWithValue(getValues('discordNickname'));
  }, [getValues, submitWithValue]);

  return (
    <Wrapper direction="column">
      <Flex direction="column" align="flex-start" gap="lg">
        <TextSection />
      </Flex>
      <MobileOnly>
        <Space height="lg" />
      </MobileOnly>
      <div style={{ width: '100%' }}>
        <NameField
          control={control}
          onSubmitValue={submitWithValue}
          disabled={isPending}
        />
      </div>

      <Flex direction="column" style={{ marginTop: 'auto' }}>
        <Button onClick={handleNextClick} style={{ maxWidth: '100%' }}>
          다음으로
        </Button>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled(Flex)`
  height: 100%;
  ${media.pc} {
    max-width: 500px;
    gap: 60px;
  }
`;

const TextSection = memo(() => (
  <>
    <div>
      <Text typo="h1">별명을 설정하세요.</Text>
      <Space height="sm" />
      <Text typo="body1">
        GDG Hongik Univ. 디스코드 서버에서 사용할 별명을 설정해주세요.
      </Text>
    </div>
    <Image src={DiscordImage} alt="discord-nickname" align="center" />
    <Text typo="body1">
      가입이 완료되면 가입 신청서에 제출하신 별명으로 자동으로 수정될 거예요.
      추후 별명을 수정하고 싶다면 카카오톡 채널로 코어멤버에게 연락 주세요.
    </Text>
    <MobileOnly>
      <Divider />
    </MobileOnly>
  </>
));

const NameField = ({
  control,
  onSubmitValue,
  disabled
}: {
  control: Control<DiscordFormValues>;
  onSubmitValue: (value: string) => void;
  disabled: boolean;
}) => {
  const { setError, clearErrors } = useFormContext<DiscordFormValues>();
  const { field, fieldState } = useController({
    name: 'discordNickname',
    control,
    rules: {
      validate: (value) => validateDiscordNickname(value) ?? true
    }
  });

  return (
    <TextField
      {...field}
      onChange={(value: string) => {
        field.onChange(value);
        const error = validateDiscordNickname(value);
        if (error) {
          setError('discordNickname', { type: 'manual', message: error });
        } else {
          clearErrors('discordNickname');
        }
      }}
      textareaProps={{
        disabled,
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (disabled) return;
            onSubmitValue(e.currentTarget.value);
          }
        }
      }}
      helperText={
        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          {fieldState.error?.message && (
            <>
              <li>{fieldState.error.message}</li>
              <br />
            </>
          )}
          <li>최소 2자, 최대 6자의 한글만 작성 가능</li>
          <li>
            <button
              onClick={() => {
                window.open(
                  'https://www.gdghongik.com/onboard-guide/community-guideline',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}>
              <u>GDG Hongik Univ. 가이드라인</u>
            </button>
            에 어긋나지 않게 작성
          </li>
        </ul>
      }
      label="디스코드 별명"
      placeholder="내용을 입력해주세요"
      error={!!fieldState.error}
    />
  );
};
