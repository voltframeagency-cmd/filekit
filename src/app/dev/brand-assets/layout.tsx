import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FileKit Developer Brand Assets Inspection Suite',
  description: 'Internal developer platform and visual inspection gallery.',
  robots: 'noindex, nofollow',
};

export default function DevBrandAssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
