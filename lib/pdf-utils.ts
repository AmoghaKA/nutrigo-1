import jsPDF from "jspdf"
import html2canvas from "html2canvas"

/**
 * Generates and downloads a PDF report from a DOM element
 */
export async function generatePDFReport(
  elementRef: HTMLDivElement | null,
  fileName: string = "Report"
): Promise<void> {
  if (!elementRef) {
    throw new Error("Element reference not found")
  }

  try {
    // Create canvas from the element
    const canvas = await html2canvas(elementRef, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0f172a",
      logging: false,
      allowTaint: true,
    })

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate image dimensions
    const imgWidth = pdfWidth - 10 // 5mm margins on sides
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let position = 5 // 5mm top margin
    
    // Add first page
    let pageHeight = imgHeight
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 5, position, imgWidth, imgHeight)

    // Add additional pages if needed
    while (pageHeight > pdfHeight - 10) {
      position = pageHeight - pdfHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 5, position - pdfHeight, imgWidth, imgHeight)
      pageHeight -= pdfHeight - 10
    }

    // Save the PDF
    pdf.save(`${fileName}_${new Date().toLocaleDateString()}.pdf`)
    
    console.log("✅ PDF generated successfully!")
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF report")
  }
}
