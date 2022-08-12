import {Context} from "./context.model";

export interface IWorkflowAction {
    entryAction: (state: { trigger: (arg0: string) => void; }, context: Context) => void;
    exitAction: (state: { trigger: (arg0: string) => void; }, context: Context) => boolean;
}
