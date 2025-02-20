// src/app/api/submit-survey/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the survey data
    const surveyData = await request.json();
    console.log('Original survey data:', JSON.stringify(surveyData));
    
    // Process motivation - important for "OTHER" values
    let motivation = surveyData.motivation || '';
    // If motivation starts with 'OTHER:', use the "Other" option with write-in
    if (motivation.startsWith('OTHER:')) {
      // Just keep it as-is - the Apps Script will handle "Other" properly
      // The script checks for "Other" option and uses write-in answer
    }
    
    // Convert to array format expected by the Google Apps Script
    const formattedData = [
      surveyData.language || '',
      surveyData.referralSource || '',
      surveyData.languageLevel || '',
      motivation, // Already processed
      surveyData.dailyGoal || ''
    ];
    
    console.log('Formatted data for Google Script:', JSON.stringify(formattedData));
    
    // Google Apps Script Web App URL
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbym1tRa7V_x6coQwH7ta6pkhIVj6FWuECl2pCDtpT9ebGDfdse6SXr46bx3x4h6fXP2/exec';

    try {
      // Make the request to Google Apps Script
      const response = await fetch(webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      // Get the response text and try to parse it
      const responseText = await response.text();
      console.log('Google Apps Script response:', responseText);
      
      let googleResponse;
      try {
        googleResponse = JSON.parse(responseText);
      } catch (e) {
        googleResponse = { status: 'unknown', message: responseText };
      }

      if (response.ok) {
        return NextResponse.json({ 
          message: 'Survey data submitted successfully',
          googleResponse: googleResponse
        }, { status: 200 });
      } else {
        return NextResponse.json({ 
          message: 'Failed to submit survey data',
          status: response.status,
          googleResponse: googleResponse
        }, { status: 500 });
      }
    } catch (networkError) {
      console.error('Network error with Google Script:', networkError);
      
      // Even if remote storage fails, still allow the user to proceed
      return NextResponse.json({ 
        message: 'Survey completed with local storage only',
        error: 'Remote storage unavailable'
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in submit-survey API route:', error);
    
    return NextResponse.json({ 
      message: 'Error submitting survey data', 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}