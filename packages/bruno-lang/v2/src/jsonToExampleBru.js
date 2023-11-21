const _ = require('lodash');

const { indentString } = require('../../v1/src/utils');

const enabled = (items = []) => items.filter((item) => item.enabled);
const disabled = (items = []) => items.filter((item) => !item.enabled);

// remove the last line if two new lines are found
const stripLastLine = (text) => {
  if (!text || !text.length) return text;

  return text.replace(/(\r?\n)$/, '');
};

const jsonToExampleBru = (json) => {
  const { meta, http, query, headers, auth, body, responseBody, statusCode } = json;

  let bru = '';

  if (meta) {
    bru += 'meta {\n';
    for (const key in meta) {
      bru += `  ${key}: ${meta[key]}\n`;
    }
    bru += '}\n\n';
  }

  if (http && http.method) {
    bru += `${http.method} {
  url: ${http.url}`;

    if (http.body && http.body.length) {
      bru += `
  body: ${http.body}`;
    }

    if (http.auth && http.auth.length) {
      bru += `
  auth: ${http.auth}`;
    }

    bru += `
}

`;
  }

  if (query && query.length) {
    bru += 'query {';
    if (enabled(query).length) {
      bru += `\n${indentString(
        enabled(query)
          .map((item) => `${item.name}: ${item.value}`)
          .join('\n')
      )}`;
    }

    if (disabled(query).length) {
      bru += `\n${indentString(
        disabled(query)
          .map((item) => `~${item.name}: ${item.value}`)
          .join('\n')
      )}`;
    }

    bru += '\n}\n\n';
  }

  if (headers && headers.length) {
    bru += 'headers {';
    if (enabled(headers).length) {
      bru += `\n${indentString(
        enabled(headers)
          .map((item) => `${item.name}: ${item.value}`)
          .join('\n')
      )}`;
    }

    if (disabled(headers).length) {
      bru += `\n${indentString(
        disabled(headers)
          .map((item) => `~${item.name}: ${item.value}`)
          .join('\n')
      )}`;
    }

    bru += '\n}\n\n';
  }

  if (auth && auth.awsv4) {
    bru += `auth:awsv4 {
${indentString(`accessKeyId: ${auth.awsv4.accessKeyId}`)}
${indentString(`secretAccessKey: ${auth.awsv4.secretAccessKey}`)}
${indentString(`sessionToken: ${auth.awsv4.sessionToken}`)}
${indentString(`service: ${auth.awsv4.service}`)}
${indentString(`region: ${auth.awsv4.region}`)}
${indentString(`profileName: ${auth.awsv4.profileName}`)}
}

`;
  }

  if (auth && auth.basic) {
    bru += `auth:basic {
${indentString(`username: ${auth.basic.username}`)}
${indentString(`password: ${auth.basic.password}`)}
}

`;
  }

  if (auth && auth.bearer) {
    bru += `auth:bearer {
${indentString(`token: ${auth.bearer.token}`)}
}

`;
  }

  if (auth && auth.digest) {
    bru += `auth:digest {
${indentString(`username: ${auth.digest.username}`)}
${indentString(`password: ${auth.digest.password}`)}
}

`;
  }

  if (body && body.json && body.json.length) {
    bru += `body:json {
${indentString(body.json)}
}

`;
  }

  if (body && body.text && body.text.length) {
    bru += `body:text {
${indentString(body.text)}
}

`;
  }

  if (body && body.xml && body.xml.length) {
    bru += `body:xml {
${indentString(body.xml)}
}

`;
  }

  if (body && body.sparql && body.sparql.length) {
    bru += `body:sparql {
${indentString(body.sparql)}
}

`;
  }

  if (body && body.formUrlEncoded && body.formUrlEncoded.length) {
    bru += `body:form-urlencoded {`;
    if (enabled(body.formUrlEncoded).length) {
      bru += `\n${indentString(
        enabled(body.formUrlEncoded)
          .map((item) => `${item.name}: ${encodeURIComponent(item.value)}`)
          .join('\n')
      )}`;
    }

    if (disabled(body.formUrlEncoded).length) {
      bru += `\n${indentString(
        disabled(body.formUrlEncoded)
          .map((item) => `~${item.name}: ${encodeURIComponent(item.value)}`)
          .join('\n')
      )}`;
    }

    bru += '\n}\n\n';
  }

  if (body && body.multipartForm && body.multipartForm.length) {
    bru += `body:multipart-form {`;
    if (enabled(body.multipartForm).length) {
      bru += `\n${indentString(
        enabled(body.multipartForm)
          .map((item) => `${item.name}: ${item.value}`)
          .join('\n')
      )}`;
    }

    if (disabled(body.multipartForm).length) {
      bru += `\n${indentString(
        disabled(body.multipartForm)
          .map((item) => `~${item.name}: ${item.value}`)
          .join('\n')
      )}`;
    }

    bru += '\n}\n\n';
  }

  if (body && body.graphql && body.graphql.query) {
    bru += `body:graphql {\n`;
    bru += `${indentString(body.graphql.query)}`;
    bru += '\n}\n\n';
  }

  if (body && body.graphql && body.graphql.variables) {
    bru += `body:graphql:vars {\n`;
    bru += `${indentString(body.graphql.variables)}`;
    bru += '\n}\n\n';
  }

  if (parseInt(statusCode) > 0) {
    bru += `statusCode {\n`;
    bru += `${indentString(statusCode.toString())}`;
    bru += '\n}\n\n';
  }

  if (responseBody && responseBody.json && responseBody.json.length) {
    bru += `responseBody:json {
${indentString(responseBody.json)}
}

`;
  }

  if (responseBody && responseBody.text && responseBody.text.length) {
    bru += `responseBody:text {
${indentString(responseBody.text)}
}

`;
  }

  if (responseBody && responseBody.xml && responseBody.xml.length) {
    bru += `responseBody:xml {
${indentString(responseBody.xml)}
}

`;
  }

  return stripLastLine(bru);
};

module.exports = jsonToExampleBru;