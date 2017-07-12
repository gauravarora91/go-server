import { Feed } from '.'
import { User } from '../user'

let user, feed

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  feed = await Feed.create({ user, type: 'test', url: 'test', category: 'test', text: 'test', image: 'test', slug: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = feed.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(feed.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.type).toBe(feed.type)
    expect(view.url).toBe(feed.url)
    expect(view.category).toBe(feed.category)
    expect(view.text).toBe(feed.text)
    expect(view.image).toBe(feed.image)
    expect(view.slug).toBe(feed.slug)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = feed.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(feed.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.type).toBe(feed.type)
    expect(view.url).toBe(feed.url)
    expect(view.category).toBe(feed.category)
    expect(view.text).toBe(feed.text)
    expect(view.image).toBe(feed.image)
    expect(view.slug).toBe(feed.slug)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
