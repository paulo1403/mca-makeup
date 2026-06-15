"use client";

import { Heart, Loader2, Sparkles, Star } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Modal, { ModalBody, ModalHeader } from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";

interface EasterEggProps {
  taps?: number;
  timeout?: number;
  children: React.ReactNode;
}

interface MotivationalMessage {
  message: string;
  author: string;
}

export default function EasterEgg({ taps = 5, timeout = 3000, children }: EasterEggProps) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<MotivationalMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchMessage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/motivation");
      const data = await res.json();
      setMsg(data);
    } catch {
      setMsg({ message: "Sigue adelante. Eres más fuerte de lo que crees.", author: "— Para Marcela" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    setProgress((p) => {
      const next = p + 1;
      if (next >= taps) {
        setOpen(true);
        setProgress(0);
        clearTimeout(timerRef.current);
        fetchMessage();
        return 0;
      }
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setProgress(0), timeout);
      return next;
    });
  }, [taps, timeout, fetchMessage]);

  return (
    <>
      <button type="button" onClick={handleClick} className="relative cursor-pointer">
        {children}
        {progress > 0 && progress < taps ? (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-primary) text-[10px] font-bold text-white">
            {taps - progress}
          </span>
        ) : null}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} size="md">
        <ModalHeader title="" onClose={() => setOpen(false)} />
        <ModalBody>
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
              <Typography as="p" variant="p" className="text-(--color-muted)">
                Cargando mensaje...
              </Typography>
            </div>
          ) : msg ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex gap-1">
                <Star className="h-6 w-6 text-yellow-400" />
                <Heart className="h-6 w-6 text-red-400" />
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>

              <Typography as="h3" variant="h3" className="text-(--color-heading)">
                Para Marcela ❤️
              </Typography>

              <div className="max-w-md">
                <p className="text-lg leading-relaxed text-(--color-body)">&ldquo;{msg.message}&rdquo;</p>
                <p className="mt-3 text-sm text-(--color-muted)">{msg.author}</p>
              </div>

              <div className="flex gap-1">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <Heart className="h-5 w-5 text-red-400" />
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          ) : null}
        </ModalBody>
      </Modal>
    </>
  );
}
