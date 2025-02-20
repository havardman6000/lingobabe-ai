// src/context/SurveyContext.tsx (modified)
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SurveyData {
  language: string;
  referralSource: string;
  languageLevel: string;
  motivation: string;
  dailyGoal: string;
}

interface SurveyContextProps {
  surveyData: SurveyData;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    language: '',
    referralSource: '',
    languageLevel: '',
    motivation: '',
    dailyGoal: '',
  });

  // Load survey data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('lingobabe_survey_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSurveyData(parsedData);
      } catch (e) {
        console.error('Error parsing saved survey data:', e);
      }
    }
  }, []);

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData((prevData) => {
      const newData = { ...prevData, ...data };
      // Save to localStorage for persistence
      localStorage.setItem('lingobabe_survey_data', JSON.stringify(newData));
      return newData;
    });
  };

  const resetSurvey = () => {
    const defaultData = {
      language: '',
      referralSource: '',
      languageLevel: '',
      motivation: '',
      dailyGoal: '',
    };
    setSurveyData(defaultData);
    localStorage.removeItem('lingobabe_survey_data');
    localStorage.removeItem('lingobabe_survey_completed');
  };

  return (
    <SurveyContext.Provider value={{ surveyData, updateSurveyData, resetSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};