import log from "pino";

export const logger = log({
  base: {
    pid: false,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
