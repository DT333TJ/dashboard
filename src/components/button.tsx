import { Button as AntButton, ButtonProps } from "antd";

export const Button = (props: ButtonProps) => {
  const { size, children, color, variant } = props
  return (
    <AntButton size={size} variant={variant} color={color}>
      {children}
    </AntButton>
  )
}