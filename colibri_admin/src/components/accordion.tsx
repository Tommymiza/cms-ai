'use client'
import { useState } from 'react'

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-gray-100 p-8">
      <div className="mx-auto max-w-md">
        {/* Accordion container */}
        <div className="accordion">
          {/* Item 1 */}
          <div className="border-b border-gray-300">
            <button
              className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-800 hover:bg-gray-200"
              onClick={() => toggleAccordion(0)}
            >
              <span>Section 1</span>
              <span className={`transform transition-transform ${openIndex === 0 ? 'rotate-180' : ''}`}>+</span>
            </button>
            {openIndex === 0 && <div className="bg-gray-50 p-4 text-gray-700">Contenu de la section 1.</div>}
          </div>

          {/* Item 2 */}
          <div className="border-b border-gray-300">
            <button
              className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-800 hover:bg-gray-200"
              onClick={() => toggleAccordion(1)}
            >
              <span>Section 2</span>
              <span className={`transform transition-transform ${openIndex === 1 ? 'rotate-180' : ''}`}>+</span>
            </button>
            {openIndex === 1 && <div className="bg-gray-50 p-4 text-gray-700">Contenu de la section 2.</div>}
          </div>

          {/* Item 3 */}
          <div className="border-b border-gray-300">
            <button
              className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-800 hover:bg-gray-200"
              onClick={() => toggleAccordion(2)}
            >
              <span>Section 3</span>
              <span className={`transform transition-transform ${openIndex === 2 ? 'rotate-180' : ''}`}>+</span>
            </button>
            {openIndex === 2 && <div className="bg-gray-50 p-4 text-gray-700">Contenu de la section 3.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accordion
