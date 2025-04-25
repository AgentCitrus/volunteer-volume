import { Link } from 'react-router-dom';

const baseBtn =
  'inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring disabled:opacity-60';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-8 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

export const Input = props => (
  <input
    {...props}
    className={`w-full rounded-md border-gray-300 focus:border-indigo-500
                focus:ring-indigo-500 text-sm ${props.className || ''}`}
  />
);

export const TextArea = props => (
  <textarea
    {...props}
    className={`w-full rounded-md border-gray-300 focus:border-indigo-500
                focus:ring-indigo-500 text-sm ${props.className || ''}`}
  />
);

export const Button = ({
  children,
  to,
  variant = 'primary',
  className = '',
  ...rest
}) => {
  const Comp = to ? Link : 'button';
  const style =
    variant === 'secondary'
      ? 'text-indigo-700 border border-indigo-300 bg-white hover:bg-indigo-50 focus:ring-indigo-200'
      : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400';
  return (
    <Comp {...rest} to={to} className={`${baseBtn} ${style} ${className}`}>
      {children}
    </Comp>
  );
};
