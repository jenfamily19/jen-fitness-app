import { useEffect } from 'react';
import { useStore } from '../store';

export default function NotificationEngine() {
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const state = useStore.getState();
      const supplements = state.supplements;
      const updateSupplement = state.updateSupplement;
      
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      const todayDate = now.toISOString().split('T')[0];

      supplements.forEach(supp => {
        if (!supp.scheduleTime) return;
        
        if (supp.scheduleTime === currentTime && supp.lastNotifiedDate !== todayDate) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Supplement Reminder`, {
              body: `It's time to take ${supp.name} (${supp.daily} ${supp.unit})`,
            });
          }
          updateSupplement(supp.id, { lastNotifiedDate: todayDate });
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
