import React from 'react';
import { ToolContentRecord } from '@/lib/seo/contentRegistry';
import { getValidatedSiteUrl } from '@/lib/seo/siteUrl';

interface ToolSeoSchemaProps {
  record: ToolContentRecord;
}

export const ToolSeoSchema: React.FC<ToolSeoSchemaProps> = ({ record }) => {
  const siteUrl = getValidatedSiteUrl();
  const fullUrl = `${siteUrl}${record.canonicalRoute}`;

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `FileKit ${record.h1}`,
        url: fullUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires HTML5 and modern JavaScript support',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: record.h1,
            item: fullUrl,
          },
        ],
      },
      {
        '@type': 'Organization',
        name: 'FileKit',
        url: siteUrl,
        logo: `${siteUrl}/brand-assets/benefits/verified-output.svg`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
};
