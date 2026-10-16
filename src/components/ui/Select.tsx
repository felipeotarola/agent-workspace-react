import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
type Props = {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

/** Shared value selection. Radix owns keyboard navigation, positioning and focus return. */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Välj ett alternativ",
  id,
  name,
  disabled,
  className = "",
  ...aria
}: Props) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement>();
  useEffect(() => {
    setPortalContainer(trigger.current?.closest("dialog") ?? undefined);
  }, []);
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        ref={trigger}
        id={id}
        className={`ui-field ui-select-trigger ${className}`}
        {...aria}
      >
        <span className="ui-select-value">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon className="ui-select-chevron">
          <ChevronDown size={15} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal container={portalContainer}>
        <SelectPrimitive.Content
          className="ui-select-content"
          position="popper"
          sideOffset={8}
          collisionPadding={12}
        >
          <SelectPrimitive.ScrollUpButton className="ui-select-scroll">
            <ChevronUp size={15} />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="ui-select-viewport">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                textValue={option.label}
                className="ui-select-item"
              >
                <span className="ui-select-item-copy">
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  {option.description && (
                    <span className="ui-select-description">
                      {option.description}
                    </span>
                  )}
                </span>
                <SelectPrimitive.ItemIndicator className="ui-select-indicator">
                  <Check size={15} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="ui-select-scroll">
            <ChevronDown size={15} />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
