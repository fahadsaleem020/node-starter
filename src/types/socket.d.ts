import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server, Socket } from "socket.io";

declare module "express" {
  export interface Request {
    io?: IO;
  }
}

export declare type SocketEventHandler<
  Data = { [p in string]: any },
  WithSocketObject = { socket: Socket } & Data
> = (params: WithSocketObject) => any;

export declare type IO = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
