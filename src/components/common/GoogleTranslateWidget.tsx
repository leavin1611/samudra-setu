
'use client';

import { useEffect } from 'react';

export function GoogleTranslateWidget() {
  useEffect(() => {
    // Function to initialize the widget
    const googleTranslateElementInit = () => {
      // Check if the google object and translate element are available
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    };

    // Check if the script is already loaded
    if (document.getElementById('google-translate-script')) {
      // If script exists, but widget isn't there, re-initialize
      if (!document.querySelector('.goog-te-combo')) {
        googleTranslateElementInit();
      }
      return;
    }

    // Assign the init function to the window object
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Create and append the script
    const addScript = document.createElement('script');
    addScript.id = 'google-translate-script';
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

  }, []);

  return (
    <div>
        <div id="google_translate_element" />
    </div>
  );
}

// Extend the Window interface
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google: {
        translate: {
            TranslateElement: any; // You can be more specific if you have the types
        }
    }
  }
}
