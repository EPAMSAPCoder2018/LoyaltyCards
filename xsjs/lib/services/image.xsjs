$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var type = $.request.method;
var responseBody = {};
switch ($.request.method) {
case $.net.http.GET:
	var id = $.request.parameters.get("id");
	responseBody = getImage(id);
	$.xs.requestUtil.prepareCustomResponse(responseBody, "image/png");
	break;

case $.net.http.POST:
	responseBody = createImage();
	$.xs.requestUtil.prepareCustomResponse(responseBody, "image/png");
	break;
}

function getImage(id) {
	var connection = $.xs.dbUtil.getConnection();
	var from = $.request.parameters.get("source");
	if (id && from) {
		try {
			// /*id <INTEGER>*/,
			// /*customerId <INTEGER>*/,
			// ''/*photo <BLOB>*/
			var selectStatement = '';
			switch (from) {
			case "staging":
				selectStatement = 'SELECT "photo" as "data" FROM "LoyaltyCards.photoStaging" WHERE "id"=?';
				break;
			case "customer":
				selectStatement = 'SELECT "photo" as "data" FROM "LoyaltyCards.CustomersPhoto" WHERE "id"=?';
				break;
			case "shop":
				selectStatement = 'SELECT "logo" as "data" FROM "LoyaltyCards.Shops" WHERE "ID"=?';
				break;
			}

			var image = connection.executeQuery(selectStatement, id);
			image = image[0].data;
			return image;
		} catch (e) {
			throw e;
		}
	}
	return null;
}

function createImage() {
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