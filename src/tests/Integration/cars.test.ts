import request from 'supertest';
import { app } from '../../app';
import { connectDB, disconnectDB } from '../../config/database';
import { CarModel } from '../../models/cars';

const validCar = {
  make: 'Toyota',
  model: 'Corolla',
  year: 2022,
};

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await CarModel.deleteMany({});
});

afterAll(async () => {
  await CarModel.deleteMany({});
  await disconnectDB();
});

describe('Cars API', () => {
  it('GET /api/v1/cars returns an empty array when there are no cars', async () => {
    const response = await request(app).get('/api/v1/cars');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /api/v1/cars creates a new car', async () => {
    const response = await request(app)
      .post('/api/v1/cars')
      .send(validCar);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(validCar);
    expect(response.body).toHaveProperty('_id');
  });

  it('POST /api/v1/cars rejects invalid payloads', async () => {
    const response = await request(app)
      .post('/api/v1/cars')
      .send({ make: '', model: 'Focus', year: 1949 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(expect.any(Array));
  });

  it('GET /api/v1/cars/:id returns a single car', async () => {
    const createdCar = await CarModel.create(validCar);

    const response = await request(app).get(`/api/v1/cars/${createdCar._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(validCar);
  });

  it('GET /api/v1/cars/:id returns 404 when the car is missing', async () => {
    const missingId = '507f1f77bcf86cd799439011';

    const response = await request(app).get(`/api/v1/cars/${missingId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Car not found' });
  });

  it('PUT /api/v1/cars/:id updates an existing car', async () => {
    const createdCar = await CarModel.create(validCar);

    const response = await request(app)
      .put(`/api/v1/cars/${createdCar._id}`)
      .send({ make: 'Honda', model: 'Civic', year: 2021 });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      make: 'Honda',
      model: 'Civic',
      year: 2021,
    });
  });

  it('PUT /api/v1/cars/:id rejects invalid update payloads', async () => {
    const createdCar = await CarModel.create(validCar);

    const response = await request(app)
      .put(`/api/v1/cars/${createdCar._id}`)
      .send({ year: 1949 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });

  it('DELETE /api/v1/cars/:id deletes an existing car', async () => {
    const createdCar = await CarModel.create(validCar);

    const response = await request(app).delete(`/api/v1/cars/${createdCar._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(validCar);

    const remainingCar = await CarModel.findById(createdCar._id);
    expect(remainingCar).toBeNull();
  });

  it('DELETE /api/v1/cars/:id returns 404 when the car is missing', async () => {
    const missingId = '507f1f77bcf86cd799439011';

    const response = await request(app).delete(`/api/v1/cars/${missingId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Car not found' });
  });
});
