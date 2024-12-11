"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenResponse = exports.AuthFailureResponse = exports.InternalErrorResponse = exports.NotFoundResponse = exports.ForbiddenResponse = exports.BadRequestResponse = exports.SuccessResponse = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
const send = (response, status, body) => {
    return response.status(status).json(body);
};
const SuccessResponse = (message, response, data = null) => {
    return send(response, StatusCode.SUCCESS, {
        status: StatusCode.SUCCESS,
        message,
        data
    });
};
exports.SuccessResponse = SuccessResponse;
const BadRequestResponse = (message, response) => {
    return send(response, StatusCode.BAD_REQUEST, {
        status: StatusCode.BAD_REQUEST,
        message
    });
};
exports.BadRequestResponse = BadRequestResponse;
const ForbiddenResponse = (message, response) => {
    return send(response, StatusCode.FORBIDDEN, {
        status: StatusCode.FORBIDDEN,
        message
    });
};
exports.ForbiddenResponse = ForbiddenResponse;
const NotFoundResponse = (message, response) => {
    return send(response, StatusCode.NOT_FOUND, {
        status: StatusCode.NOT_FOUND,
        message
    });
};
exports.NotFoundResponse = NotFoundResponse;
const InternalErrorResponse = (message, response) => {
    return send(response, StatusCode.INTERNAL_ERROR, {
        status: StatusCode.INTERNAL_ERROR,
        message
    });
};
exports.InternalErrorResponse = InternalErrorResponse;
const AuthFailureResponse = (message, response) => {
    return send(response, StatusCode.UNAUTHORIZED, {
        status: StatusCode.UNAUTHORIZED,
        message
    });
};
exports.AuthFailureResponse = AuthFailureResponse;
const RefreshTokenResponse = (message, response, accessToken, refreshToken) => {
    return send(response, StatusCode.SUCCESS, {
        status: StatusCode.SUCCESS,
        message,
        accessToken,
        refreshToken
    });
};
exports.RefreshTokenResponse = RefreshTokenResponse;
//# sourceMappingURL=responses.js.map