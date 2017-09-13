import { Reaction } from '.'
import { User } from '../user'

let user, reaction

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  reaction = await Reaction.create({ userId: user, feedId: 'test', likes: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = reaction.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(reaction.id)
    expect(typeof view.userId).toBe('object')
    expect(view.userId.id).toBe(user.id)
    expect(view.feedId).toBe(reaction.feedId)
    expect(view.likes).toBe(reaction.likes)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = reaction.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(reaction.id)
    expect(typeof view.userId).toBe('object')
    expect(view.userId.id).toBe(user.id)
    expect(view.feedId).toBe(reaction.feedId)
    expect(view.likes).toBe(reaction.likes)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
