import { of } from 'rxjs';

export const mockedMarkdownService: any = {
    reload$: of(),
    parse: jest.fn().mockReturnValue(of('')),
    render: jest.fn().mockImplementation(() => null),
};
