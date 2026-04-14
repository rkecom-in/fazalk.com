import { useState } from 'react';
import { useGlobalUX } from '@/components/providers/GlobalUXProvider';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DirectConnectForm({ onComplete, sessionContext }: { onComplete?: () => void, sessionContext?: string }) {
  const { t, language } = useGlobalUX();
  const c = t.directConnect;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    situation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.situation) {
      setError('Please fill in your name, email, and a brief description before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Direct Connect',
          sourceDetail: sessionContext || 'General Inquiry',
          contact: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website
          },
          situation: formData.situation
        })
      });

      if (res.ok) {
        setSubmitted(true);
        if (onComplete) {
            setTimeout(onComplete, 2500);
        }
      } else {
        console.error('[DirectConnect] Server responded with error:', res.status)
        setError('Your request could not be sent right now. Please try again shortly, or reach out directly via LinkedIn.')
      }
    } catch (err) {
      console.error('[DirectConnect] Network error:', err)
      setError('We could not reach our server. Please check your connection and try again, or reach out directly via LinkedIn.')
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full py-12 text-center animate-fade-in">
        <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-serif text-foreground mb-4">{c.successHeadline}</h3>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">{c.successSubtext}</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">{c.headline}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.subtext}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto text-left">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70 tracking-widest uppercase px-1">{c.nameLabel}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (error) setError('');
              }}
              className="w-full h-12 bg-background/50 border border-border/60 rounded-xl px-4 text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/70 tracking-widest uppercase px-1">{c.emailLabel}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (error) setError('');
              }}
              className="w-full h-12 bg-background/50 border border-border/60 rounded-xl px-4 text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/70 tracking-widest uppercase px-1">{c.phoneLabel}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full h-12 bg-background/50 border border-border/60 rounded-xl px-4 text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-medium"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/70 tracking-widest uppercase px-1">{c.websiteLabel}</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder={c.websitePlaceholder}
            className="w-full h-12 bg-background/50 border border-border/60 rounded-xl px-4 text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-medium"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/70 tracking-widest uppercase px-1">{c.messageLabel}</label>
          <textarea
            required
            rows={4}
            value={formData.situation}
            onChange={(e) => {
              setFormData({...formData, situation: e.target.value});
              if (error) setError('');
            }}
            placeholder={c.messagePlaceholder}
            className="w-full bg-background/50 border border-border/60 rounded-xl p-4 text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-sm leading-relaxed resize-none font-medium"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs font-medium text-center bg-red-500/10 py-2 px-4 rounded-lg">{error}</p>
        )}

        <div className="pt-4 text-center">
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={loading}
            className="w-full md:w-auto min-w-[200px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <>
                {c.submit}
                <ArrowRight className="ms-2 w-5 h-5 opacity-80 rtl:rotate-180" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
