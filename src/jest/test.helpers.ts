const fs = require("fs");
const path = require("path");

import * as _ from "lodash";
import { ScreepsServer, TerrainMatrix } from "screeps-server-mockup";

const modules = getFileList("dist/");
let server: ScreepsServer;
let bot: any;

export async function setupMockScreepsServer() {
  // Initialize server
  server = new ScreepsServer();

  // reset world but add invaders and source keepers users
  await server.world.reset();

  // Prepare the terrain for a new room
  const terrain = new TerrainMatrix();
  const walls = [
    [10, 10],
    [10, 40],
    [40, 10],
    [40, 40]
  ];
  _.each(walls, ([x, y]) => terrain.set(x, y, 'wall'));

  // Create a new room with terrain and basic objects
  await server.world.addRoom('W0N1');
  await server.world.setTerrain('W0N1', terrain);
  await server.world.addRoomObject('W0N1', 'controller', 10, 10, { level: 0 });
  await server.world.addRoomObject('W0N1', 'source', 10, 40, { energy: 1000, energyCapacity: 1000, ticksToRegeneration: 300 });
  await server.world.addRoomObject('W0N1', 'mineral', 40, 40, { mineralType: 'H', density: 3, mineralAmount: 3000 });

  // Add a bot in W0N1
  bot = await server.world.addBot({ username: 'bot', room: 'W0N1', x: 25, y: 25, modules });

  // Print console logs every tick
  bot.on('console', (logs: string[], results: any, userid: number, username: string) => {
    _.each(logs, line => console.log(`[console|${username}]`, line));
  });

  // Start server
  await server.start();
}

export async function teardownMockScreepsServer() {
  // Stop server and disconnect storage
  server.stop();
  // process.exit(); // required as there is no way to properly shutdown storage :(
}

export async function tickMockScreepsServer() {
  for (let i = 0; i < 10; i++) {
    console.log('[tick]', await server.world.gameTime);
    await server.tick();
    _.each(await bot.newNotifications, ({ message }) => console.log('[notification]', message));
    console.log('[memory]', await bot.memory, '\n');
  }
}

function getFileList(outputPath: string) {
  const code: any = {};
  const files = fs.readdirSync(outputPath).filter((f: string) => path.extname(f) === '.js');
  files.map((file: string) => {
    code[file.replace(/\.js$/i, '')] = fs.readFileSync(path.join(outputPath, file), 'utf8');
  });
  return code;
}
