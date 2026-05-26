export interface OneClickLogoProps {
  size?: 'small' | 'medium' | 'large' | 'custom';
  layout?: 'horizontal' | 'vertical';
  customSize?: {
    width: number;
    height: number;
  };
  className?: string;
  showFullText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  as?: 'div' | 'span';
  onClick?: () => void;
  'aria-label'?: string;
}

export interface LogoMarkProps {
  size: number;
  variant: 'light' | 'dark';
  className?: string;
}

export interface BrandTextProps {
  size: 'small' | 'medium' | 'large' | 'custom';
  customFontSize?: string;
  variant: 'light' | 'dark';
  showFullText: boolean;
  className?: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;      // Circle background
    accent: string;       // Red square (#e61e25)
    border: string;       // Circle border
    text: string;         // Primary text color
    textStroke: string;   // Text outline color
    secondary: string;    // "Advertisement LLC" text
  };
  fonts: {
    primary: string;      // Main brand text font stack
    weights: {
      primary: number;    // 900
      secondary: number;  // 600
    };
  };
}

export interface LayoutConfig {
  horizontal: {
    flexDirection: 'row';
    alignItems: 'center';
    textAlign: 'left';
  };
  vertical: {
    flexDirection: 'column';
    alignItems: 'center';
    textAlign: 'center';
  };
}