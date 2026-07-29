import { Tooltip } from "@heroui/react";

export interface ColorPickerProps {
  colorKey: string;
  colorValue: string;
  onChange: (key: string, value: string) => void;
}

export const ColorPicker = ({ colorKey, colorValue, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <Tooltip content="Cliquez pour modifier la couleur" placement="top">
        <label 
          htmlFor={`color-${colorKey}`} 
          className="cursor-pointer relative block"
        >
          <div
            className="w-16 h-16 sm:w-28 sm:h-28 rounded-lg shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: colorValue }}
          />
          <input
            id={`color-${colorKey}`}
            type="color"
            value={colorValue}
            onChange={(e) => onChange(colorKey, e.target.value)}
            className="sr-only"
          />
        </label>
      </Tooltip>
      <span className="text-sm font-medium">{colorKey}</span>
      <span className="text-xs text-default-400 font-mono">{colorValue}</span>
    </div>
  );
};