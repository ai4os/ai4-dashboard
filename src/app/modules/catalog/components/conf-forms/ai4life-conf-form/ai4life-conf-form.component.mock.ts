import { Ai4lifeConfiguration } from '@app/shared/interfaces/module.interface';

export const ai4lifeDefaultFormValues: Ai4lifeConfiguration = {
    model_id: {
        name: 'AI4Life model ID',
        value: '10.5281/zenodo.5764892',
        description: 'AI4Life model ID.',
        options: [
            'emotional-cricket',
            'ambitious-sloth',
            'good-butterfly',
            'zealous-snail',
            'exuberant-parrot',
        ],
    },
};
