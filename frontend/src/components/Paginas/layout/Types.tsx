// types.ts
export interface Action {
    id: string;
    name: string;
    icon?: React.ReactNode;
    title: string;
    variant: "text" | "outlined" | "contained";
  }
  