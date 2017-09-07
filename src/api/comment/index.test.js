import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Comments } from '.'

const app = () => express(routes)

let userSession, anotherSession, comments

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  comments = await Comments.create({ user })
})

test('POST /comment 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, feed: 'test', comment: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.feed).toEqual('test')
  expect(body.comment).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /comment 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /comment 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /comment 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /comment/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${comments.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comments.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /comment/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${comments.id}`)
  expect(status).toBe(401)
})

test('GET /comment/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /comment/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${comments.id}`)
    .send({ access_token: userSession, feed: 'test', comment: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comments.id)
  expect(body.feed).toEqual('test')
  expect(body.comment).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /comment/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${comments.id}`)
    .send({ access_token: anotherSession, feed: 'test', comment: 'test' })
  expect(status).toBe(401)
})

test('PUT /comment/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${comments.id}`)
  expect(status).toBe(401)
})

test('PUT /comment/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, feed: 'test', comment: 'test' })
  expect(status).toBe(404)
})

test('DELETE /comment/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${comments.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /comment/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${comments.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /comment/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${comments.id}`)
  expect(status).toBe(401)
})

test('DELETE /comment/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
