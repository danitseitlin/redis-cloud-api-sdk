export type Task = {
    taskId: string,
    status: TaskStatus,
    description: string,
    timestamp: string,
    response: TaskResponse,
    [key: string]: any
}

export type TaskResponse = {
    resourceId: number,
    error?: ErrorResponse,
    [key: string]: any
}

export type ErrorResponse = {
    type: string,
    status: string,
    description: string
}
export type TaskStatus = 'processing-completed' | 'processing-error';
