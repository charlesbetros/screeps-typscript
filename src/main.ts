export const loop = () => {
  // test
  for (const name in Game.spawns) {
    Game.spawns[name].createCreep([MOVE]);
    for (const creep in Game.creeps) {
      Game.creeps[creep].move(TOP);
    }
  }
  //

  //Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
