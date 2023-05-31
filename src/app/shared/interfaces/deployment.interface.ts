export interface Deployment { }
export interface DeploymentInfo {
        job_ID: string,
        status: string,
        owner: string,
        title: string,
        description?: string,
        docker_image: string,
        submit_time: string,
        resources?: {
                cpu_num: number,
                gpu_num: number,
                memoryMB: number,
                diskMB: number,
        },
        endpoints?: object,
        alloc_ID?: string,
        error_msg: string
}