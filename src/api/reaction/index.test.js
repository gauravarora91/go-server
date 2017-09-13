import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Reaction } from '.'

const app = () => express(routes)

let userSession, anotherSession, reaction

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  reaction = await Reaction.create({ userId: user })
})

test('POST /reactions 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, feedId: 'test', likes: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.feedId).toEqual('test')
  expect(body.likes).toEqual('test')
  expect(typeof body.userId).toEqual('object')
})

test('POST /reactions 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /reactions 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /reactions/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${reaction.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(reaction.id)
})

test('GET /reactions/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /reactions/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${reaction.id}`)
    .send({ access_token: userSession, feedId: 'test', likes: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(reaction.id)
  expect(body.feedId).toEqual('test')
  expect(body.likes).toEqual('test')
  expect(typeof body.userId).toEqual('object')
})

test('PUT /reactions/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${reaction.id}`)
    .send({ access_token: anotherSession, feedId: 'test', likes: 'test' })
  expect(status).toBe(401)
})

test('PUT /reactions/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${reaction.id}`)
  expect(status).toBe(401)
})

test('PUT /reactions/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, feedId: 'test', likes: 'test' })
  expect(status).toBe(404)
})

test('DELETE /reactions/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${reaction.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /reactions/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${reaction.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /reactions/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${reaction.id}`)
  expect(status).toBe(401)
})

test('DELETE /reactions/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
