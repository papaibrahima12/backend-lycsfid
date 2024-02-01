import { Transform } from 'class-transformer';

export function TransformDate() {
  return Transform(({ value }) => new Date(value));
}
