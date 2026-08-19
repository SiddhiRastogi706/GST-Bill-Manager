"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { sendInvoiceEmail } from "@/lib/email-utils"

interface EmailInvoiceButtonProps {
  invoiceId: string
  clientEmail: string
  invoiceNumber: string
  invoiceData: any
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function EmailInvoiceButton({
  invoiceId,
  clientEmail,
  invoiceNumber,
  invoiceData,
  onSuccess,
  onError,
}: EmailInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSendEmail = async () => {
    if (!clientEmail) {
      onError?.("Client email is not available")
      return
    }

    setIsLoading(true)
    try {
      const sent = await sendInvoiceEmail(clientEmail, invoiceData)

      if (sent) {
        onSuccess?.()
      } else {
        onError?.("Failed to send email. Please try again.")
      }
    } catch (error) {
      onError?.("Error sending email")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleSendEmail}
      disabled={isLoading || !clientEmail}
      title={!clientEmail ? "Client email not available" : "Send invoice via email"}
    >
      <Mail className="w-4 h-4" />
      {isLoading ? "Sending..." : "Email"}
    </Button>
  )
}
