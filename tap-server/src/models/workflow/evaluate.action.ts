import {IWorkflowAction} from "./workflow.action.interface";
import {TransitionId} from "../../enums/transition.id.enum";
import {Context} from "./context.model";

export class EvaluateAction implements IWorkflowAction{
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('EvaluateAction.entry');
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('EvaluateAction.exit');
        return true;
    }

}
