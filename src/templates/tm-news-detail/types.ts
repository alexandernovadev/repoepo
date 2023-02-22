import { Sites } from '../../types'
import { ContentfulTemplateNewsDetail } from '../../types/contentful/content-model/tm-news-detail'

export interface TmNewsDetailProps extends Sites {
  template: ContentfulTemplateNewsDetail
}
