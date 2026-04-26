export type IMessage<MT extends string, T extends {} = {}> = T & { type: MT; };

