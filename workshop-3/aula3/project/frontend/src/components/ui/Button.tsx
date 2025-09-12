import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, variant = 'default', size = 'default', ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'outline':
          return {
            border: '2px solid #d1d5db',
            backgroundColor: '#ffffff',
            color: '#111827'
          }
        case 'secondary':
          return {
            backgroundColor: '#e5e7eb',
            color: '#374151',
            border: '2px solid #e5e7eb'
          }
        default:
          return {
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: '2px solid #2563eb'
          }
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            height: '36px',
            paddingLeft: '12px',
            paddingRight: '12px'
          }
        case 'lg':
          return {
            height: '44px',
            paddingLeft: '32px',
            paddingRight: '32px'
          }
        default:
          return {
            height: '40px',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px'
          }
      }
    }

    return (
      <button
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '500',
          transition: 'colors 0.2s',
          cursor: 'pointer',
          borderRadius: '6px',
          ...getVariantStyles(),
          ...getSizeStyles(),
          ...style
        }}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'