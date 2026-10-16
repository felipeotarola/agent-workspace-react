import { useId } from "react";
export function Switch({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="ui-switch-row">
      <div>
        <span id={id} className="ui-switch-label">
          {label}
        </span>
        {description && <p id={`${id}-hint`}>{description}</p>}
      </div>
      <button
        type="button"
        className="ui-switch"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        aria-describedby={description ? `${id}-hint` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
