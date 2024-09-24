type WorkflowStepKind = 'EMAIL' | 'GRANT_OF_OPTIONS_UPDATE';

interface WorkflowStep {
    getKind(): WorkflowStepKind;
    getIsCompleted(): boolean;
    setIsCompleted(isCompleted: boolean): void;
    getIsError(): boolean;
    setIsError(isError: boolean): void;
    run(): void;
    getDependencies(): Record<WorkflowStepKind, WorkflowStep>;
}

abstract class BaseWorkflowStep implements WorkflowStep {
    private isCompleted: boolean = false;
    private dependencies: Record<WorkflowStepKind, WorkflowStep>;

    constructor(dependencies: Record<WorkflowStepKind, WorkflowStep>) {
        this.dependencies = dependencies;
    }

    abstract run(): void;
    abstract getKind(): WorkflowStepKind;

    getDependencies(): Record<WorkflowStepKind, WorkflowStep> {
        return this.dependencies;
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
}

class EmailStep extends BaseWorkflowStep {
    private kind: 'EMAIL' = 'EMAIL';

    constructor(dependencies: Record<WorkflowStepKind, WorkflowStep>) {
        super(dependencies);
    }

    getKind(): WorkflowStepKind {
        return this.kind;
    }

    run(): void {
        console.log('Email sent');
    }
}

class GrantOfOptionsUpdateStep extends BaseWorkflowStep {
    private kind: 'GRANT_OF_OPTIONS_UPDATE' = 'GRANT_OF_OPTIONS_UPDATE';

    constructor(dependencies: Record<WorkflowStepKind, WorkflowStep>) {
        super(dependencies);
    }

    getKind(): WorkflowStepKind {
        return this.kind;
    }

    run(): void {
        console.log('Grant of options updated');
    }
}


class Workflow {
  private workflowTree: Record<WorkflowStepKind, WorkflowStep>;
  private isCompleted: boolean = false;
  private hasFailed: boolean = false;

  constructor(workflowTree: Record<WorkflowStepKind, WorkflowStep>) {
    this.workflowTree = workflowTree;
  }

  getWorkflowTree(): Record<WorkflowStepKind, WorkflowStep> {
    return this.workflowTree;
  }

  getIsCompleted(): boolean {
    return this.isCompleted;
  }

  getHasFailed(): boolean {
    return this.hasFailed;
  }
}
