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
    type?: string,
    status?: string,
    description?: string,
    [key: string]: any
}

/**
 * The available task status
 * @param processing-completed Completed status
 * @param processing-error Error status
 */
export type TaskStatus = 'processing-completed' | 'processing-error';
