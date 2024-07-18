import React from 'react'

import i18n from 'i18next';

const translateLabel = (labelKey:string) => {
  return i18n.t(labelKey);
}


export default translateLabel;