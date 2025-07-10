import { of } from 'rxjs';

export const mockedChatBotService = {
    requestResponse: jest.fn().mockReturnValue(of('Hi there!')),
};
