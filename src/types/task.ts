export type Task = {
    taskId: string,
    status: string,
    description: string,
    timestamp: string,
    response: TaskResponse,
    [key: string]: any
}

export type TaskResponse = {
    resourceId?: number, 
    [key: string]: any
}

// { taskId: '32c1d876-8829-4a30-be23-cc5ca8a7ec03',
//   commandType: 'cloudAccountDeleteRequest',
//   status: 'processing-completed',
//   description:
//    'Request processing completed successfully and its resources are now being provisioned / de-provisioned.',
//   timestamp: '2020-04-24T21:42:19.367Z',
//   response: { resourceId: 16330 },
//   _links:
//    { self:
//       { href:
//          'https://***/v1/tasks/32c1d876-8829-4a30-be23-cc5ca8a7ec03',
//         type: 'GET' } } }