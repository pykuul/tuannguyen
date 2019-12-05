const mongoose = require("mongoose");
const logger = require("../logs");
const _ = require("lodash");

const { Schema } = mongoose;
const emailTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

function insertTemplates() {
  const templates = [
    {
      name: "welcome",
      subject: "Welcome to richardnguyen.com",
      message: ` <%= userName %>,
        <p>
          Thanks for signing up for Builder Book on richardnguyen.com
        </p>
        <p>
          In our books, we teach you how to build complete, production - ready web apps from scratch
        </p>
        
        Tuan Nguyen, Team Builder Book
      `
    }
  ];

  templates.forEach(async template => {
    if (
      (await EmailTemplate.find({ name: template.name }).countDocuments()) > 0
    ) {
      return;
    }

    EmailTemplate.create(template).catch(err => {
      logger.error("Email Template insertion error: ", err);
    });
  });
}

async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error(
      `No Email Template found. 
        Please check that at least one is generated at server startup, 
        restart your server and try again.`
    );
  }

  return {
    message: _.template(source.message)(params),
    subject: _.template(source.subject)(params)
  };
}

exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
