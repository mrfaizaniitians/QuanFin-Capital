// ===============================================
// 📄 QuanFin Capital | PDF Generator for Partner Form
// Single-page PDF, header address, diagonal watermark, T&C included
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
  const PDF_CONFIG = {
    BRAND_INFO: { name: "QuanFin Capital", motto: "Data Turns Into Capital" },
    COLORS: {
      brandPrimary: '#002D62',
      textPrimary: '#111111',
      textSecondary: '#555555',
      textSubtle: '#888888',
      lineColor: '#CCCCCC'
    },
    FONTS: {
      HEADING: { family: 'helvetica', weight: 'bold', size: 20 },
      SUBHEADING: { family: 'helvetica', weight: 'bold', size: 16 },
      LABEL: { family: 'helvetica', weight: 'bold', size: 10 },
      BODY: { family: 'helvetica', weight: 'normal', size: 10 },
      FOOTER: { family: 'helvetica', weight: 'normal', size: 8 }
    },
    MARGINS: { TOP: 40, BOTTOM: 40, LEFT: 40, RIGHT: 40 },
    get CONTENT_WIDTH() { return 595 - this.MARGINS.LEFT - this.MARGINS.RIGHT; }
  };

  const form = document.querySelector(".partner-form form");
  if (!form) return;
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Generating...";
    submitButton.disabled = true;

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');

      // Load logo
      const imagePath = 'WhatsApp Image 2025-09-30 at 2.30.18 PM (1).jpeg';
      const loadImageAsBase64 = async (url) => {
        const blob = await fetch(url).then(r => r.blob());
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      const logoBase64 = await loadImageAsBase64(imagePath);

      // Header
      const addHeader = (doc, logo) => {
        const rightEdge = doc.internal.pageSize.getWidth() - PDF_CONFIG.MARGINS.RIGHT;
        doc.addImage(logo, 'PNG', PDF_CONFIG.MARGINS.LEFT, PDF_CONFIG.MARGINS.TOP, 150, 25);

        doc.setFontSize(PDF_CONFIG.FONTS.FOOTER.size);
        doc.setFont(PDF_CONFIG.FONTS.FOOTER.family, PDF_CONFIG.FONTS.FOOTER.weight);
        doc.setTextColor(PDF_CONFIG.COLORS.textSecondary);
        doc.text("Partnership Inquiry | Strictly Confidential", rightEdge, PDF_CONFIG.MARGINS.TOP + 5, { align: 'right' });

        // Address below header
        doc.text("Business Tower, Dohra Road, 243006", rightEdge, PDF_CONFIG.MARGINS.TOP + 25, { align: 'right' });

        doc.setDrawColor(PDF_CONFIG.COLORS.brandPrimary);
        doc.setLineWidth(1);
        doc.line(PDF_CONFIG.MARGINS.LEFT, PDF_CONFIG.MARGINS.TOP + 50, rightEdge, PDF_CONFIG.MARGINS.TOP + 50);
      };

      // Footer
      const addFooter = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        const rightEdge = doc.internal.pageSize.getWidth() - PDF_CONFIG.MARGINS.RIGHT;
        const bottom = doc.internal.pageSize.getHeight() - PDF_CONFIG.MARGINS.BOTTOM;

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(PDF_CONFIG.FONTS.FOOTER.size);
          doc.setFont(PDF_CONFIG.FONTS.FOOTER.family, PDF_CONFIG.FONTS.FOOTER.weight);
          doc.setTextColor(PDF_CONFIG.COLORS.textSubtle);
          doc.text(`Page ${i} of ${pageCount}`, rightEdge, bottom, { align: 'right' });
          doc.text(`${PDF_CONFIG.BRAND_INFO.name} | ${PDF_CONFIG.BRAND_INFO.motto}`, doc.internal.pageSize.getWidth() / 2, bottom, { align: 'center' });
        }
      };

      // Watermark
      const addWatermark = (doc) => {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.08 }));
        doc.setFontSize(50);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(PDF_CONFIG.COLORS.brandPrimary);
        doc.text('CONFIDENTIAL', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center', angle: 45 });
        doc.restoreGraphicsState();
      };

      // Assemble content
      addHeader(doc, logoBase64);
      addWatermark(doc);

      let y = 130;
      doc.setFont(PDF_CONFIG.FONTS.HEADING.family, PDF_CONFIG.FONTS.HEADING.weight);
      doc.setFontSize(PDF_CONFIG.FONTS.HEADING.size);
      doc.setTextColor(PDF_CONFIG.COLORS.brandPrimary);
      doc.text("Partnership Inquiry Summary", PDF_CONFIG.MARGINS.LEFT, y);
      y += 50;

      const drawRow = (label, value) => {
        doc.setFont(PDF_CONFIG.FONTS.LABEL.family, PDF_CONFIG.FONTS.LABEL.weight);
        doc.setFontSize(PDF_CONFIG.FONTS.LABEL.size);
        doc.setTextColor(PDF_CONFIG.COLORS.textPrimary);
        doc.text(label.toUpperCase(), PDF_CONFIG.MARGINS.LEFT, y);

        doc.setFont(PDF_CONFIG.FONTS.BODY.family, PDF_CONFIG.FONTS.BODY.weight);
        doc.setTextColor(PDF_CONFIG.COLORS.textSecondary);
        doc.text(value, PDF_CONFIG.MARGINS.LEFT + 140, y);
        y += 30;
      };

      drawRow("Applicant Name:", document.getElementById("name").value);
      drawRow("Contact Email:", document.getElementById("email").value);
      drawRow("Business Type:", document.getElementById("business").value);

      y += 10;
      doc.setFont(PDF_CONFIG.FONTS.LABEL.family, PDF_CONFIG.FONTS.LABEL.weight);
      doc.text("PROPOSAL / MESSAGE:", PDF_CONFIG.MARGINS.LEFT, y);
      y += 20;

      const message = document.getElementById("message").value;
      const wrapped = doc.splitTextToSize(message, PDF_CONFIG.CONTENT_WIDTH);
      doc.setFont(PDF_CONFIG.FONTS.BODY.family, PDF_CONFIG.FONTS.BODY.weight);
      doc.text(wrapped, PDF_CONFIG.MARGINS.LEFT, y);

      // Terms & Conditions (Proprietary Trading Firm)
      y += wrapped.length * 12 + 20; // add space after message
      doc.setFont(PDF_CONFIG.FONTS.SUBHEADING.family, PDF_CONFIG.FONTS.SUBHEADING.weight);
      doc.setFontSize(PDF_CONFIG.FONTS.SUBHEADING.size);
      doc.setTextColor(PDF_CONFIG.COLORS.brandPrimary);
      doc.text("Terms & Conditions", PDF_CONFIG.MARGINS.LEFT, y);
      y += 20;

      doc.setFont(PDF_CONFIG.FONTS.BODY.family, PDF_CONFIG.FONTS.BODY.weight);
      doc.setFontSize(PDF_CONFIG.FONTS.BODY.size);
      doc.setTextColor(PDF_CONFIG.COLORS.textSecondary);

      const terms = `
1. This inquiry does not guarantee a partnership with ${PDF_CONFIG.BRAND_INFO.name}.
2. All personal and business information shared is confidential and used for evaluation purposes only.
3. Participation in proprietary trading is subject to compliance, risk disclosure, and acceptance by ${PDF_CONFIG.BRAND_INFO.name}.
4. Submission of false or misleading information may lead to rejection of the inquiry.
5. All trading decisions are solely the responsibility of the applicant; ${PDF_CONFIG.BRAND_INFO.name} is not liable for losses.
6. Communication through this inquiry is non-binding until a formal agreement is signed.
      `;

      const termLines = doc.splitTextToSize(terms.trim(), PDF_CONFIG.CONTENT_WIDTH);
      doc.text(termLines, PDF_CONFIG.MARGINS.LEFT, y);

      // Signature area
      y = doc.internal.pageSize.getHeight() - 150;
      doc.setDrawColor(PDF_CONFIG.COLORS.textSecondary);
      doc.setLineWidth(0.5);
      const rightEdge = doc.internal.pageSize.getWidth() - PDF_CONFIG.MARGINS.RIGHT;
      doc.line(PDF_CONFIG.MARGINS.LEFT, y, PDF_CONFIG.MARGINS.LEFT + 200, y);
      doc.line(rightEdge - 200, y, rightEdge, y);
      doc.setFontSize(PDF_CONFIG.FONTS.FOOTER.size + 1);
      doc.setTextColor(PDF_CONFIG.COLORS.textSubtle);
      doc.text("Applicant Signature", PDF_CONFIG.MARGINS.LEFT, y + 15);
      doc.text("Date", rightEdge - 200, y + 15);

      addFooter(doc);

      const applicantName = document.getElementById("name").value || "Applicant";
      doc.save(`${applicantName.replace(/\s+/g, '_')}_Partnership_Inquiry.pdf`);

    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      submitButton.textContent = "Generation Failed!";
      submitButton.style.backgroundColor = 'red';
    } finally {
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '';
      }, 2000);
    }
  });
});
