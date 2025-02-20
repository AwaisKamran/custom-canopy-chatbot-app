import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createTestStore } from './store'
import { RootState, store as reduxStore } from '@/lib/redux/store'
import { TooltipProvider } from '@/components/ui/tooltip'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState = {}, ...renderOptions }: CustomRenderOptions = {}
) => {
  const store = {...reduxStore, ...createTestStore(preloadedState)}

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <TooltipProvider>{children}</TooltipProvider>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}
