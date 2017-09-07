import { Comments } from '.'
import { User } from '../user'

let user, comments

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  comments = await Comments.create({ user, feed: 'test', comment: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = comments.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comments.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.feed).toBe(comments.feed)
    expect(view.comment).toBe(comments.comment)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = comments.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comments.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.feed).toBe(comments.feed)
    expect(view.comment).toBe(comments.comment)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
