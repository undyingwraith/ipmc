export type ICreateCommand<TCommand extends {}> = (runner: (argv: TCommand) => Promise<void> | void) => any
