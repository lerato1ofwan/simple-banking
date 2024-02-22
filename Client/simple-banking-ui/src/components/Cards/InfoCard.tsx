import React, { ReactNode } from 'react'
import { CardBody } from '@windmill/react-ui'

interface InfoCard{
    title: string,
    value: string,
    children: React.ReactNode
}

function InfoCard({ title, value, children: icon } : InfoCard) {
  return (
    <>
      <CardBody className="flex items-center p-4 bg-gray-800 rounded-lg">
        {icon}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p>
        </div>
      </CardBody>
    </>
  )
}

export default InfoCard