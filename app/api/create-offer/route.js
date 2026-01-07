import nodemailer from 'nodemailer';

// Email configuration from existing send-email route
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_ACCOUNT_EMAIL,
    pass: process.env.ZOHO_ACCOUNT_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const offerData = await request.json();

    // Validate required fields
    if (!offerData.MLS_ID || !offerData.buyerdata) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { MLS_ID, buyerdata, Form22A, Form35, requestAgentHelp, agentHelpNotes } = offerData;

    // Ensure ALL Form22A fields are present with defaults
    const processedForm22A = {
      TypeofLoan: Form22A?.TypeofLoan || '',
      DOWNPAYMENTTYPE: Form22A?.DOWNPAYMENTTYPE || 'PERCENTAGE',
      DOWNPAYMENTMAGNITUDE: Form22A?.DOWNPAYMENTMAGNITUDE || 0,
      MAKEAPPLICATIONFORLOANSDAYS: Form22A?.MAKEAPPLICATIONFORLOANSDAYS || 0,
      FINANCIALCONTINGENCY: Form22A?.FINANCIALCONTINGENCY || '',
      FINANCIALCONTINGENCYTIMEFRAME: Form22A?.FINANCIALCONTINGENCYTIMEFRAME || 0,
      APPRAISALCONTINGENCY: Form22A?.APPRAISALCONTINGENCY || 'NO',
      LOANCOSTPROVISIONS: Form22A?.LOANCOSTPROVISIONS || 'EMPTY',
      BUYERPAYESECROWFEEFORVALOAN: Form22A?.BUYERPAYESECROWFEEFORVALOAN || 'NO'
    };

    // Ensure ALL Form35 fields are present with defaults
    const processedForm35 = {
      SEWERSURVEY: Form35?.SEWERSURVEY || 'NO',
      BUYERSNOTICEDAYS: Form35?.BUYERSNOTICEDAYS || 0,
      SEWERREQUESTFORINSPECTIONREPORT: Form35?.SEWERREQUESTFORINSPECTIONREPORT || 'NO',
      ADDITIONALTIMEFORINSPECTION: Form35?.ADDITIONALTIMEFORINSPECTION || 0,
      SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS: Form35?.SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS || 0,
      BUYERSREPLYTOSELLERSRESPONSE: Form35?.BUYERSREPLYTOSELLERSRESPONSE || 0,
      REPAIRSCLOSINGDATE: Form35?.REPAIRSCLOSINGDATE || 0,
      NEIGHBORHOODREVIEWCONTINGENCYCHECK: Form35?.NEIGHBORHOODREVIEWCONTINGENCYCHECK || 'NO',
      NEIGHBORHOODREVIEWCONTINGENCYDAYS: Form35?.NEIGHBORHOODREVIEWCONTINGENCYDAYS || 0,
      BUYERWAVIEDRISKASSESSMENT: Form35?.BUYERWAVIEDRISKASSESSMENT || 'NO'
    };

    // Ensure ALL buyerdata fields are present with defaults
    const processedBuyerData = {
      PI_SellPrice: buyerdata?.PI_SellPrice || 0,
      PI_SellPriceW: buyerdata?.PI_SellPriceW || '',
      EM_PC1: buyerdata?.EM_PC1 || 0,
      Buyer1Name: buyerdata?.Buyer1Name || '',
      B_Email: buyerdata?.B_Email || '',
      Buyer2Name: buyerdata?.Buyer2Name || '',
      offer_price_num: buyerdata?.offer_price_num || 0,
      offer_price_words: buyerdata?.offer_price_words || '',
      earnest_amount_num: buyerdata?.earnest_amount_num || 0,
      earnest_amount_delivery_days: buyerdata?.earnest_amount_delivery_days || 0,
      earnest_money_holder: buyerdata?.earnest_money_holder || '',
      offer_expiration_days: buyerdata?.offer_expiration_days || 0,
      B_Status: buyerdata?.B_Status || '',
      ClosingDate: buyerdata?.ClosingDate || '',
      ServicesofUtils: buyerdata?.ServicesofUtils || '',
      ChargesAssessments: buyerdata?.ChargesAssessments || '',
      VerificationPeriod: buyerdata?.VerificationPeriod || '',
      addendums: buyerdata?.addendums || []
    };

    // Call external API
    const apiUrl = 'https://offerbot.ngrok.app/offer/';
    const apiUrl_1 = 'https://offerbot.ngrok.app/';
    const apiRequestBody = {
      MLS_ID,
      Form22A_FromBuyer: processedForm22A,
      Form35_FromBuyer: processedForm35,
      buyerdata: processedBuyerData
    };

    console.log('='.repeat(60));
    console.log('📤 SENDING REQUEST TO EXTERNAL API');
    console.log('='.repeat(60));
    console.log('URL:', apiUrl);
    console.log('Request Body:', JSON.stringify(apiRequestBody, null, 2));
    console.log('='.repeat(60));

    let apiResponse;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestBody),
      });

      if (!response.ok) {
        console.error('='.repeat(60));
        console.error('❌ EXTERNAL API ERROR');
        console.error('='.repeat(60));
        console.error('Status:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error Details:', errorText);
        console.error('='.repeat(60));

        // Return error to frontend
        return new Response(
          JSON.stringify({
            error: 'Failed to process offer',
            message: 'Our offer processing service is temporarily unavailable. Please try again in a moment.'
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        apiResponse = await response.json();

        // Prefix the pdf_url with the base API URL
        if (apiResponse.pdf_url && !apiResponse.pdf_url.startsWith('http')) {
          const cleanedPath = apiResponse.pdf_url.replace(/^[\\/]+/, '');
          apiResponse.pdf_url = `${apiUrl_1}${cleanedPath}`;
        }

        console.log('='.repeat(60));
        console.log('✅ EXTERNAL API SUCCESS');
        console.log('='.repeat(60));
        console.log('Response:', JSON.stringify(apiResponse, null, 2));
        console.log('='.repeat(60));
      }
    } catch (apiError) {
      console.error('='.repeat(60));
      console.error('⚠️  EXTERNAL API NETWORK ERROR');
      console.error('='.repeat(60));
      console.error('Error:', apiError.message);
      console.error('Stack:', apiError.stack);
      console.error('='.repeat(60));
      // Continue with email sending even if API fails
    }

    // Format the email content
    const emailContent = `
New Offer Submission - MLS ID: ${MLS_ID}

${apiResponse?.pdf_url ? `
═══════════════════════════════════════════
📄 OFFER DOCUMENT
═══════════════════════════════════════════
PDF Download: ${apiResponse.pdf_url}

` : ''}═══════════════════════════════════════════
BUYER INFORMATION
═══════════════════════════════════════════
Primary Buyer: ${buyerdata.Buyer1Name}
${buyerdata.Buyer2Name ? `Secondary Buyer: ${buyerdata.Buyer2Name}\n` : ''}Email: ${buyerdata.B_Email}
Buyer Status: ${buyerdata.B_Status}
Closing Date: ${buyerdata.ClosingDate}

═══════════════════════════════════════════
OFFER DETAILS
═══════════════════════════════════════════
Offer Price: $${buyerdata.offer_price_num?.toLocaleString()}
Offer Price (Words): ${buyerdata.offer_price_words}
Earnest Money: $${buyerdata.earnest_amount_num?.toLocaleString()}
Earnest Money %: ${((buyerdata.earnest_amount_num / buyerdata.offer_price_num) * 100).toFixed(2)}%
Earnest Money Delivery: ${buyerdata.earnest_amount_delivery_days} days
Earnest Money Holder: ${buyerdata.earnest_money_holder}
Offer Valid For: ${buyerdata.offer_expiration_days} days

═══════════════════════════════════════════
ADDITIONAL SETTINGS
═══════════════════════════════════════════
Charges & Assessments: ${buyerdata.ChargesAssessments}
Verification Period: ${buyerdata.VerificationPeriod}

${processedForm22A && Object.keys(processedForm22A).length > 0 ? `
═══════════════════════════════════════════
FORM 22A - FINANCING ADDENDUM
═══════════════════════════════════════════
Type of Loan: ${processedForm22A.TypeofLoan}
Down Payment: ${processedForm22A.DOWNPAYMENTMAGNITUDE}${processedForm22A.DOWNPAYMENTTYPE === 'PERCENTAGE' ? '%' : ' dollars'}
Days to Apply for Loan: ${processedForm22A.MAKEAPPLICATIONFORLOANSDAYS}
Financial Contingency: ${processedForm22A.FINANCIALCONTINGENCY}
Financial Contingency Timeframe: ${processedForm22A.FINANCIALCONTINGENCYTIMEFRAME} days
Appraisal Contingency: ${processedForm22A.APPRAISALCONTINGENCY}
${processedForm22A.TypeofLoan === 'VA' ? `Buyer Pays Escrow Fee for VA Loan: ${processedForm22A.BUYERPAYESECROWFEEFORVALOAN}\n` : ''}` : ''}

${Form35 ? `
═══════════════════════════════════════════
FORM 35 - INSPECTION ADDENDUM
═══════════════════════════════════════════
Sewer Survey: ${Form35.SEWERSURVEY}
${Form35.SEWERSURVEY === 'YES' ? `Buyer's Notice Period: ${Form35.BUYERSNOTICEDAYS} days
Request Seller's Report: ${Form35.SEWERREQUESTFORINSPECTIONREPORT}
` : ''}Additional Time for Inspection: ${Form35.ADDITIONALTIMEFORINSPECTION} days
Seller Response Time: ${Form35.SEWERRESPONSETIMETOREQUESTFORREPAIRSORMODIFICATIONS} days
Buyer's Reply Time: ${Form35.BUYERSREPLYTOSELLERSRESPONSE} days
Repairs Before Closing: ${Form35.REPAIRSCLOSINGDATE} days
Buyer Waived Risk Assessment: ${Form35.BUYERWAVIEDRISKASSESSMENT}
` : ''}

${requestAgentHelp ? `
═══════════════════════════════════════════
⚠️ AGENT ASSISTANCE REQUESTED
═══════════════════════════════════════════
${agentHelpNotes || 'No additional notes provided.'}
` : ''}

═══════════════════════════════════════════
Submitted: ${new Date().toLocaleString()}
═══════════════════════════════════════════
    `.trim();

    // Send email to Wayber team
    const wayberEmailOptions = {
      from: process.env.ZOHO_ACCOUNT_EMAIL,
      to: 'mohamed@wayber.net', // Update with actual Wayber email
      subject: `${requestAgentHelp ? '⚠️ [ASSISTANCE NEEDED] ' : ''}New Offer - MLS ${MLS_ID} - ${buyerdata.Buyer1Name}`,
      text: emailContent,
    };

    // Only add replyTo if buyer email is provided
    if (processedBuyerData.B_Email && processedBuyerData.B_Email.trim() !== '') {
      wayberEmailOptions.replyTo = processedBuyerData.B_Email;
    }

    await transporter.sendMail(wayberEmailOptions);

    // Send confirmation email to buyer (only if email is provided)
    if (processedBuyerData.B_Email && processedBuyerData.B_Email.trim() !== '') {
      const buyerEmailContent = `
Hi ${buyerdata.Buyer1Name},

Thank you for submitting your offer through Wayber!

We've received your offer for the property (MLS ID: ${MLS_ID}) and our team is reviewing it now.

${apiResponse?.pdf_url ? `
📄 YOUR OFFER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download your offer: ${apiResponse.pdf_url}

` : ''}OFFER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Offer Price: $${buyerdata.offer_price_num?.toLocaleString()}
Earnest Money: $${buyerdata.earnest_amount_num?.toLocaleString()} (${((buyerdata.earnest_amount_num / buyerdata.offer_price_num) * 100).toFixed(2)}%)
Earnest Money Due: ${buyerdata.earnest_amount_delivery_days} days after acceptance
Earnest Money Holder: ${buyerdata.earnest_money_holder}
Offer Valid For: ${buyerdata.offer_expiration_days} days
Desired Closing: ${buyerdata.ClosingDate}

WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. You'll receive your offer documents for e-signature within a few hours
2. Once signed, we'll submit your offer to the seller's agent
3. The seller typically responds within 24-48 hours
4. We'll keep you updated throughout the entire process

${requestAgentHelp ? `
An agent will reach out to you shortly regarding your request for assistance.
` : ''}

Best regards,
The Wayber Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Questions? Reply to this email or call us at (206) 880-0760.
Visit us at https://wayber.com
      `.trim();

      await transporter.sendMail({
        from: process.env.ZOHO_ACCOUNT_EMAIL,
        to: processedBuyerData.B_Email,
        subject: `Offer Received - MLS ${MLS_ID}`,
        text: buyerEmailContent,
      });
    } else {
      console.log('⚠️  Skipping buyer confirmation email - no email address provided');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Offer submitted successfully',
        mlsId: MLS_ID,
        apiResponse: apiResponse || null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error submitting offer:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit offer' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
