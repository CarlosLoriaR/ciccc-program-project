import type { InputHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';

type FormInputProps = {
  label: string;
  icon: IconType;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({ label, icon: Icon, ...inputProps }: FormInputProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-2">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium placeholder:text-outline placeholder:font-normal border border-transparent focus:border-primary focus:outline-none transition-colors"
          {...inputProps}
        />
      </div>
    </div>
  );
};

export default FormInput;
