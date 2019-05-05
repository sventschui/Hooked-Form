import { useContext, useMemo, useDebugValue, useCallback } from 'preact/hooks';
import {
  add as aAdd,
  insert as aInsert,
  move as aMove,
  remove as aRemove,
  replace as aReplace,
  swap as aSwap,
} from './helpers/arrays';
import { formContext } from './context';
import { get } from './helpers/operations';

export interface FieldOperations {
  add: (item: any) => void;
  insert: (at: number, element: object) => void;
  move: (from: number, to: number) => void;
  setFieldValue: (fieldId: string, value: any) => void;
  remove: (toDelete: object | number) => void;
  replace: (at: number, element: object) => void;
  swap: (first: number, second: number) => void;
}

export interface FieldInformation {
  error: string | null;
  value: any;
}

export default function useFieldArray(fieldId: string): [FieldOperations, FieldInformation] {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The FieldArray needs a valid "fieldId" property to  function correctly.');
  }

  const { errors, values, setFieldValue } = useContext(formContext);
  const value: Array<any> = useMemo(() => get(values, fieldId) || [], [values]);

  if (process.env.NODE_ENV !== 'procution') {
    useDebugValue(`${fieldId} Value: ${value}`);
    useDebugValue(`${fieldId} Error: ${get(errors, fieldId)}`);
  }

  return [
    {
      add: useCallback((element: any) =>
        setFieldValue(fieldId, aAdd(value, element)), [value]),
      insert: useCallback((at: number, element: object) =>
        setFieldValue(fieldId, aInsert(value, at, element)), [value]),
      move: useCallback((from: number, to: number) =>
        setFieldValue(fieldId, aMove(value, from, to)), [value]),
      remove: useCallback((element: object | number) =>
        setFieldValue(fieldId, aRemove(value, element)), [value]),
      replace: useCallback((at: number, element: object) =>
        setFieldValue(fieldId, aReplace(value, at, element)), [value]),
      setFieldValue,
      swap: useCallback((from: number, to: number) =>
        setFieldValue(fieldId, aSwap(value, from, to)), [value]),
    },
    {
      error: useMemo(() => get(errors, fieldId), [errors]),
      value,
    },
  ];
}