import { useId } from 'react';
export default function Field({ label, options, multiline, className = '', ...props }) {
  const id = useId(), Tag = multiline ? 'textarea' : options ? 'select' : 'input';
  return <div className={'space-y-1.5 ' + className}>
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</label>
    <Tag id={id} className="neu-inset w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60" {...props}>
      {options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </Tag>
  </div>;
}
