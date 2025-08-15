/**
 * Reusable loading spinner component
 */
import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-transparent',
          'border-t-primary border-r-primary',
          'transition-smooth',
          sizeClasses[size]
        )}
        style={{
          background: 'conic-gradient(from 0deg, hsl(var(--primary)) 0%, transparent 50%, hsl(var(--primary)) 100%)',
          WebkitMask: 'radial-gradient(circle, transparent 30%, black 30%)',
          mask: 'radial-gradient(circle, transparent 30%, black 30%)'
        }}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner