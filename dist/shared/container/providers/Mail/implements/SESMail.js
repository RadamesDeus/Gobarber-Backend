"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _IMailTemplate = _interopRequireDefault(require("../../MailTemplate/models/IMailTemplate"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SESMail = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('MailTemplate')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _IMailTemplate.default === "undefined" ? Object : _IMailTemplate.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class SESMail {
  // private client: Transporter;
  constructor(mailTemplate) {
    this.mailTemplate = mailTemplate;
  }

  async SendEmail({
    to,
    subject,
    templateData,
    from
  }) {
    console.log('Message SES');
  }

}) || _class) || _class) || _class) || _class);
exports.default = SESMail;