import { useState } from 'react'
import { toast } from 'sonner'

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.success('Copied to clipboard!', {
        duration: 2000,
        position: 'top-right'
      })
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy text', {
        duration: 2000,
        position: 'top-right'
      })
      setIsCopied(false)
    }
  }

  return { isCopied, copyToClipboard }
}
