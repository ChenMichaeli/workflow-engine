import { Injectable } from '@nestjs/common';
import {
  Workflow,
  EmailStep,
  WorkflowStep,
  GrantOfOptionsUpdateStep,
  type ParsedWorkflow,
  type RunWorkflowDto,
  type WorkflowStatus,
  type WorkflowStepKind
} from './types';
import { STEP_KIND } from './consts';
import { log } from 'console';

const KIND_TO_RUN_CONSTRUCTOR = {
  [STEP_KIND.EMAIL]: (id: string, kind: WorkflowStepKind) => new EmailStep(id, kind),
  [STEP_KIND.GRANT_OF_OPTIONS_UPDATE]: (id: string, kind: WorkflowStepKind) => new GrantOfOptionsUpdateStep(id, kind)
};

@Injectable()
export class WorkflowService {

  private parseWorkflow(runWorkflowDto: RunWorkflowDto): ParsedWorkflow {
    const parsedWorkflowSteps = runWorkflowDto.map(requirementDto => {
      if (Array.isArray(requirementDto)) {
        return requirementDto.map(({id, kind}) => {
          return KIND_TO_RUN_CONSTRUCTOR[kind](id, kind);
        })
      }

      return KIND_TO_RUN_CONSTRUCTOR[requirementDto.kind](requirementDto.id, requirementDto.kind);
    })

    return parsedWorkflowSteps;
  }
  
  async runWorkflow(runWorkflowDto: RunWorkflowDto): Promise<WorkflowStatus> {
    
    const parsedWorkflow = this.parseWorkflow(runWorkflowDto)
    const workflow = new Workflow(parsedWorkflow);
    
    return workflow.run();
  }
}
