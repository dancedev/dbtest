import {IWorkflowAction} from "./workflow.action.interface";
import {TransitionId} from "../../enums/transition.id.enum";
import {Context} from "./context.model";

export class WaitAction implements IWorkflowAction{
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('WaitAction.entry');
        state.trigger(TransitionId.EVALUATE);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('WaitAction.exit');
        return true;
    }

}
