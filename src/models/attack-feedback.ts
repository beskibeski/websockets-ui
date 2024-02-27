export interface IAttackFeedback {
    position: {
        x: number;
        y: number;
    },
    currentPlayer: string,
    status: IStatus;
};

export type IStatus = 'miss' | 'killed' | 'shot';
