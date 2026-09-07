import React, { useEffect, useState, useRef } from 'react';
import getCaretCoordinates from 'textarea-caret';
import { animate } from 'animejs';
import { useMediaQuery } from '@/hooks/use-media-query'; // Wait, let's just use CSS for mobile media query

interface UserMention {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
}

interface MentionDropdownProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  query: string;
  users: UserMention[];
  onSelect: (user: UserMention) => void;
  visible: boolean;
}

export function MentionDropdown({
  textareaRef,
  query,
  users,
  onSelect,
  visible,
}: MentionDropdownProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Use a simple window width check for mobile (fallback to CSS media queries if needed)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (visible && textareaRef.current && !isMobile) {
      const caret = getCaretCoordinates(textareaRef.current, textareaRef.current.selectionEnd);
      // We need to account for textarea scroll and position
      setCoords({
        top: caret.top - textareaRef.current.scrollTop + 24, // below the text
        left: caret.left,
      });
    }
  }, [visible, query, textareaRef, isMobile]);

  useEffect(() => {
    if (visible && menuRef.current) {
      animate({
        targets: menuRef.current,
        opacity: [0, 1],
        translateY: isMobile ? ['100%', '0%'] : [-10, 0],
        duration: 350,
        easing: 'easeOutExpo',
      });
      
      // Stagger items
      animate({
        targets: '.mention-item',
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: animate.stagger(50, { start: 100 }),
        duration: 400,
        easing: 'easeOutQuad',
      });
    }
  }, [visible, isMobile]);

  if (!visible || users.length === 0) return null;

  if (isMobile) {
    // Drawer style for mobile (fixed bottom sheet)
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => onSelect(users[0])} // or just dismiss, but we don't have dismiss prop. Clicking outside could just keep textarea focused, but let's just let it be.
        />
        <div 
          ref={menuRef}
          className="relative bg-dark-900 border-t border-border rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] pb-4"
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-dark-600" />
          </div>
          <div className="px-4 py-2 border-b border-border text-xs text-text-muted font-semibold uppercase tracking-wider">
            Sugerencias de @usuario
          </div>
          <div className="overflow-y-auto p-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelect(user)}
                className="mention-item w-full flex items-center gap-4 p-3 hover:bg-dark-700 rounded-xl transition-colors text-left outline-none"
              >
                <img
                  src={user.profileImage || '/placeholder-avatar.png'}
                  alt=""
                  className="w-10 h-10 rounded-full bg-dark-600 object-cover shrink-0 ring-2 ring-dark-700"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-base font-medium text-text-primary truncate">{user.displayName}</span>
                  <span className="text-sm text-text-muted truncate">@{user.username}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Floating Notion-style popover for desktop
  if (!coords) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-dark-800/95 backdrop-blur-md border border-dark-600/50 rounded-xl shadow-xl overflow-hidden z-50 w-64 max-h-64 flex flex-col opacity-0"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
    >
      <div className="px-3 py-2 bg-dark-900/50 border-b border-dark-600/30 text-xs text-text-muted font-semibold uppercase tracking-wider">
        Mencionar a...
      </div>
      <div className="overflow-y-auto p-1.5">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelect(user)}
            className="mention-item w-full flex items-center gap-3 p-2 hover:bg-dark-700/80 rounded-lg transition-colors text-left outline-none focus:bg-dark-700"
          >
            <img
              src={user.profileImage || '/placeholder-avatar.png'}
              alt=""
              className="w-7 h-7 rounded-full bg-dark-600 object-cover shrink-0"
            />
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-sm font-medium text-text-primary truncate leading-tight">{user.displayName}</span>
              <span className="text-xs text-text-muted truncate">@{user.username}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
