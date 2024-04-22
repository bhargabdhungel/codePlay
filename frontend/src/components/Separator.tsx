import { Direction } from "../assets/types.ts";

interface SeparatorProps {
  type: Direction;
  lineWidth?: string;
  color?: string;
}

function Separator({
  type,
  lineWidth = "1px",
  color = "white",
}: SeparatorProps) {
  const style = {
    width: type === Direction.Horizontal ? "100%" : lineWidth,
    height: type === Direction.Vertical ? "100%" : lineWidth,
    borderTop:
      type === Direction.Horizontal ? `${lineWidth} solid ${color}` : "none",
    borderLeft:
      type === Direction.Vertical ? `${lineWidth} solid ${color}` : "none",
  };

  return <div style={style}></div>;
}

export default Separator;
