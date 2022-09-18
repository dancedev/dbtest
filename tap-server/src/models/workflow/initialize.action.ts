import {IWorkflowAction} from "./workflow.action.interface";
import {TransitionId} from "../../enums/transition.id.enum";
import {Context} from "./context.model";

export class InitializeAction implements IWorkflowAction{
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('InitializeAction.entry');
        //state.trigger(TransitionId.CREATE);


    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('InitializeAction.exit');
        return true;
    }
}
