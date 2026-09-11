import { getLocalizedToolMeta } from '../src/utils/i18nHelper.ts';

const meta = getLocalizedToolMeta('/compress-image', 'bg');
console.log('Result for /compress-image in bg:');
console.log(JSON.stringify(meta, null, 2));
