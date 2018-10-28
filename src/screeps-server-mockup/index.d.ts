declare class ScreepsServer {
  constructor(opts?: ScreepsServerOptions);
  setOpts(opts?: ScreepsServerOptions): ScreepsServer;
  connect(): ScreepsServer;
  tick(): ScreepsServer;
  startProcess(name: string, execPath: string, env: any): ScreepsServerProcess;
  start(): ScreepsServer;
  stop(): ScreepsServer;
  world: World;
}

export interface ScreepsServerOptions {
  path: string;
  logeir: string;
  port: number;
}

export interface ScreepsServerProcess {

}


declare class TerrainMatrix {
  constructor();
  get(x: number, y: number): any;
  set(x: number, y: number, value: any): TerrainMatrix;
  serialize(): string;
}


declare namespace TerrainMatrix {
  export function unserialize(str: string): TerrainMatrix;
}


declare class World {
  constructor(server: ScreepsServer)
  gameTime(): any;
  load(): any;
  setRoom(room: any, status?: string, active?: boolean): any;
  addRoom(room: any): any;
  getTerrain(room: any): any;
  setTerrain(room: any, terrain: TerrainMatrix): any;
  addRoomObject(room: any, type: any, x: number, y: number, attributes: any): any;
  reset(): any;
  stubWorld(): any;
  roomObjects(roomName: string): any;
  addBot(opt: WorldAddBotOptions): any;
  updateEnvTerrain(db: any, env: any): any;
}

export interface WorldAddBotOptions {
  username: string;
  room: any;
  x: number;
  y: number;
  gcl?: number;
  cpu?: number;
  cpuAvailable?: number;
  active?: number;
  spawnName?: string;
  modules?: {}
}
