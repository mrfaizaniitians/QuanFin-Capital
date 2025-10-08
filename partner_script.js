// Select the form
const form = document.querySelector(".partner-form form");

// ASYNC EVENT LISTENER: 'async' keyword allows us to use 'await' inside
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  // Show a loading message to the user (optional but good UX)
  alert("Generating your PDF, please wait...");

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    // ===================================================================
    // 1. DYNAMICALLY LOAD THE LOGO IMAGE
    // ===================================================================
    const imagePath = '/images/logo.png'; // Make sure this path is correct!
    
    // This helper function fetches the image and returns its Base64 data
    const loadImageAsBase64 = (url) => {
      return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }));
    };

    // We 'await' here, the code will pause until the image is fully loaded
    const logoBase64 = await loadImageAsBase64(imagePath);

    // ===================================================================
    // 2. HELPER FUNCTIONS (Now they use the dynamically loaded logo)
    // ===================================================================
    const addHeader = (doc, logoData) => {
      doc.addImage(logoData, 'PNG', 40, 30, 150, 25);
      // ... rest of the header code is the same
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150);
      doc.text("Partnership Inquiry | Strictly Confidential", 555, 45, null, "right");
      doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 555, 60, null, "right");
      doc.setDrawColor(0, 45, 98);
      doc.setLineWidth(1);
      doc.line(40, 80, 555, 80);
    };

    // All other functions (addFooter, addWatermark, addTermsAndConditionsPage)
    // remain exactly the same as before. I am omitting them here for brevity,
    // but you should keep them in your code.
    // ... (Paste your addFooter, addWatermark, addTermsAndConditionsPage functions here) ...
    // Note: I'm including them below for a complete copy-paste solution.

    const addFooter = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(120);
          doc.text(`Page ${i} of ${pageCount}`, 555, 810, null, "right");
          doc.text("QuanFin Capital | Data Turns Into Capital", doc.internal.pageSize.getWidth() / 2, 810, { align: 'center' });
      }
    };
  
    const addWatermark = (doc) => {
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.saveGraphicsState();
          doc.setGState(new doc.GState({opacity: 0.08}));
          doc.setFontSize(90);
          doc.setTextColor(0, 45, 98);
          doc.text('CONFIDENTIAL', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center', angle: 45 });
          doc.restoreGraphicsState();
      }
    };
  
    const addTermsAndConditionsPage = (doc) => {
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 45, 98);
      doc.text("Terms & Conditions of Inquiry", 40, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80);
      const termsText = ["1. No Guarantee of Partnership: ...", "2. Confidentiality: ...", "3. Accuracy of Information: ...", "4. Non-Binding: ...", "5. Data Usage: ...", "6. No Financial Advice: ...", "7. Right to Refuse: ..."];
      let yPosition = 100;
      termsText.forEach(term => {
          const lines = doc.splitTextToSize(term, 515);
          doc.text(lines, 40, yPosition);
          yPosition += (lines.length * 12) + 10;
      });
    };


    // ===================================================================
    // 3. PDF CONTENT ASSEMBLY
    // ===================================================================
    addHeader(doc, logoBase64); // Pass the loaded logo data to the header function

    // ... (The rest of your PDF content generation code is exactly the same)
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const business = document.getElementById("business").value;
    const message = document.getElementById("message").value;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 45, 98);
    doc.text("Partnership Inquiry Summary", 40, 120);
    let y = 160;
    const drawRow = (label, value) => { doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(30); doc.text(label, 40, y); doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(80); doc.text(value, 180, y); y += 25; };
    drawRow("APPLICANT NAME:", name);
    drawRow("CONTACT EMAIL:", email);
    drawRow("BUSINESS TYPE:", business);
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(30); doc.text("PROPOSAL / MESSAGE:", 40, y); y += 20;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(80); const messageLines = doc.splitTextToSize(message, 515); doc.text(messageLines, 40, y);
    y = 700; doc.setDrawColor(80); doc.setLineWidth(0.5); doc.line(40, y, 240, y); doc.line(355, y, 555, y); doc.setFontSize(9); doc.setTextColor(100); doc.text("Applicant Signature", 40, y + 15); doc.text("Date", 355, y + 15);

    addTermsAndConditionsPage(doc);
    addWatermark(doc);
    addFooter(doc);

    // ===================================================================
    // 4. SAVE THE PDF
    // ===================================================================
    doc.save(`${name.replace(/\s+/g, '_')}_Partnership_Inquiry.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Sorry, there was an error creating the PDF. Please check the console for details.");
  }
});