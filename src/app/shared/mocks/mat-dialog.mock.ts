import { of } from 'rxjs';

export const mockDialogRef = {
    afterClosed: jest.fn().mockReturnValue(of([])),
};

export const mockMatDialog = {
    open: jest.fn().mockReturnValue(mockDialogRef),
};
