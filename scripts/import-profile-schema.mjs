import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, '.env'));
loadEnvFile(path.join(rootDir, '.env.local'));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN first.');
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-06-29', useCdn: false });

const subjectOf = [
  ['Iranian Protesters Struggle to Activate Elon Musk\'s Starlink', 'https://souzangar.com/podcast/wall-street-journal-iranian-protesters-struggle-to-activate-elon-musk-s-starlink', 'The Wall Street Journal'],
  ['Iran steps up internet crackdown one year after Mahsa Amini death', 'https://english.aawsat.com/features/4545691-iran-steps-internet-crackdown-one-year-after-mahsa-amini-death', 'Reuters / Asharq Al-Awsat'],
  ["'The internet is dead in Iran': Protests targeted by shutdown", 'https://www.context.news/surveillance/irans-digital-wall-casts-chill-over-protests-the-economy', 'Context / Thomson Reuters Foundation'],
  ['How a viral song became the unofficial anthem of Iran\'s protests', 'https://souzangar.com/podcast/washington-post-how-a-viral-song-became-the-unofficial-anthem-of-iran-s-protests', 'The Washington Post'],
  ['Iran Extends Internet Clampdown Beyond Wartime', 'https://souzangar.com/podcast/ny-times-iran-extends-internet-clampdown-beyond-wartime', 'The New York Times'],
  ['سعید سوزنگر، کارشناس و فعال حوزه اینترنت، با قید وثیقه آزاد شد', 'https://www.iranintl.com/202602243431', 'Iran International'],
  ['آزادی سعید سوزنگر با قرار وثیقه پس از یک ماه بازداشت', 'https://www.sharghdaily.com/%D8%A8%D8%AE%D8%B4-%D9%81%D9%86%D8%A7%D9%88%D8%B1%DB%8C-298/1090265-%D8%A2%D8%B2%D8%A7%D8%AF%DB%8C-%D8%B3%D8%B9%DB%8C%D8%AF-%D8%B3%D9%88%D8%B2%D9%86%DA%AF%D8%B1-%D8%A8%D8%A7-%D9%82%DB%8C%D8%AF-%D9%88%D8%AB%DB%8C%D9%82%D9%87-%D9%BE%D8%B3-%D8%A7%D8%B2-%DB%8C%D9%83-%D9%85%D8%A7%D9%87-%D8%A8%D8%A7%D8%B2%D8%AF%D8%A7%D8%B4%D8%AA', 'Shargh Daily'],
  ['بازداشت کارشناسان امنیت شبکه سهراب‌پور، سوزنگر و صیرفی', 'https://www.zoomit.ir/iran-news/456104-detention-of-network-security-experts-soozangar-seirafi-1404/', 'Zoomit'],
  ['بازداشت سعید سوزنگر کارشناس فناوری اطلاعات و امنیت شبکه', 'https://digiato.com/iran-technology-news/saeid-souzangar-iman-sirafi-arrest-ict', 'Digiato'],
].map(([headline, url, publisherName]) => ({ headline, url, publisherName }));

await client.patch('siteSettings').set({
  structuredData: {
    _type: 'structuredData',
    type: 'Person',
    id: 'https://souzangar.com/#person',
    name: 'Saeed Souzangar',
    alternateName: ['سعید سوزنگر', 'سعید سوزن گر', '@souzangar'],
    inLanguage: ['fa-IR', 'en'],
    url: 'https://souzangar.com/',
    profileImageUrl: 'https://souzangar.com/images/saeed.png',
    description: 'Saeed Souzangar (سعید سوزنگر) is an Iranian cybersecurity expert, network infrastructure architect, technology entrepreneur, and digital rights advocate focused on internet freedom, network security, and child digital safety.',
    jobTitle: ['Technology Entrepreneur', 'Network Infrastructure Architect', 'Cybersecurity Specialist', 'Digital Rights Advocate', 'Podcaster'],
    knowsAbout: ['Computer Network Architecture', 'Cybersecurity', 'BGP Peering & Routing', 'Internet Censorship & Circumvention', 'Digital Privacy', 'Digital Rights', 'Child Online Safety', 'DDoS Mitigation', 'DNS Infrastructure'],
    sameAs: ['https://www.google.com/search?kgmid=/g/11ptsj9d4c', 'https://www.google.com/search?kgmid=/g/11zhwwffg4', 'https://www.google.com/search?kgmid=/g/11khs5mm05', 'https://x.com/souzangar', 'https://www.linkedin.com/in/souzangar/', 'https://www.youtube.com/@souzangar', 'https://www.instagram.com/souzangar/', 'https://t.me/souzangar'],
    subjectOf,
  },
}).commit();

await client.patch('page.home').setIfMissing({ seo: { _type: 'seo' } }).set({
  'seo.isProfilePage': true,
  'seo.canonicalUrl': 'https://souzangar.com/',
}).commit();

console.log(`Imported profile structured data into ${projectId}/${dataset}.`);
