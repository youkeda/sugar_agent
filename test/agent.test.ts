import request from "supertest";
// import { Agent, AgentStatus } from "../src/models/Agent";
// import { expect,assert } from "chai";
import app from "../src/app";

describe("Post /agent/register", () => {
  it("should return success", async () => {
    return request(app)
      .post("/agent/register")
      .send({
        // ip: "192.168.1.2",
        hostname: "joe",
        mac: "123",
        status: AgentStatus.waiting
      })
      .expect(200).then(response => {
          expect(response.body.success).toEqual(true);
      });
  });
});
