interface FormMessageProps {
  type: 'success' | 'error' | '';
  text: string;
}

export default function FormMessage({ type, text }: FormMessageProps) {
  if (!text) return null;
  return <div className={`message ${type}`}>{text}</div>;
}
