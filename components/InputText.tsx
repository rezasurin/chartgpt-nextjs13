"use client"

import { useState } from "react"

export default function InputText(props) {
  const [inputValue, setInputValue] = useState("")
  

  return (
    <input type="text" onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
  )
}