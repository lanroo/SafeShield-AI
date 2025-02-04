import { SvgIconComponent } from "@mui/icons-material";

export interface StatCardProps {
  icon: SvgIconComponent;
  title: string;
  value: string | number;
  color: string;
}

export interface Attack {
  source: [number, number];
  target: [number, number];
  type: string;
}
