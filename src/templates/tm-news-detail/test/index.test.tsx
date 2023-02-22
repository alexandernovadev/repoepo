import { render, screen } from '@testing-library/react'
import { TmNewsDetail } from '..'
import { site, template } from './mock'
import '@testing-library/jest-dom'

describe('News Detail Page', () => {
  it('renders page', () => {
    render(<TmNewsDetail site={site} template={template} />)
    const title = screen.getByText(template.article.title)
    expect(title).toBeInTheDocument()
  })
})
