import { StudioClient } from './StudioClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <StudioClient />;
}
