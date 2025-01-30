import { Button, ButtonProps, Icons } from '@orc/web/ui/custom-ui';
import React from 'react';

interface LoaderButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function LoaderButton(props: LoaderButtonProps) {
  const { loading, disabled } = props;

  return (
    <Button
      {...{ ...props, loading: undefined }}
      disabled={disabled ? disabled : loading}
    >
      {!loading && props.children}
      {loading && <Icons.spinner className="animate-spin" />}
    </Button>
  );
}
