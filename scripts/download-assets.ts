import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/logo.png?fit=300%2C65&quality=80&ssl=1',
  'https://tim.blog/wp-content/uploads/2025/05/search.svg',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/hero-bg2-1-scaled.jpg?resize=2560%2C1125&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/06/amazon-4hr-workweek.png?fit=376%2C68&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/nyt.png?fit=339%2C52&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/newsweek.png?fit=253%2C58&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/tim-ferriss-ted-talk.jpg?fit=928%2C523&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/06/ted-white.png?fit=400%2C107&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/mens-journal.png?fit=245%2C58&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/tim-ferriss-jimmy-fallon.jpg?fit=1180%2C665&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/Jimmy-Fallon.png?fit=158%2C163&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/12/tim-ferriss-4-hour-week-books-optmized.png?resize=381%2C315&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/12/podcast-phone-optmized.png?resize=794%2C940&quality=80&ssl=1',
  'https://tim.blog/wp-content/themes/timferriss/assets/images/icon-apple.svg',
  'https://tim.blog/wp-content/themes/timferriss/assets/images/icon-spotify.svg',
  'https://tim.blog/wp-content/themes/timferriss/assets/images/icon-yt.svg',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/Hugh-Jackman-Illustration-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2020/10/Naval-Ravikant-scaled.jpg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/Jamie-Foxx-Hugh-Jackman-Illustrations-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2020/12/Jerry-Seinfeld-Illustration-scaled.jpg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/06/Eric-Schmidt-.webp?fit=1024%2C819&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2024/09/Elizabeth-Gilbert-Illustration-scaled.jpg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2020/11/Jim-Collins-Illustration-scaled.jpg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2023/10/Arnold-Schwarzenegger-Illustration-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2022/02/Boyd-Varty-Illustration-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/Matthew-McConaughey-Illustration.webp?fit=600%2C480&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2022/04/Terry-Crews-Illustration-1-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/01/Seth-Godin-Illustration-scaled.jpg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2021/12/Henry-Shukman-Illustration-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2024/04/Martha-Beck-Illustration--scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2021/10/Diana-Chapman-scaled.jpeg?fit=1024%2C819&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2026/06/Andrew-Weil-and-Wade-Davis-Illustration.png?fit=300%2C300&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2026/06/Sebastian-Mallaby-Illustration-scaled.jpg?fit=300%2C240&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2026/05/Max-Levchin-Illustration-scaled.jpg?fit=300%2C240&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2026/06/javier-allegue-barros-C7B-ExXpOIE-unsplash-scaled.jpg?fit=300%2C200&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2020/09/socialmedia_timFerriss_200114_005.jpg?fit=300%2C200&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2019/11/mike_maples_jr.jpg?fit=273%2C300&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault-1.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault-2.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault-3.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault-4.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault-5.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/maxresdefault-6.jpg?fit=1280%2C720&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/timabout.jpg?resize=1080%2C1525&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/wiredlogo.png?resize=200%2C39&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/tim-ferriss-jimmy-fallon.jpg?resize=1180%2C665&quality=89&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/tnjimmyfalo.png?resize=144%2C150&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/uberlogo-1.png?resize=114%2C40&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/shopify-logo.png?resize=164%2C52&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/fblogo.png?resize=172%2C55&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/spacexlogo.png?resize=272%2C36&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/duoliongoglogo.png?resize=168%2C43&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/logoclear.png?resize=210%2C57&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/logowealthgfront.png?resize=237%2C53&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/automatticlogo.png?resize=308%2C55&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/logoangellist.png?resize=210%2C41&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/nextddoorlogo.png?resize=197%2C35&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/taskrabbitlogo.png?resize=200%2C41&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/twitterlogo.png?resize=159%2C39&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/alibabalogo.png?resize=142%2C66&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/ntlogo.png?resize=320%2C58&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/06/ted-12.jpg?resize=928%2C522&quality=89&ssl=1',
  'https://tim.blog/wp-content/uploads/2025/05/stars.svg',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/amazon-4hr-workweek-black.png?resize=312%2C56&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/book-4work.png?resize=500%2C755&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/book-4body.png?resize=500%2C755&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/book-4chef.png?resize=500%2C755&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/book-titans.png?resize=500%2C755&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/book-tribe.png?resize=500%2C755&quality=80&ssl=1',
  'https://tim.blog/wp-content/uploads/2025/05/Footer-CTA-1024x476.jpg',
  'https://tim.blog/wp-content/uploads/2025/05/tim-ferriss-4-hour-week-books.png',
  'https://tim.blog/wp-content/uploads/2025/05/logo-dark.png',
];

const favicons = [
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/favicon.png?fit=32%2C32&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/favicon.png?fit=192%2C192&quality=80&ssl=1',
  'https://i0.wp.com/tim.blog/wp-content/uploads/2025/05/favicon.png?fit=180%2C180&quality=80&ssl=1',
];

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

function getFilename(url: string, index: number): string {
  try {
    const parsed = new URL(url);
    const basename = path.basename(parsed.pathname);
    if (!basename) return `image-${index}.jpg`;
    return basename;
  } catch (e) {
    return `image-${index}.jpg`;
  }
}

async function run() {
  console.log(`Downloading ${images.length} images...`);

  if (!fs.existsSync('./public/images')) {
    fs.mkdirSync('./public/images', { recursive: true });
  }

  if (!fs.existsSync('./public/seo')) {
    fs.mkdirSync('./public/seo', { recursive: true });
  }

  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    if (!url) continue;
    const filename = getFilename(url, i);
    const dest = path.join('./public/images', filename);
    try {
      await download(url, dest);
      console.log(`Downloaded ${filename}`);
    } catch (e) {
      console.error(`Failed to download ${url}`);
    }
  }

  console.log(`Downloading ${favicons.length} favicons...`);
  for (let i = 0; i < favicons.length; i++) {
    const url = favicons[i];
    if (!url) continue;
    const dest = path.join('./public/seo', `favicon-${i}.png`);
    try {
      await download(url, dest);
      console.log(`Downloaded favicon-${i}.png`);
    } catch (e) {
      console.error(`Failed to download ${url}`);
    }
  }

  console.log('Done!');
}

run();
