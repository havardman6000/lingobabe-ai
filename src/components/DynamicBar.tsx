// src/components/DynamicBar.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './DynamicBar.css';

interface NavItem {
  id: string;
  title: string;
  icon: string | null;
}

const DynamicBar: React.FC = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string>('bolt'); // Setting bolt as default active item

  // Navigation items configuration
  // Corrected navItems array with proper path handling
const navItems: NavItem[] = [
  { id: 'photo', title: 'Photo', icon: '/tutors/MenuBar_photo.png' },
  { id: 'chat', title: 'Chat', icon: '/tutors/MenuBar_chat.png' },
  { id: 'heart', title: 'Heart', icon: '/tutors/MenuBar_heart.png' },
  { id: 'bolt', title: 'Bolt', icon: '/tutors/MenuBar_bolt.png' },
  { id: 'user', title: 'User', icon: '/tutors/MenuBar_user.png' },
];
  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.id);
    
    // Navigate to corresponding page - adjust paths as needed
    switch(item.id) {
      case 'photo':
        router.push('/'); 
        break;
      case 'chat':
        router.push('/chat');
        break;
      case 'heart':
        router.push('/favorites');
        break;
      case 'bolt':
        router.push('/actions');
        break;
      case 'user':
        router.push('/profile');
        break;
      default:
        router.push('/');
    }
  };

  // Safely render icon or placeholder
  const renderIcon = (icon: string | null, isActive: boolean, title: string) => {
    // Check if icon is null, undefined, or empty string
    if (!icon || icon === '') {
      return (
        <div 
          className={`icon-placeholder ${isActive ? 'active-placeholder' : ''}`}
          aria-label={`${title} icon placeholder`}
        >
          {/* Optional: Display first letter of title as fallback */}
          {title.charAt(0)}
        </div>
      );
    }
    
    return (
      <img 
        src={icon} 
        alt={`${title} icon`}
        className={`nav-icon ${isActive ? 'active-icon' : ''}`}
        onError={(e) => {
          // If image fails to load, replace with placeholder
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Prevent infinite error loop
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const placeholder = document.createElement('div');
            placeholder.className = `icon-placeholder ${isActive ? 'active-placeholder' : ''}`;
            placeholder.textContent = title.charAt(0);
            placeholder.setAttribute('aria-label', `${title} icon placeholder`);
            parent.appendChild(placeholder);
          }
        }}
      />
    );
  };

  return (
    <div className="circular-nav-container">
      <div className="nav-buttons-container">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              className={`nav-button ${isActive ? '' : ''}`}
              onClick={() => handleNavClick(item)}
              aria-label={item.title}
              aria-pressed={isActive}
            >
              {renderIcon(item.icon, isActive, item.title)}
            </button>
          );
        })}
      </div>
      
      {/* Center active button */}
      <div className="active-center-button">
        {activeItem && (
          <div className="active-circle">
            {renderIcon(
              navItems.find(item => item.id === activeItem)?.icon || null,
              true,
              navItems.find(item => item.id === activeItem)?.title || ''
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicBar;