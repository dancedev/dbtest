import {IWorkflowAction} from "./workflow.action.interface";
import {TransitionId} from "../../enums/transition.id.enum";
import {Context} from "./context.model";

export class CreateAction implements IWorkflowAction{
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('CreateAction.entry');
        state.trigger(TransitionId.START);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('CreateAction.exit');
        return true;
    }

}
