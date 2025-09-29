// ReadyBubble.tsx
import React from 'react';
import { BaseBubble } from './base-bubble';

type ReadyBubbleProps = {
  name: string;
  showTick?: boolean;
};

export const ReadyBubble = ({ name, showTick }: ReadyBubbleProps) => {
  return (
    <BaseBubble
      name={name}
      readOnly
      showTick={showTick}
    />
  );
};