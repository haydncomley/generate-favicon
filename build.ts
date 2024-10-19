import esbuild from 'esbuild';
import fs from 'fs';

const ICONS_PATH = 'node_modules/material-design-icons';

const categories = fs.readdirSync(ICONS_PATH, 'utf8').filter((category) => fs.existsSync(`${ICONS_PATH}/${category}/svg/production`));
const rawIconList = categories.reduce<string[]>((acc, category) => {
    const icons = fs.readdirSync(`${ICONS_PATH}/${category}/svg/production`, 'utf8').filter((icon) => icon.endsWith('.svg'));
    return [...acc, ...icons];
}, [])

const icons = Array.from(new Set(
    rawIconList.map((icon) => {
        const nameWithPx = icon.replace('.svg', '').replace('ic_', '');
        return nameWithPx.slice(0, nameWithPx.lastIndexOf('_'))
    }).sort()
));

fs.writeFileSync('html/icons.json', JSON.stringify(icons), 'utf8');

fs.writeFileSync('html/index.ts', `// Generated file.
export const icons = ${JSON.stringify(icons)};
export const htmlGenerator = \`${fs.readFileSync('html/generator.html')}\`;
export const htmlIndex = \`${fs.readFileSync('html/index.html')}\`;
`, 'utf8');

esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'neutral',
    outdir: 'bin',
    packages: 'external'
});