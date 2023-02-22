import { GlobalInformation } from '../types'
import { commonState } from '../redux/features/commonSlice'

export const formatPlaceholders = (
  common: GlobalInformation
): Pick<commonState, 'carPlaceholderImg' | 'oldCarPlaceholderImage'> => ({
  carPlaceholderImg: {
    url: common.carPlaceholderImage?.file.url ?? '',
    alt: common.carPlaceholderImage?.title ?? ''
  },
  oldCarPlaceholderImage: {
    url: common.oldCarPlaceholderImage?.file.url ?? '',
    alt: common.oldCarPlaceholderImage?.title ?? ''
  }
})
