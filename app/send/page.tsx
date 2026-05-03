import LoginGate from '@/components/login-gate';
import SendEmailForm from '@/components/send-email-form';

export default function SendPage() {
  return (
    <LoginGate>
      <div>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900">Send Email</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Send a transactional email using any system or custom template.
          </p>
        </div>
        <SendEmailForm />
      </div>
    </LoginGate>
  );
}
