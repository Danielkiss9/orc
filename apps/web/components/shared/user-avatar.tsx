'use client';

import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback, AvatarImage, Icons } from '@orc/web/ui/custom-ui';

interface UserAvatarProps extends AvatarProps {
  user: {
    name: string | null;
    image: string | null;
  };
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image && (
        <AvatarImage
          alt="Picture"
          referrerPolicy={'no-referrer'}
          src={user.image}
        />
      )}
      <AvatarFallback>
        <span className="sr-only">{user.name}</span>
        <Icons.user className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
