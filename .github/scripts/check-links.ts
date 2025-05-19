import fs from 'fs';
import { glob } from 'glob';
import axios from 'axios';

async function main() {
    const pattern = '**/*.+(ts|html)';
    const baseDir = process.cwd();

    const files = glob.sync(pattern, { cwd: baseDir, absolute: true });
    const urlRegex = /https?:\/\/docs\.ai4os\.eu[^\s'"`<>)]*/g;
    const urls = new Set<string>();

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(urlRegex);
        if (matches) {
            matches.forEach((url) => urls.add(url));
        }
    }

    if (urls.size === 0) {
        console.log('No docs.ai4os.eu links found');
        return;
    }

    console.log(`Found ${urls.size} docs.ai4os.eu links`);

    const brokenLinks: string[] = [];

    for (const url of urls) {
        try {
            const res = await axios.get(url);
            if (res.status === 404) {
                brokenLinks.push(url);
            }
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                brokenLinks.push(url);
            } else {
                console.log(`Error accessing ${url}:`, err.message);
            }
        }
    }

    if (brokenLinks.length > 0) {
        console.error('⚠️ Broken (404) links found:');
        brokenLinks.forEach((link) => console.error(link));
        process.exit(1);
    } else {
        console.log('✅ All links are working correctly.');
    }
}

main();
