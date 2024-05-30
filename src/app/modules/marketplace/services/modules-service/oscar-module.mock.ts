import { Config, Info, Service } from '@grycap/oscar-js/dist/types';

export class ClientMock {
    getServices() {
        return [
            {
                name: 'bird-audio-test',
                cluster_id: '',
                memory: '2Gi',
                cpu: '2.0',
                total_memory: '',
                total_cpu: '',
                enable_gpu: false,
                enable_sgx: false,
                image_prefetch: false,
                synchronous: {
                    min_scale: 0,
                    max_scale: 0,
                },
                rescheduler_threshold: 0,
                log_level: 'CRITICAL',
                image: 'deephdc/deep-oc-birds-audio-classification-tf',
                alpine: false,
                token: 'e3158d1a6dc7ac4eabe08a296af45e7078a2fc4f9bc5dde6ffb0285ad5613c66',
                file_stage_in: false,
                input: [],
                output: [],
                script: '#!/bin/bash\n\nIMAGE_NAME=`basename $INPUT_FILE_PATH`\nOUTPUT_FILE="$TMP_OUTPUT_DIR/$IMAGE_NAME"\n\nmv $INPUT_FILE_PATH "$INPUT_FILE_PATH.mp3"\n\necho "SCRIPT: Invoked deepaas-predict command. File available in $INPUT_FILE_PATH." \ndeepaas-predict -i "$INPUT_FILE_PATH.mp3" -o $OUTPUT_FILE \n',
                expose: {
                    min_scale: 0,
                    max_scale: 0,
                    port: 0,
                    cpu_threshold: 0,
                },
                environment: {
                    Variables: {},
                },
                annotations: {},
                vo: 'vo.ai4eosc.eu',
                labels: {
                    applicationId: 'bird-audio-test',
                    oscar_service: 'bird-audio-test',
                    queue: 'bird-audio-test',
                },
                storage_providers: {
                    minio: {
                        default: {
                            endpoint: 'https://minio.domain',
                            verify: false,
                            access_key: 'minio',
                            secret_key: 'secret-key',
                            region: 'region',
                        },
                        'oscar-ai4eosc-oidc': {
                            endpoint: 'https://minio.domain',
                            verify: false,
                            access_key: 'minio',
                            secret_key: 'secret-key',
                            region: 'region',
                        },
                    },
                },
                clusters: {
                    'oscar-ai4eosc-oidc': {
                        endpoint: 'https://inference.cloud.ai4eosc.eu',
                        auth_user: '',
                        auth_password: '',
                        ssl_verify: true,
                    },
                },
                allowed_users: null,
            },

            {
                name: 'body-pose-test',
                cluster_id: '',
                memory: '2Gi',
                cpu: '1',
                total_memory: '',
                total_cpu: '',
                enable_gpu: false,
                enable_sgx: false,
                image_prefetch: false,
                synchronous: {
                    min_scale: 0,
                    max_scale: 0,
                },
                rescheduler_threshold: 0,
                log_level: 'CRITICAL',
                image: 'deephdc/deep-oc-posenet-tf',
                alpine: false,
                token: 'a4de316d8f662a270973d210b833e4d45170e092e7f46beee4d394c64e725b2e',
                file_stage_in: false,
                input: [],
                output: [],
                script: '#!/bin/bash\n\nFILE_NAME=`basename "$INPUT_FILE_PATH"`\nOUTPUT_FILE="$TMP_OUTPUT_DIR/"\n\nmv $INPUT_FILE_PATH "$INPUT_FILE_PATH.jpg"\n\ndeepaas-predict -i "$INPUT_FILE_PATH.jpg" -ct application/zip -o $OUTPUT_FILE\n',
                expose: {
                    min_scale: 0,
                    max_scale: 0,
                    port: 0,
                    cpu_threshold: 0,
                },
                environment: {
                    Variables: {},
                },
                annotations: {},
                vo: 'vo.ai4eosc.eu',
                labels: {
                    applicationId: 'body-pose-test',
                    oscar_service: 'body-pose-test',
                    queue: 'body-pose-test',
                },
                storage_providers: {
                    minio: {
                        default: {
                            endpoint: 'https://minio.domain',
                            verify: false,
                            access_key: 'minio',
                            secret_key: 'secret-key',
                            region: 'region',
                        },
                        'oscar-ai4eosc-oidc': {
                            endpoint: 'https://minio.domain',
                            verify: false,
                            access_key: 'minio',
                            secret_key: 'secret-key',
                            region: 'region',
                        },
                    },
                },
                clusters: {
                    'oscar-ai4eosc-oidc': {
                        endpoint: 'https://inference.cloud.ai4eosc.eu',
                        auth_user: '',
                        auth_password: '',
                        ssl_verify: true,
                    },
                },
                allowed_users: null,
            },
        ];
    }

    runService(oscar_endpoint: string, serviceName: string, file: string) {
        return Promise.resolve({
            mime: 'application/octet-stream',
            data: 'test-data',
        });
    }

    createService(oscar_endpoint: string, service: any): Promise<Service> {
        return Promise.resolve({
            ...service,
            cluster_id: 'oscar-ai4eosc',
            token: 'e3158d1a6dc7ac4eabe08a296af45e7078a2fc4f9bc5dde6ffb0285ad5613c66',
            vo: 'vo.ai4eosc.eu',
            clusters: {
                'oscar-ai4eosc': {
                    endpoint: 'https://inference.cloud.ai4eosc.eu',
                    auth_user: '',
                    auth_password: '',
                    ssl_verify: true,
                },
            },
        });
    }

    clusterInfo(): Promise<Info> {
        return Promise.resolve({
            version: 'devel',
            git_commit: '1c1d22d9',
            architecture: 'amd64',
            kubernetes_version: 'v1.23.17',
            serverless_backend: {
                name: 'Knative',
                version: 'v1.23.17',
            },
        });
    }

    clusterConfig(): Promise<Config> {
        return Promise.resolve({
            name: 'oscar',
            namespace: 'oscar',
            services_namespace: 'oscar-svc',
            gpu_available: false,
            serverless_backend: 'knative',
            yunikorn_enable: false,
            minio_provider: {
                endpoint: 'https://minio.test.domain',
                verify: false,
                access_key: '',
                secret_key: '',
                region: 'my-region',
            },
        });
    }
}

export const serviceOscar: Service = {
    script: '!#/bin/bash\n\n# Script\n\n',
    token: 'e3158d1a6dc7ac4eabe08a296af45e7078a2fc4f9bc5dde6ffb0285ad5613c66',
    name: 'test-service',
    memory: '1000',
    cpu: '1',
    enable_gpu: false,
    total_memory: '1000',
    total_cpu: '1',
    log_level: 'critical',
    image: 'test-image',
};
