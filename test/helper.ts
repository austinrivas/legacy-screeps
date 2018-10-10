/*

 Screeps Typescript Test Helper

 We add the following to the global namespace to mimic the Screeps runtime:
 + lodash
 + Screeps game constants
 + Memory Array
 */
declare const global: any;
declare const _: any;

import * as lodash from "lodash";
import consts from "./mock/game";

global._ = lodash;
global.RoomObjects = {};
global.Memory = {
  creeps: []
};
global.Store = {};
global.Game = {
  creeps: [],
  rooms: [],
  spawns: {},
  time: 12345
};
global.Room = {};
global.Structure = {};
global.Spawn = {};
global.Creep = {};
global.RoomPosition = {};
global.Source = {};
global.Flag = {};

_.merge(global, consts);
