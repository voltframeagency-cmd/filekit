import { getToolSeoContent } from '../src/config/seo/toolFaqs.ts';

const content = getToolSeoContent('/compress-image', 'Compress Image', 'bg');
console.log('Category:', content.category);
console.log('Entity Definition:', content.entityDefinition);
console.log('HowTo Steps:', content.howToSteps.length);
console.log('FAQs:', content.faqs.length);
