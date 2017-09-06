import { Event } from '.'

let event

beforeEach(async () => {
  event = await Event.create({ name: 'test', descriptionShort: 'test', descriptionLong: 'test', pledgedAmount: 'test', images: 'test', time: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = event.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(event.id)
    expect(view.name).toBe(event.name)
    expect(view.descriptionShort).toBe(event.descriptionShort)
    expect(view.descriptionLong).toBe(event.descriptionLong)
    expect(view.pledgedAmount).toBe(event.pledgedAmount)
    expect(view.images).toBe(event.images)
    expect(view.time).toBe(event.time)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = event.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(event.id)
    expect(view.name).toBe(event.name)
    expect(view.descriptionShort).toBe(event.descriptionShort)
    expect(view.descriptionLong).toBe(event.descriptionLong)
    expect(view.pledgedAmount).toBe(event.pledgedAmount)
    expect(view.images).toBe(event.images)
    expect(view.time).toBe(event.time)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
