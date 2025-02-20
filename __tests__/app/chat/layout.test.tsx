import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatLayout from '@/app/(chat)/layout';

jest.mock('@/components/sidebar-desktop', () => ({
  SidebarDesktop: jest.fn(() => <div data-testid="sidebar-desktop" />),
}));

describe('ChatLayout Component', () => {
  it('renders with children', async () => {
    const children = <div data-testid="child-component">Child Content</div>;
    render(await ChatLayout({ children }));
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  it('renders the SidebarDesktop component', async () => {
    render(await ChatLayout({children: null}));
    expect(screen.getByTestId('sidebar-desktop')).toBeInTheDocument();
  });
});