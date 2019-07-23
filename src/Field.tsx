import * as React from 'react';
import useField from './useField';

interface Props {
  watchAbleProps?: Array<string>;
  [fieldId: string]: any;
}

export interface FieldProps {
  component: any;
  fieldId: string;
  innerRef?: () => void;
  watchableProps?: Array<string>;
  [x: string]: any;
}

const defaultWatchables = ['disabled', 'className'];

// TODO: Consider supporting children()
const FieldContainer: React.FC<FieldProps> = (
  { component, fieldId, innerRef, watchableProps, ...rest },
) => {
  if (process.env.NODE_ENV !== 'production' && !component) {
    throw new Error('The Field needs a "component" property to  function correctly.');
  }

  const {
    0: actions,
    1: res,
  } = useField(fieldId);

  return React.createElement(component, {
    ref: innerRef,
    ...res,
    ...actions,
    ...rest,
  });
};

export default React.memo(
  FieldContainer,
  (
    { watchableProps: prevWatchable, ...prev }: Props,
    { watchAbleProps: nextWatchable, ...next }: Props,
  ) => (nextWatchable || defaultWatchables).every(
      (prop: string) => prev[prop] === next[prop]));
