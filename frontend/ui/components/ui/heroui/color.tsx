import { ColorArea } from "@heroui/react";
import type { Color } from "@heroui/react";
import { ColorField, ColorSwatch, Label, parseColor } from "@heroui/react";
import { useState } from "react";

export function ColorAreaBasic() {
  return (
    <ColorArea defaultValue="rgb(116, 52, 255)">
      <ColorArea.Thumb />
    </ColorArea>
  );
}

export function Basic() {
  const [color, setColor] = useState<Color | null>(parseColor("#0485F7"));

  return (
    <ColorField
      className="w-[280px]"
      name="color"
      value={color}
      onChange={setColor}
    >
      <Label>Color</Label>
      <ColorField.Group>
        <ColorField.Prefix>
          <ColorSwatch color={color ?? undefined} size="xs" />
        </ColorField.Prefix>
        <ColorField.Input />
      </ColorField.Group>
    </ColorField>
  );
}
