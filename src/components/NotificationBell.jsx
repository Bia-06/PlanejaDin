import React, { useState, useEffect, useRef } from 'react';
import { Megaphone } from 'lucide-react'; // Trocamos o sino pelo Megafone
import { supabase } from '../config/supabase'; 

export default function NotificationBell({ variant = 'default' }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('system_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erro ao buscar notificações:', error);
      return;
    }

    if (data) {
      setNotifications(data);
      checkIfNew(data);
    }
  };

  const checkIfNew = (notifs) => {
    if (notifs.length === 0) return;
    const lastSeenDate = localStorage.getItem('last_seen_notification_date');
    const mostRecentDate = notifs[0].created_at;
    if (!lastSeenDate || new Date(mostRecentDate) > new Date(lastSeenDate)) {
      setHasNew(true);
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (notifications.length > 0 && !isOpen) {
      localStorage.setItem('last_seen_notification_date', notifications[0].created_at);
      setHasNew(false);
    }
  };

  // Lógica: Se for no rodapé (sidebar-footer), abre para CIMA. Senão, abre para BAIXO.
  const dropdownClasses = variant === 'sidebar-footer'
    ? "absolute bottom-full left-0 mb-4 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2"
    : "absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleOpen}
        className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative text-gray-500 dark:text-gray-400 hover:text-teal dark:hover:text-white"
        title="Novidades"
      >
        <Megaphone size={20} />
        {hasNew && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-gray-800"></span>
        )}
      </button>

      {isOpen && (
        <div className={dropdownClasses}>
          <div className="bg-mint p-3 flex items-center gap-2"> 
            <Megaphone size={16} className="text-white" />
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Atualizações & Novidades</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs">
                Nenhuma novidade recente.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{notif.title}</h4>
                    <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      {new Date(notif.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}