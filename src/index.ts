#!/usr/bin/env node
import path from "path";
import fs from "fs";
import { startServer } from "./server";
import yargs from "yargs";
import uniqolor from "uniqolor";
import { open } from "openurl";

const argv = yargs(process.argv.slice(2)).parseSync();

const iconName = argv.icon;
const savePath = argv.out ?? './icon.png';
const background = argv.bg
const foreground = argv.fg;
const pretty = !!argv.pretty;

const url = new URLSearchParams();
if (iconName) url.set('icon', iconName);
if (foreground) url.set('foreground', foreground);
if (background) url.set('background', background);

if (pretty && !foreground) url.set('foreground', '#ffffff');
if (pretty && !background) url.set('background', uniqolor(iconName).color);


if (!iconName) {
    startServer((port) => {
        console.log(`[generate-favicon] Server started: http://localhost:${port}`);
    }, (data) => {
        fs.writeFileSync(path.resolve(process.cwd(), savePath), data, 'base64');
    })
} else {
    const http = startServer((port) => {
        url.set('auto', 'true');
        console.log(`[generate-favicon] Server started: http://localhost:${port}`);
        const autoUrl = `http://localhost:${port}?${url.toString()}`;
        open(autoUrl, (err) => {
            if (err) {
                console.error(`[generate-favicon] Failed to open URL: ${err.message}`);
            }
        });
    }, (data) => {
        console.log(`[generate-favicon] Saving icon to ${savePath}`);
        fs.writeFileSync(path.resolve(process.cwd(), savePath), data, 'base64');
        http.close();
        process.exit(0);
    })
}
