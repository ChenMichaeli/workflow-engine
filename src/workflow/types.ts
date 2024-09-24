export type WorkflowStepKind = 'EMAIL' | 'GRANT_OF_OPTIONS_UPDATE';

export interface WorkflowStep {
    getId(): string;
    getKind(): WorkflowStepKind;
    getIsCompleted(): boolean;
    setIsCompleted(isCompleted: boolean): void;
    getIsError(): boolean;
    setIsError(isError: boolean): void;
    run(): Promise<BaseWorkflowStep>;
}

abstract class BaseWorkflowStep implements WorkflowStep {
    private id: string;
    private kind: WorkflowStepKind;
    private isCompleted: boolean = false;

    constructor(id: string, kind: WorkflowStepKind) {
        this.id = id;
        this.kind = kind;
    }

    abstract run(): Promise<BaseWorkflowStep>;
    
    getId(): string {
        return this.id;
    }

    getKind(): WorkflowStepKind {
        return this.kind;
    }

    getIsCompleted(): boolean {
        return this.isCompleted;
    }

    setIsCompleted(isCompleted: boolean): void {
        this.isCompleted = isCompleted;
    }

    getIsError(): boolean {
        return this.isCompleted;
    }

    setIsError(isCompleted: boolean): void {
        this.isCompleted = isCompleted;
    }
};

export class EmailStep extends BaseWorkflowStep {
    constructor(id: string, kind: WorkflowStepKind) {
        super(id, kind);
    }

    async run(): Promise<BaseWorkflowStep> {
        return new Promise((resolve) => {
            console.log('Email sent');
            this.setIsCompleted(true);
            
            resolve(this);
        });
    }
};

export class GrantOfOptionsUpdateStep extends BaseWorkflowStep {
    constructor(id: string, kind: WorkflowStepKind) {
        super(id, kind);
    }

    async run(): Promise<BaseWorkflowStep> {
        return new Promise((resolve) => {
            console.log('Grant of options updated');
            this.setIsCompleted(true);
            
            resolve(this);
        });
    }
};

export type ParsedWorkflow = (WorkflowStep | WorkflowStep[])[];

export class Workflow {
  private workflow: ParsedWorkflow;
  private isCompleted: string[] = [];
  private hasFailed: string[] = [];

  constructor(parsedWorkflow: ParsedWorkflow) {
    this.workflow = parsedWorkflow;
  }

  getWorkflow(): ParsedWorkflow {
    return this.workflow;
  }

  async run(): Promise<WorkflowStatus> {
    let failed = false;

    for (let i=0; i< this.workflow.length; i++) {
        const workflowStep =  this.workflow[i];

        if (Array.isArray(workflowStep)) {
            const stepsPromises = workflowStep.map(step => step.run());

            const results = await Promise.allSettled(stepsPromises);

            for (let j=0; j<results.length; j++) {
                const result = results[j];
                
                if (result.status === 'fulfilled') {
                    if (result.value.getIsCompleted()) {
                        this.isCompleted.push(result.value.getId());
                    }
                }
                else if (result.status === 'rejected') {
                    this.hasFailed.push(workflowStep[i][j].getId());
                    failed = true;
                    break;
                }
            };

            if (failed) break;
        }
        else {
            try {
                await workflowStep.run();
                this.isCompleted.push(workflowStep.getId());
            }
            catch {
                workflowStep.setIsError(true);
                this.hasFailed.push(workflowStep.getId());
                break;
            }
        }
    }

    return {
        isCompleted: this.isCompleted,
        hasFailed: this.hasFailed
    };
  }
}

type StepRequirements = {
    id: string;
    kind: WorkflowStepKind;
}

export type RunWorkflowDto = (StepRequirements | StepRequirements[])[];

export type WorkflowStatus = {
    isCompleted: string[],
    hasFailed: string[]
};
