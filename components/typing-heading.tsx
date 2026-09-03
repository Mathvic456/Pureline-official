"use client"

import { useEffect, useState } from "react"

interface TypingHeadingProps {
  text: string
  className?: string
}

export function TypingHeading({ text, className = "" }: TypingHeadingProps) {
  const [visibleText, setVisibleText] = useState("")

  useEffect(() => {
    let characterIndex = 0
    let isDeleting = false
    let typingTimer: number

    const animateText = () => {
      if (isDeleting) {
        characterIndex -= 1
      } else {
        characterIndex += 1
      }

      setVisibleText(text.slice(0, characterIndex))

      if (!isDeleting && characterIndex === text.length) {
        isDeleting = true
        typingTimer = window.setTimeout(animateText, 2000)
        return
      }

      if (isDeleting && characterIndex === 0) {
        isDeleting = false
        typingTimer = window.setTimeout(animateText, 700)
        return
      }

      typingTimer = window.setTimeout(animateText, isDeleting ? 75 : 110)
    }

    typingTimer = window.setTimeout(animateText, 500)

    return () => window.clearTimeout(typingTimer)
  }, [text])

  return (
    <h1 className={className} aria-label={text}>
      {visibleText}
      <span aria-hidden="true" className="ml-1 inline-block w-[0.06em] align-baseline bg-current animate-pulse">&nbsp;</span>
    </h1>
  )
}