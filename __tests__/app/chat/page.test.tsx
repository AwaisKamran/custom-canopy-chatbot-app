import { waitFor } from '@testing-library/react';
import { auth } from '@/auth';
import { getMissingKeys } from '@/app/actions';
import { redirect } from 'next/navigation';
import IndexPage from '@/app/(chat)/page';
import { renderWithProviders } from '@/__tests__/utils/render';
import { generateMockUser } from '@/__mocks__/data/user';
import { mockIntersectionObserver, mockScrollIntoView } from '@/__mocks__';

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/app/actions', () => ({
  getMissingKeys: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/chat'),
  redirect: jest.fn(),
}));


window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
window.IntersectionObserver = mockIntersectionObserver;

describe('IndexPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to login if no session exists', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await IndexPage();

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('should render the Chat component with session and missing keys', async () => {
    const mockMissingKeys = ['key1', 'key2'];
    const mockSession = generateMockUser();

    (auth as jest.Mock).mockResolvedValue(mockSession);
    (getMissingKeys as jest.Mock).mockResolvedValue(mockMissingKeys);

    const { getByTestId } = renderWithProviders(await IndexPage());

    await waitFor(() => {
      expect(getByTestId('send-message-button')).toBeInTheDocument();
    });
  });
});