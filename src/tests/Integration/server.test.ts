import request from "supertest";
import { app } from "../../app";

describe("GET /ping", () => {
    it("should return hello from Roman", async () => {
        const response = await request(app)
            .get("/ping");

        expect(response.status).toBe(200);

        expect(response.body).toEqual("hello from Roman");
    });
});
