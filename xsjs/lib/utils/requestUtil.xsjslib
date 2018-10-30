$.xs = $.xs || {};
$.xs.requestUtil = {
	/*
	 * { "key1" : "value1", ......, "keyN":"valueN"}
	 * return url?key1=valu1&.....&keyN=valueN
	 */
	prepareUrl: function (url, parameters) {
		var parametersArray = [];
		if (parameters) {
			Object.keys(parameters).forEach(function (parameterName) {
				if (parameters[parameterName]) {
					parametersArray.push(parameterName + "=" + parameters[parameterName]);
				}
			});
			if (parametersArray.length > 0) {
				return url + "?" + parametersArray.join("&");
			}
		}
		return url;
	},

	prepareResponse: function (responseBody) {
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify(responseBody));
	},

	prepareCustomResponse: function (responseBody, contentType) {
		$.response.contentType = contentType;
		$.response.setBody(responseBody);
	},

	extractMultiPartParameters: function () {
		var entities = $.request.entities;
		var multiparts = $.request.entities.length === 0 ? null : {};

		//Function returns entity parameter as JSON {name : val, value : val}.
		var getParameter = function (entity) {
			if (entity.parameters) {
				var i;
				for (i = 0; i < entity.parameters.length; i++) {
					var attachmentName = entity.parameters[i].name;
					if (attachmentName) {
						return {
							name: attachmentName,
							value: entity.parameters[i].value
						};
					}
				}
			}
			return null;
		};

		//Function returns entity header value by header name.
		var getEntityHeaderValue = function (entity, headerName) {
			if (entity.headers) {
				var i;
				for (i = 0; i < entity.headers.length; i++) {
					if (entity.headers[i].name && (entity.headers[i].name === headerName)) {
						return entity.headers[i].value;
					}
				}
			}

			return null;
		};

		//Function checks if given extension is in the list of
		//allowed extensions. 
		//Returns true, if is in the list; false - otherwise.
		var extensionIsAllowed = function (extension) {
			var rawAllowedExtensions = $.workspace.property("security.allowedAttachmentsExtensions");
			var parsedAllowedExtensions = rawAllowedExtensions.split(';');
			var allowed = false;

			parsedAllowedExtensions.forEach(function (allowedExt) {
				if (allowedExt.toUpperCase() === extension.toUpperCase()) {
					allowed = true;
				}
			});

			return allowed;
		};

		//iterate over all request entities and find attachments and parameters
		for (var i = 0; i < entities.length; i++) {
			var contentName = getEntityHeaderValue(entities[i], "~content_name");
			//it means attachment
			if (contentName) {
				var file = {};
				file.mimeType = entities[i].contentType;
				file.data = entities[i].body.asArrayBuffer();
				file.name = getEntityHeaderValue(entities[i], "~content_filename");
				if (file.name) {
					if (multiparts[contentName]) {
						if (multiparts[contentName].push) {
							multiparts[contentName].push(file);
						} else {
							multiparts[contentName] = [multiparts[contentName], file];
						}
					} else {
						multiparts[contentName] = file;
					}
				}
			}
			//otherwise check parameter
			else {
				var parameter = getParameter(entities[i]);
				if (parameter.name && parameter.value) {
					multiparts[parameter.name] = parameter.value;
				}
			}
		}
		return multiparts;
	}
};