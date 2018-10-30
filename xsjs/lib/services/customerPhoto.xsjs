$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var type = $.request.method;
var responseBody = {};
switch ($.request.method) {
case $.net.http.GET:
	var photoId = $.request.parameters.get("id");
	responseBody = getPhoto(photoId);
	$.xs.requestUtil.prepareCustomResponse(responseBody, "image/png");
	break;

case $.net.http.POST:
	responseBody = createPhoto();
	$.xs.requestUtil.prepareCustomResponse(responseBody, "image/png");
	break;
}

function getPhoto(photoId) {
	var connection = $.xs.dbUtil.getConnection();
	var fromStaging = $.request.parameters.get("fromStaging") === "true";
	if (photoId) {
		try {
			// /*id <INTEGER>*/,
			// /*customerId <INTEGER>*/,
			// ''/*photo <BLOB>*/
			var selectPhotoStatement = 'SELECT "photo" FROM ' + fromStaging ? '"LoyaltyCards.photoStaging"' : '"LoyaltyCards.CustomersPhoto"' +
				' WHERE "id"=?';
			var photo = connection.executeQuery(selectPhotoStatement, photoId)[0].photo;
			return photo;
		} catch (e) {
			throw e;
		}
	}
	return null;
}

function createPhoto() {
	var connection = $.xs.dbUtil.getConnection();
	try {
		// /*id <INTEGER>*/,
		// /*customerId <INTEGER>*/,
		// ''/*photo <BLOB>*/
		var customerData = $.xs.requestUtil.extractMultiPartParameters();
		var insertPhotosStatement = 'INSERT INTO "LoyaltyCards.photoStaging" VALUES("seq::customerPhotoSeq".nextVal,?)';
		var dataToInsert = [];
		for (var i = 0; i < customerData.photos.length; i++) {
			dataToInsert.push([customerData.photos[i].data]);
		}
		var res = connection.executeUpdate(insertPhotosStatement, dataToInsert);
		connection.commit();
		return res;
	} catch (e) {
		throw e;
	}
}