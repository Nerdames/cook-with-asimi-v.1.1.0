import React from 'react';
import styles from './SkeletonButton.module.css';

interface SkeletonButtonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  width = '120px',
  height = '40px',
  borderRadius = 'var(--button-border-radius)',
  className = '',
}) => {
  return (
    <div
      className={`${styles.skeletonButton} ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default SkeletonButton;
