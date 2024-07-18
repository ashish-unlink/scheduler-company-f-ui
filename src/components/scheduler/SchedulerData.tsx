import React from 'react'
import { constantString } from '../../utils/constantString'
import { useTranslation } from 'react-i18next';
export const SchedulerData = () => {
  const { t } = useTranslation();
  return (
    <div>{t(constantString.SCHEDULER_DATA)}</div>
  )
}
