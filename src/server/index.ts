import http from 'http';
import { Socket } from 'net';
import { icons, htmlGenerator, htmlIndex  } from '../../html'

export const startServer = (onReady: (port: string) => void, onGenerated: (data: string) => void) => {
    const connections: Socket[] = [];

    const server = http.createServer(function (req, res) {
        if (req.url?.startsWith('/make')) {
            res.write(htmlGenerator);
            res.end();
        } else if (req.url?.startsWith('/save')) {
            // Get JSON body from request
            let data = '';
            req.on('data', chunk => {
                data += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const body = JSON.parse(data);
                    res.statusCode = 200;
                    res.end();
                    onGenerated(body.data.replace('data:image/png;base64,', ''))
                } catch (e) {
                    console.error(e);
                    res.statusCode = 400;
                    res.end();
                }
            });
        } else {
            const htmlFileWithIcons = htmlIndex.replace('["REPLACE_WITH_ICONS"]', JSON.stringify(icons));
            res.write(htmlFileWithIcons);
            res.end();
        }
    })
    .listen(1105)
    .on('listening', () => onReady('1105'))
    .on('connection', (connection) => {
        connections.push(connection);
        connection.on('close', () => {
            const index = connections.indexOf(connection);
            connections.splice(index, 1);
        });
    })
    .on('close', () => {
        console.log('Server closed');
        connections.forEach((connection) => connection.destroy());
    });

    return server;
}

