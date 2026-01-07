import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, propertyData, formData, currentStep, conversationHistory } = body;

    // Validate OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build context for the AI
    let contextPrompt = `You are a helpful real estate assistant helping someone fill out a home purchase offer form. You should be friendly, conversational, and provide clear guidance.

Current Step: ${currentStep}
`;

    // Add property context if available
    if (propertyData && propertyData.address?.full) {
      contextPrompt += `\nProperty: ${propertyData.address.full}`;
      if (propertyData.price) {
        contextPrompt += `\nListing Price: $${propertyData.price.toLocaleString()}`;
      }
      if (propertyData.bedrooms && propertyData.bathrooms) {
        contextPrompt += `\nBeds/Baths: ${propertyData.bedrooms}/${propertyData.bathrooms}`;
      }
      if (propertyData.squareFeet) {
        contextPrompt += `\nSquare Feet: ${propertyData.squareFeet.toLocaleString()}`;
      }
    }

    // Add form data context
    if (formData) {
      if (formData.buyerdata?.Buyer1Name) {
        contextPrompt += `\nBuyer Name: ${formData.buyerdata.Buyer1Name}`;
      }
      if (formData.buyerdata?.offer_price_num) {
        contextPrompt += `\nOffer Price: $${formData.buyerdata.offer_price_num.toLocaleString()}`;
      }
    }

    contextPrompt += `\n\nProvide helpful, friendly answers. Keep responses concise (2-4 sentences). Use natural, conversational language. Don't use technical jargon unless necessary, and if you do, explain it simply.`;

    // Build messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: contextPrompt
      },
      // Include conversation history (last 10 messages to keep context manageable)
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Can you try asking in a different way?";

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
