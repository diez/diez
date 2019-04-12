import {createServer, Server} from 'http';
import serverDestroy from 'server-destroy';

/**
 * @internal
 */
const isPortOpen = async (server: Server, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      server.listen(port, '0.0.0.0');
      server.once('listening', () => {
        server.once('close', () => {
          resolve(true);
        });
        server.close();
      });

      server.on('error', () => {
        // This port is taken or otherwise unavailable; try another.
        resolve(false);
      });
    } catch (error) {
      resolve(false);
    }
  });
};

/**
 * Generates a candidate port range, based on a start port number and target port count.
 */
export const getCandidatePortRange = (startPort: number, portCount: number): number[] =>
  Array.from(Array(portCount).keys()).map((key) => key + startPort);

/**
 * Finds an open port from a range of potential ports.
 */
export const findOpenPort = async (ports: number[]): Promise<number> => {
  const server = createServer();
  serverDestroy(server);
  for (const port of ports) {
    if (await isPortOpen(server, port)) {
      server.destroy();
      return port;
    }
  }

  server.destroy();
  throw new Error('Unable to find open port.');
};
