import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { type RunWorkflowDto, type WorkflowStatus } from './types';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  async runWorkflow(@Body() body: {workflow: RunWorkflowDto}): Promise<WorkflowStatus | undefined> {
    const {workflow} = body;

    if (!workflow) return;
    
    try {
      const workflowStatus = await this.workflowService.runWorkflow(workflow);
      
      return workflowStatus;
    }
    catch (error) {
      console.log(error);
      
      return;
    }
  }
}
