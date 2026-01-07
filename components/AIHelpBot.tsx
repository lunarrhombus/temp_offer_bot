"use client";

import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface PropertyData {
  mlsId?: string;
  price?: number;
  address?: {
    full?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  photos?: string[];
}

interface AIHelpBotProps {
  currentStep: number;
  stepTitle?: string;
  propertyData?: PropertyData;
  formData?: any;
  onRegisterTrigger?: (triggerFn: (topic: string) => void) => void;
}

// Step-specific help content
const STEP_HELP: Record<number, {
  title: string;
  welcomeMessage: string;
  quickTips: string[];
  faqs: { q: string; a: string }[];
}> = {
  1: {
    title: "Property Address",
    welcomeMessage: "Hi! I'm here to help you find the property. Just enter the full address and I'll automatically retrieve the MLS ID and property details for you.",
    quickTips: [
      "Include full street address (e.g., 123 Main St)",
      "Add city name (e.g., Seattle)",
      "Include state (e.g., WA) and ZIP code for best results",
      "Press Enter or click 'Find Property' to search"
    ],
    faqs: [
      {
        q: "What format should I use for the address?",
        a: "Use the complete address format: '123 Main St, Seattle, WA 98101'. The more complete your address, the better the results. You can press Enter to search or click the Find Property button."
      },
      {
        q: "What if the property isn't found?",
        a: "Make sure the address exactly matches the listing. Try variations (e.g., 'Street' vs 'St', include/exclude unit numbers). If still not found, contact support for assistance."
      },
      {
        q: "What information will I see?",
        a: "Once found, you'll see property photos, listing price, beds/baths/sqft, full address, and the MLS ID is automatically retrieved for your offer."
      }
    ]
  },
  2: {
    title: "Buyer Information",
    welcomeMessage: "Let's gather the buyer information. I'll help you fill out the required fields correctly.",
    quickTips: [
      "Use full legal names exactly as they appear on ID",
      "Email must be valid - you'll receive important documents here",
      "Add a secondary buyer if purchasing with someone else",
      "Typical closing date is 30-45 days from today"
    ],
    faqs: [
      {
        q: "What is Buyer Status?",
        a: "Buyer Status determines how the title will be held. Options include: 'A married couple', 'An unmarried couple', 'A single person', 'Business entity' (LLC, Corp), or 'Trust'. This affects legal ownership and tax implications."
      },
      {
        q: "Should I add a secondary buyer?",
        a: "Add a secondary buyer if you're purchasing with a spouse, partner, or co-buyer. Use their full legal name. Leave blank if purchasing alone. Both names will appear on the purchase agreement."
      },
      {
        q: "How do I choose the closing date?",
        a: "The system defaults to 30 days from today. In 99% of transactions, closings occur 30-45 days after offer acceptance to allow time for inspections, appraisals, and financing. You can adjust based on your timeline."
      },
      {
        q: "What if my email is invalid?",
        a: "The system validates your email format (must include @ and domain like .com). Important offer documents and updates will be sent to this email, so make sure it's correct and accessible."
      }
    ]
  },
  3: {
    title: "Offer Details",
    welcomeMessage: "Now let's set up your offer details. The system has auto-filled recommended values, but I can help you adjust them.",
    quickTips: [
      "Offer price defaults to the listing price",
      "Earnest money defaults to 4% (typically 3-5% in most markets)",
      "Standard delivery is 3 days, offer expires in 3 days",
      "Most buyers choose 'Prepaid by Seller' for charges"
    ],
    faqs: [
      {
        q: "What is Earnest Money?",
        a: "Earnest money is a good-faith deposit showing you're serious. It's held in escrow and applied toward your down payment at closing. The default is 4% of the offer price. In 99% of transactions, it's 3-5%. Higher amounts can make your offer more competitive."
      },
      {
        q: "Who should hold the Earnest Money?",
        a: "Three options: 'Closing Agent' (escrow/title company - used in 99% of transactions), 'Buyer Brokerage Firm' (your agent's firm), or 'Promissory Note' (written promise to pay later - rarely used)."
      },
      {
        q: "What is Earnest Money Delivery Timeline?",
        a: "The number of days you have after mutual acceptance to deliver your earnest money. Default is 3 days. In 99% of transactions, buyers deliver within 2-5 days."
      },
      {
        q: "How long should my offer be valid?",
        a: "The 'Offer Valid For' field sets how many days the seller has to accept. Default is 3 days. In 99% of transactions, offers are valid for 2-3 days. 1 day creates urgency, 5-7 days gives more time."
      },
      {
        q: "What are Charges and Assessments?",
        a: "This determines who pays ongoing charges like HOA fees, property taxes, utilities. 'Prepaid by Seller' (used in 99% of transactions) means seller pays all through closing. 'Prorated' splits costs proportionally. 'Paid by Buyer' means you assume all charges."
      }
    ]
  },
  4: {
    title: "Optional Forms",
    welcomeMessage: "Select which optional forms to include in your offer. These add specific contingencies and protections to your purchase agreement. Form 22A (Financing Addendum) is required if you're obtaining a mortgage and specifies loan terms, down payment amount, and financial contingencies (used in ~80% of residential transactions). Form 35 (Inspection Addendum) covers inspection contingencies including home inspection, sewer inspection, and neighborhood review and is highly recommended (used in ~95% of transactions). Other optional forms include Form 22D (transaction‑specific optional clauses), Form 35E (escalation clause to top competing written offers up to a cap), and Form 34 (general addendum for bespoke clauses).",
    quickTips: [
      "Form 22A: Required if obtaining a mortgage (used in ~80% of transactions)",
      "Form 35: Highly recommended for inspections (used in ~95% of transactions)",
      "Form 22D: Attach optional, transaction‑specific clauses (seller financing, rent‑back, repair agreements)",
      "Form 35E: Use an escalation clause carefully — sets increment and cap, requires proof of competing offers",
      "Form 34: General addendum for bespoke contract language; consult your broker/attorney"
    ],
    faqs: [
      {
        q: "What is Form 22A - Financing Addendum?",
        a: "Form 22A is required if you're obtaining a mortgage or any type of loan. It specifies loan terms, down payment amount, and financial contingencies. Used in approximately 80% of residential transactions. Cash buyers don't need this form."
      },
      {
        q: "What is Form 35 - Inspection Addendum?",
        a: "Form 35 covers inspection contingencies including home inspection, sewer inspection, and neighborhood review. It allows you to request repairs or withdraw from the purchase if issues are discovered. Highly recommended and used in 95% of transactions."
      },
      {
        q: "When should I include Form 22D - Optional Clauses?",
        a: "Form 22D is used to add optional, transaction‑specific clauses to a Washington State residential offer—examples include seller‑financing terms, rent‑back/occupancy agreements, agreed repairs, extensions to closing dates, or other negotiated provisions. Include when you need custom contract language beyond standard forms. Consult your broker or attorney to ensure required disclosures and correct legal wording."
      },
      {
        q: "What does Form 35E - Escalation Clause do?",
        a: "Form 35E automatically increases the buyer's offer if a competing bona fide written offer is received. It specifies the escalation increment and a maximum cap (ceiling) the buyer will pay and typically requires proof of the competing offer or broker certification. Use carefully—confirm enforceability, disclosures, and any broker/MLS rules with your agent or attorney."
      },
      {
        q: "What is Form 34 - General Addendum?",
        a: "Form 34 is used to add transaction‑specific clauses not included in standard forms (agreed repairs, rent‑back/post‑closing occupancy, seller‑financing terms, extensions to closing). Draft clearly and consult your broker or attorney to ensure required disclosures and compliance with Washington law; this form supplements but does not replace core contract terms."
      },
      {
        q: "Should I include both 22A and 35?",
        a: "If you're financing your purchase (not paying cash), you MUST include Form 22A. Form 35 is highly recommended regardless of how you're paying - it protects you during the inspection period. Most buyers include both forms."
      },
      {
        q: "Any cautionary advice?",
        a: "Optional clauses (22D, 35E, 34) can materially change risk and obligations—always confirm wording, disclosures, and enforceability with your broker or attorney before including them."
      }
    ]
  },
  5: {
    title: "Financing Details (Form 22A)",
    welcomeMessage: "Let's fill out Form 22A with your financing details. I'll explain each field as we go.",
    quickTips: [
      "Conventional First is most common (used in 65% of transactions)",
      "Down payment defaults to percentage - typical is 10-20%",
      "Default: 5 days to apply for loan, 21 days for financing contingency",
      "Appraisal contingency defaults to YES (recommended)"
    ],
    faqs: [
      {
        q: "Which loan type should I choose?",
        a: "Options include: Conventional First (most common - 65%), Conventional Second, FHA (3.5% down minimum), Bridge (temporary), VA (0% down for veterans), USDA (rural properties, 0% down), or Other. Your lender will tell you which loan product you qualify for."
      },
      {
        q: "Percentage vs Dollar Amount for down payment?",
        a: "You can express your down payment as a percentage (e.g., 20%) or a specific dollar amount (e.g., $150,000). Percentage is more common. In 99% of conventional loans, buyers put down 3-20%. A 20% down payment avoids PMI (private mortgage insurance)."
      },
      {
        q: "What is the Days to Apply for Loan?",
        a: "The number of days after mutual acceptance you have to formally submit your loan application. Default is 5 days. In 99% of transactions, buyers apply within 3-5 days."
      },
      {
        q: "What is a Financial Contingency?",
        a: "A financing contingency allows you to cancel the contract and get your earnest money back if you can't secure a loan. The default timeframe is 21 days. This protects you if financing falls through."
      },
      {
        q: "What is Appraisal Contingency?",
        a: "Defaults to YES (recommended). If the property appraises for less than your offer price, you can renegotiate or withdraw. Selecting NO means you'll pay the difference if it appraises low - only do this if you have cash to cover any gap."
      },
      {
        q: "What if I selected VA loan?",
        a: "If you select VA loan, you'll see an additional question asking if the buyer will pay the escrow fee for the VA loan. This is a specific requirement for VA financing."
      }
    ]
  },
  6: {
    title: "Inspection Details (Form 35)",
    welcomeMessage: "Let's set up Form 35 with your inspection contingencies and timelines. The system has filled in standard values used in 99% of transactions.",
    quickTips: [
      "Inspection contingency allotted time: 10 days (standard)",
      "Additional inspection time: 10 days to complete inspections",
      "Seller has 3 days to respond to repair requests",
      "Sewer Survey defaults to YES (highly recommended)"
    ],
    faqs: [
      {
        q: "What is Inspection Contingency Allotted Time?",
        a: "The total number of days (default 10) you have to notify the seller if you want to request repairs, renegotiate, or withdraw based on inspection findings. In 99% of transactions, this is 10 days. You MUST provide written notice within this timeframe or you forfeit your inspection contingency."
      },
      {
        q: "What is Additional Inspection Time Allotment?",
        a: "The number of days (default 10) after mutual acceptance you have to complete all property inspections (home inspection, pest inspection, etc.). In 99% of transactions, buyers allow 10 days for thorough inspections."
      },
      {
        q: "What are the Response Times?",
        a: "Seller Response Time (default 3 days): How long seller has to respond to your repair requests. Buyer Reply Time (default 1 day): How long you have to respond after seller replies. These keep the transaction moving forward."
      },
      {
        q: "What is Days Before Closing for Repairs?",
        a: "The number of days before closing (default 8) that all agreed-upon repairs must be completed. This buffer ensures repairs are finished with time for you to verify the work was done satisfactorily."
      },
      {
        q: "Why is Sewer Survey important?",
        a: "A sewer scope inspection uses a specialized camera to inspect the sewer line from house to street. It can reveal expensive issues like tree root intrusion, cracks, or collapses that could cost $5,000-$20,000+ to repair. In 99% of transactions, buyers include this inspection. Selecting YES allows you to request this inspection and negotiate repairs if problems are found."
      }
    ]
  },
  7: {
    title: "Review & Submit",
    welcomeMessage: "Excellent! You've completed all the steps. Now review everything carefully before submitting your offer.",
    quickTips: [
      "Review all buyer names, addresses, and contact info",
      "Verify dollar amounts (offer price, earnest money, down payment)",
      "Check all dates (closing date, timeframes, contingency periods)",
      "Confirm which optional forms are included (22A and/or 35)"
    ],
    faqs: [
      {
        q: "What should I check before submitting?",
        a: "Verify: (1) All names are spelled correctly with full legal names, (2) Email address is correct, (3) Offer price and earnest money amounts are as intended, (4) Closing date works for your timeline, (5) Loan type and down payment are accurate if using Form 22A, (6) Inspection timeframes are reasonable if using Form 35."
      },
      {
        q: "What happens after I submit?",
        a: "Your offer will be generated as official purchase documents and sent to the seller's agent for review. The seller typically responds within the timeframe you specified in 'Offer Valid For' (usually 2-3 days). They can accept, reject, or counter your offer."
      },
      {
        q: "Can I make changes after submitting?",
        a: "Once submitted, the offer becomes official. To make changes, you'll need to submit an amendment or addendum through your agent. It's much easier to get everything right before submitting, so review carefully!"
      },
      {
        q: "What if I get an error?",
        a: "If you see an error message after clicking submit, check that all required fields are filled correctly. Common issues include invalid email format, missing buyer name, or incomplete financing/inspection details. The error message will guide you to the problem."
      }
    ]
  }
};

export default function AIHelpBot({ currentStep, stepTitle, propertyData, formData, onRegisterTrigger }: AIHelpBotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Register trigger function with parent
  useEffect(() => {
    if (onRegisterTrigger) {
      onRegisterTrigger((topic: string) => {
        setIsOpen(true);
        // Send the topic as a user message and get AI response
        setTimeout(() => {
          setInputValue(topic);
          // Trigger send by simulating the send action
          const userMsg: Message = {
            id: Date.now().toString(),
            text: topic,
            isBot: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMsg]);
          setInputValue('');
          setIsTyping(true);

          // Call API
          fetch('/api/offer-bot-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: topic,
              propertyData,
              formData,
              currentStep,
              conversationHistory: [...messages, userMsg]
            }),
          })
            .then(res => res.json())
            .then(data => {
              const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "Sorry, I couldn't process that. Can you try again?",
                isBot: true,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botMsg]);
              setIsTyping(false);
            })
            .catch(err => {
              console.error('AI chat error:', err);
              const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Oops, something went wrong. Can you try asking again?",
                isBot: true,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, errorMsg]);
              setIsTyping(false);
            });
        }, 100);
      });
    }
  }, [onRegisterTrigger, propertyData, formData, currentStep, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate contextual welcome message
  const getContextualWelcomeMessage = () => {
    const stepHelp = STEP_HELP[currentStep];
    if (!stepHelp) return '';

    let contextualInfo = '';

    // Add property context if available
    if (propertyData && propertyData.address?.full) {
      const address = propertyData.address.full;
      const price = propertyData.price ? `$${propertyData.price.toLocaleString()}` : '';
      const beds = propertyData.bedrooms;
      const baths = propertyData.bathrooms;
      const sqft = propertyData.squareFeet ? propertyData.squareFeet.toLocaleString() : '';

      if (currentStep === 1) {
        contextualInfo += `\n\nNice! Let's get your offer together.`;
      } else if (beds && baths) {
        const bedroomText = beds === 1 ? 'bedroom' : 'bedrooms';
        const bathText = baths === 1 ? 'bath' : 'baths';
        contextualInfo += `\n\nSo this is the ${beds} ${bedroomText}, ${baths} ${bathText} place at ${address}`;
        if (sqft) contextualInfo += ` - about ${sqft} square feet`;
        contextualInfo += '.';
        if (price && currentStep >= 2) {
          contextualInfo += ` Asking price is ${price}.`;
        }
      } else if (address) {
        contextualInfo += `\n\nOkay, working on ${address}!`;
      }
    }

    // Add form data context based on step
    if (formData) {
      if (currentStep === 2 && formData.buyerdata?.Buyer1Name) {
        const firstName = formData.buyerdata.Buyer1Name.split(' ')[0];
        contextualInfo += ` Hey ${firstName}!`;
      }
      if (currentStep === 3) {
        if (formData.buyerdata?.offer_price_num && propertyData?.price) {
          const offerPrice = formData.buyerdata.offer_price_num;
          const listingPrice = propertyData.price;
          const diff = offerPrice - listingPrice;

          if (Math.abs(diff) < 1000) {
            contextualInfo += ` Looks like you're going with ${formatPrice(offerPrice)} - right at asking.`;
          } else if (diff > 0) {
            contextualInfo += ` You're at ${formatPrice(offerPrice)} - coming in ${formatPrice(Math.abs(diff))} over asking. Bold move!`;
          } else {
            contextualInfo += ` You've got ${formatPrice(offerPrice)} here, about ${formatPrice(Math.abs(diff))} under their asking price.`;
          }
        }
      }
      if (currentStep === 5 && formData.Form22A?.TypeofLoan) {
        const loanType = formData.Form22A.TypeofLoan.replace('CONVENTIONAL', 'conventional').replace('FIRST', '').replace('SECOND', 'second').trim();
        contextualInfo += ` Going with ${loanType} financing, got it.`;
      }
    }

    return stepHelp.welcomeMessage + contextualInfo;
  };

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  // Add welcome message when step changes (but keep existing messages)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Only add welcome message if chat is empty
      const welcomeText = getContextualWelcomeMessage();
      if (welcomeText) {
        const welcomeMsg: Message = {
          id: `welcome-${currentStep}-${Date.now()}`,
          text: welcomeText,
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
      }
    }
  }, [currentStep, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcomeText = getContextualWelcomeMessage();
      if (welcomeText) {
        const welcomeMsg: Message = {
          id: `welcome-${Date.now()}`,
          text: welcomeText,
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: userMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call API with context
      const response = await fetch('/api/offer-bot-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          propertyData,
          formData,
          currentStep,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botResponse = data.response || "Sorry, I'm having trouble right now. Can you try again?";

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `bot-error-${Date.now()}`,
        text: "Oops, something went wrong on my end. Mind trying that again?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: action,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/offer-bot-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: action,
          propertyData,
          formData,
          currentStep,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botResponse = data.response || "Sorry, I'm having trouble right now. Can you try again?";

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `bot-error-${Date.now()}`,
        text: "Oops, something went wrong on my end. Mind trying that again?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50 flex items-center gap-2"
        aria-label="Open help bot"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium pr-2">Need Help?</span>
      </button>
    );
  }

  const stepHelp = STEP_HELP[currentStep];

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-zinc-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-blue-100">{stepHelp?.title || `Step ${currentStep}`}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1 transition"
          aria-label="Close help bot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      {stepHelp && messages.length <= 1 && (
        <div className="p-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs text-blue-700 mb-2 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction("Show me tips")}
              className="text-xs bg-white hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 transition"
            >
              💡 Tips
            </button>
            <button
              onClick={() => handleQuickAction("Give me an example")}
              className="text-xs bg-white hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 transition"
            >
              📝 Example
            </button>
            <button
              onClick={() => handleQuickAction(stepHelp.faqs[0]?.q || "Help")}
              className="text-xs bg-white hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 transition"
            >
              ❓ Common Q
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.isBot
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.isBot ? 'text-zinc-500' : 'text-blue-100'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
