import {IWorkflowAction} from "./workflow.action.interface";
import {TransitionId} from "../../enums/transition.id.enum";
import {Context} from "./context.model";

export class StartAction implements IWorkflowAction{
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('StartAction.entry');
        context.value += 1
        state.trigger(TransitionId.EVALUATE);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('StartAction.exit');
        return true;
    }

}
