import { httpStatusCode } from "../utils/httpStatusCode.js";

const { StatusCode, ReasonPhrases } = httpStatusCode;

class SuccessResponse {
  constructor({ message = "", statusCode = StatusCode.OK, metadata = {} }) {
    this.message = !message ? ReasonPhrases.OK : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Created extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, statusCode: StatusCode.CREATED, metadata });
  }
}

export { SuccessResponse, Created };
