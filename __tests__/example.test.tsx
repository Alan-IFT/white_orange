/**
 * 示例单元测试 - React 19.1.0+ 组件测试
 * 演示测试组件渲染、用户交互、异步操作等
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'

// 示例组件 - 简单的计数器
function Counter({ initialCount = 0, onCountChange }) {
  const [count, setCount] = React.useState(initialCount)
  
  const increment = () => {
    const newCount = count + 1
    setCount(newCount)
    onCountChange?.(newCount)
  }
  
  const decrement = () => {
    const newCount = count - 1
    setCount(newCount)
    onCountChange?.(newCount)
  }
  
  return (
    <div>
      <span data-testid="count">Count: {count}</span>
      <button onClick={increment} data-testid="increment">
        +
      </button>
      <button onClick={decrement} data-testid="decrement">
        -
      </button>
    </div>
  )
}

// 示例组件 - 异步数据获取
function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (userId) {
      fetchUser()
    }
  }, [userId])
  
  if (loading) return <div data-testid="loading">Loading...</div>
  if (error) return <div data-testid="error">Error: {error}</div>
  if (!user) return <div data-testid="no-user">No user found</div>
  
  return (
    <div data-testid="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

describe('Counter Component', () => {
  it('renders with initial count', () => {
    render(<Counter initialCount={5} />)
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 5')
  })
  
  it('increments count when increment button is clicked', async () => {
    const user = userEvent.setup()
    const onCountChange = jest.fn()
    
    render(<Counter initialCount={0} onCountChange={onCountChange} />)
    
    const incrementButton = screen.getByTestId('increment')
    await user.click(incrementButton)
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1')
    expect(onCountChange).toHaveBeenCalledWith(1)
  })
  
  it('decrements count when decrement button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<Counter initialCount={5} />)
    
    const decrementButton = screen.getByTestId('decrement')
    await user.click(decrementButton)
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 4')
  })
  
  it('handles multiple interactions correctly', async () => {
    const user = userEvent.setup()
    
    render(<Counter initialCount={0} />)
    
    const incrementButton = screen.getByTestId('increment')
    const decrementButton = screen.getByTestId('decrement')
    
    // 多次点击测试
    await user.click(incrementButton)
    await user.click(incrementButton)
    await user.click(decrementButton)
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1')
  })
})

describe('UserProfile Component', () => {
  beforeEach(() => {
    // 重置 fetch 模拟
    global.fetch.mockClear()
  })
  
  it('shows loading state initially', () => {
    render(<UserProfile userId="123" />)
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })
  
  it('displays user data after successful fetch', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    }
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    })
    
    render(<UserProfile userId="123" />)
    
    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })
    
    expect(screen.getByTestId('user-profile')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
  
  it('displays error message when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<UserProfile userId="123" />)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Network error/)).toBeInTheDocument()
  })
  
  it('handles 404 response correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })
    
    render(<UserProfile userId="999" />)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Failed to fetch user/)).toBeInTheDocument()
  })
  
  it('does not fetch when userId is not provided', () => {
    render(<UserProfile />)
    
    expect(global.fetch).not.toHaveBeenCalled()
    expect(screen.getByTestId('no-user')).toBeInTheDocument()
  })
})

// 自定义 Hook 测试示例
function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue)
  
  const increment = React.useCallback(() => {
    setCount(prev => prev + 1)
  }, [])
  
  const decrement = React.useCallback(() => {
    setCount(prev => prev - 1)
  }, [])
  
  const reset = React.useCallback(() => {
    setCount(initialValue)
  }, [initialValue])
  
  return { count, increment, decrement, reset }
}

describe('useCounter Hook', () => {
  it('initializes with correct value', () => {
    const TestComponent = () => {
      const { count } = useCounter(10)
      return <div data-testid="count">{count}</div>
    }
    
    render(<TestComponent />)
    expect(screen.getByTestId('count')).toHaveTextContent('10')
  })
  
  it('increments count correctly', async () => {
    const user = userEvent.setup()
    
    const TestComponent = () => {
      const { count, increment } = useCounter(0)
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={increment} data-testid="increment">+</button>
        </div>
      )
    }
    
    render(<TestComponent />)
    
    await user.click(screen.getByTestId('increment'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })
  
  it('resets to initial value', async () => {
    const user = userEvent.setup()
    
    const TestComponent = () => {
      const { count, increment, reset } = useCounter(5)
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={increment} data-testid="increment">+</button>
          <button onClick={reset} data-testid="reset">Reset</button>
        </div>
      )
    }
    
    render(<TestComponent />)
    
    // 增加计数
    await user.click(screen.getByTestId('increment'))
    expect(screen.getByTestId('count')).toHaveTextContent('6')
    
    // 重置
    await user.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('count')).toHaveTextContent('5')
  })
})

// 性能测试示例
describe('Performance Tests', () => {
  it('renders large list efficiently', () => {
    const start = performance.now()
    
    const LargeList = () => (
      <ul>
        {Array.from({ length: 1000 }, (_, i) => (
          <li key={i}>Item {i}</li>
        ))}
      </ul>
    )
    
    render(<LargeList />)
    
    const end = performance.now()
    const renderTime = end - start
    
    // 确保渲染时间在合理范围内（100ms）
    expect(renderTime).toBeLessThan(100)
  })
})

// 可访问性测试示例
describe('Accessibility Tests', () => {
  it('has proper ARIA attributes', () => {
    const AccessibleButton = () => (
      <button
        aria-label="Increment counter"
        aria-describedby="counter-description"
        onClick={() => {}}
      >
        +
      </button>
    )
    
    render(
      <div>
        <AccessibleButton />
        <div id="counter-description">
          Click to increase the counter value
        </div>
      </div>
    )
    
    const button = screen.getByRole('button', { name: /increment counter/i })
    expect(button).toHaveAttribute('aria-describedby', 'counter-description')
  })
  
  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    const onFocus = jest.fn()
    
    const KeyboardNavigation = () => (
      <div>
        <button onFocus={onFocus} data-testid="button1">Button 1</button>
        <button data-testid="button2">Button 2</button>
      </div>
    )
    
    render(<KeyboardNavigation />)
    
    // 使用 Tab 键导航
    await user.tab()
    expect(screen.getByTestId('button1')).toHaveFocus()
    expect(onFocus).toHaveBeenCalled()
    
    await user.tab()
    expect(screen.getByTestId('button2')).toHaveFocus()
  })
})