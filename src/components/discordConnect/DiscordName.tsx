import { Flex, MobileOnly, Space, Text } from '@/components/common/Wrapper';
import { usePostDiscordName } from '@/hooks/mutation/usePostDiscordName';
import RoutePath from '@/routes/routePath';
import { media } from '@/styles';
import { DiscordFormValues } from '@/types/discord';
import styled from '@emotion/styled';
import { memo, useCallback, useEffect } from 'react';
import { Control, useController, useFormContext } from 'react-hook-form';
import Button from 'wowds-ui/Button';
import Divider from 'wowds-ui/Divider';
import TextButton from 'wowds-ui/TextButton';
import TextField from 'wowds-ui/TextField';
import { Image } from '../common/Image';
import DiscordImage from '/discord/discord-name.png';

const validateDiscordUsername = (value: string): string | null => {
  if (!value) return '사용자명을 입력해주세요.';
  if (value.length < 2 || value.length > 32)
    return '최소 2자, 최대 32자까지만 작성 가능해요.';
  if (/[A-Z]/.test(value)) return '대문자가 아닌 소문자로만 작성 가능해요.';
  if (!/^[a-z0-9_.]+$/.test(value))
    return '영문 소문자, 숫자, 밑줄(_), 마침표(.)만 사용 가능해요.';
  if (/(__|\.\.)/.test(value))
    return '연속적인 밑줄(__)이나 마침표(..)는 사용할 수 없어요.';
  if (/discord|nitro|nelly/.test(value))
    return 'discord, nitro, nelly와 같은 디스코드 공식 이름은 사용할 수 없어요.';
  return null;
};

export const DiscordName = ({ onNext }: { onNext: () => void }) => {
  const { getValues, control, setError } = useFormContext<DiscordFormValues>();

  const { checkDuplicate, data, isSuccess, isPending } = usePostDiscordName();

  useEffect(() => {
    if (isSuccess) {
      if (data?.isDuplicate) {
        setError('discordUsername', {
          type: 'manual',
          message:
            '이미 가입된 사용자명이에요. 이전에 가입한 적이 있으신 경우, 카카오톡 채널로 문의해주세요.'
        });
      } else {
        onNext();
      }
    }
  }, [data?.isDuplicate, isSuccess, onNext, setError]);

  const submitWithValue = useCallback(
    (value: string) => {
      const error = validateDiscordUsername(value);
      if (error) {
        setError('discordUsername', { type: 'manual', message: error });
        return;
      }
      checkDuplicate(value);
    },
    [checkDuplicate, setError]
  );

  const handleNextClick = useCallback(() => {
    submitWithValue(getValues('discordUsername'));
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
        <Space height="xs" />
        <TextButton
          text="디스코드 계정이 없나요?"
          asProp="a"
          target="_blank"
          href={RoutePath.DiscordRegisterLink}
        />
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

const TextSection = memo(() => {
  return (
    <>
      <div>
        <Text typo="h1">사용자명을 알려주세요.</Text>
        <Space height="sm" />
        <Text typo="body1">
          GDG Hongik Univ. 디스코드 서버에서는 사용자명을 통해 멤버를 구분해요.
        </Text>
      </div>
      <Image src={DiscordImage} alt="discord-name" align="center" />
      <Text typo="body1">
        본인의 디스코드 사용자명을 아래 규정과 맞게 설정한 후 입력해주세요.
      </Text>
      <MobileOnly>
        <Divider />
      </MobileOnly>
    </>
  );
});

const NameField = ({
  control,
  onSubmitValue,
  disabled
}: {
  control: Control<DiscordFormValues>;
  onSubmitValue: (value: string) => void;
  disabled: boolean;
}) => {
  const { clearErrors } = useFormContext<DiscordFormValues>();
  const { field, fieldState } = useController({
    name: 'discordUsername',
    control
  });

  return (
    <TextField
      {...field}
      onChange={(value: string) => {
        field.onChange(value);
        if (fieldState.error) clearErrors('discordUsername');
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
          <li>최소 2자, 최대 32자까지만 작성 가능</li>
          <li>대문자가 아닌 소문자로만 작성 가능</li>
          <li>밑줄(_)과 마침표(.)가 아닌 특수 문자 사용 불가능</li>
          <li>
            연속적인 밑줄(a__b)과 마침표(a..b)로 이루어진 경우 사용 불가능
          </li>
          <li>discord, nitro, nelly와 같은 디스코드 공식 이름 사용 불가능</li>
        </ul>
      }
      label="디스코드 사용자명"
      placeholder="내용을 입력해주세요."
      error={!!fieldState.error}
    />
  );
};
